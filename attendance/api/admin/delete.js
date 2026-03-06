import { verifyToken } from '../../lib/auth.js';
import { supabase } from '../../lib/supabase.js';
import { del } from '@vercel/blob';

export default async function handler(req, res) {
    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Submission ID is required.' });
    }

    try {
        // 1. Get file_url to delete from blobs
        const { data: row, error: fetchError } = await supabase
            .from('submissions')
            .select('file_url')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        if (row?.file_url) {
            try {
                await del(row.file_url);
            } catch (blobErr) {
                console.error('Blob delete error:', blobErr);
                // Continue even if blob delete fails
            }
        }

        // 2. Delete from Supabase
        const { error: deleteError } = await supabase
            .from('submissions')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        return res.status(200).json({ success: true, message: 'Submission deleted.' });
    } catch (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ error: 'Failed to delete submission.' });
    }
}
