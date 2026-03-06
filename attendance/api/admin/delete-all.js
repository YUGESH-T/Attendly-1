import { verifyToken } from '../../lib/auth.js';
import { supabase } from '../../lib/supabase.js';
import { del, list } from '@vercel/blob';

export default async function handler(req, res) {
    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Delete all blobs in the 'submissions/' path
        try {
            const { blobs } = await list({ prefix: 'submissions/' });
            if (blobs.length > 0) {
                await del(blobs.map(b => b.url));
            }
        } catch (blobErr) {
            console.error('Bulk blob delete error:', blobErr);
        }

        // 2. Clear Supabase table
        const { error } = await supabase
            .from('submissions')
            .delete()
            .neq('id', 0); // Delete all rows

        if (error) throw error;

        return res.status(200).json({ success: true, message: 'All submissions and files deleted.' });
    } catch (err) {
        console.error('Bulk delete error:', err);
        return res.status(500).json({ error: 'Failed to delete all submissions.' });
    }
}
