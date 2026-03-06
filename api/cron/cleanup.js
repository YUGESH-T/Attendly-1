import { supabase } from '../../lib/supabase.js';
import { del } from '@vercel/blob';

export default async function handler(req, res) {
    // 1. Verify Cron Secret (Security)
    // Vercel sends this header if CRON_SECRET is configured
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 2. Calculate "24 hours ago"
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        // 3. Find old submissions
        const { data: oldSubmissions, error: fetchError } = await supabase
            .from('submissions')
            .select('id, file_url')
            .lt('created_at', oneDayAgo.toISOString());

        if (fetchError) throw fetchError;

        if (!oldSubmissions || oldSubmissions.length === 0) {
            return res.status(200).json({ success: true, message: 'No old submissions to clean up.' });
        }

        // 4. Delete files from Vercel Blob
        const fileUrls = oldSubmissions.map(s => s.file_url).filter(Boolean);
        if (fileUrls.length > 0) {
            try {
                await del(fileUrls);
            } catch (blobErr) {
                console.error('Cron Blob delete error:', blobErr);
                // Continue even if blob deletion fails for some files
            }
        }

        // 5. Delete records from Supabase
        const idsToDelete = oldSubmissions.map(s => s.id);
        const { error: deleteError } = await supabase
            .from('submissions')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) throw deleteError;

        return res.status(200).json({
            success: true,
            message: `Cleaned up ${idsToDelete.length} submissions and their files.`
        });
    } catch (err) {
        console.error('Cleanup Cron error:', err);
        return res.status(500).json({ error: 'Cleanup failed' });
    }
}
