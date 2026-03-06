import { verifyToken } from '../../lib/auth.js';
import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
    const decoded = verifyToken(req);
    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { search, dateFrom, dateTo } = req.query;
        let query = supabase.from('submissions').select('*');

        if (search) {
            query = query.ilike('roll_number', `%${search}%`);
        }

        if (dateFrom) {
            query = query.gte('created_at', dateFrom);
        }

        if (dateTo) {
            // Add time to dateTo to include the whole day
            query = query.lte('created_at', `${dateTo}T23:59:59.999Z`);
        }

        const { data, error } = await query.order('roll_number', { ascending: true });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('Fetch error:', err);
        return res.status(500).json({ error: 'Failed to fetch submissions.' });
    }
}
