import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const { count, error } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString())
            .lte('created_at', todayEnd.toISOString());

        if (error) throw error;

        return res.status(200).json({ count: count || 0 });
    } catch (err) {
        console.error('Count error:', err);
        return res.status(200).json({ count: 0 });
    }
}
