import { verifyToken } from '../../lib/auth.js';
import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { search, dateFrom, dateTo } = req.query;
        let query = supabase.from('submissions').select('*');

        if (search) query = query.ilike('roll_number', `%${search}%`);
        if (dateFrom) query = query.gte('created_at', dateFrom);
        if (dateTo) query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);

        const { data: rows, error } = await query.order('roll_number', { ascending: true });
        if (error) throw error;

        // Generate CSV in-memory
        const header = ['Roll Number', 'Name', 'Reason', 'File URL', 'Date & Time'];
        const csvRows = [
            header.join(','),
            ...rows.map(row => [
                `"${row.roll_number}"`,
                `"${row.name || ''}"`,
                `"${(row.reason || '').replace(/"/g, '""')}"`,
                `"${row.file_url}"`,
                `"${row.created_at}"`
            ].join(','))
        ];

        const csvString = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="submissions.csv"');
        return res.status(200).send(csvString);
    } catch (err) {
        console.error('CSV error:', err);
        return res.status(500).json({ error: 'Failed to export CSV.' });
    }
}
