import { put } from '@vercel/blob';
import { supabase } from '../lib/supabase.js';
import formidable from 'formidable';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    api: {
        bodyParser: false, // Disable built-in body parser to handle multipart
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = formidable({});

    try {
        const [fields, files] = await form.parse(req);

        // In formidable v3, fields and files are arrays
        const rollNumber = fields.rollNumber?.[0]?.trim();
        const name = fields.name?.[0]?.trim() || '';
        const reason = fields.reason?.[0]?.trim() || '';
        const file = files.permissionFile?.[0];

        if (!rollNumber || !file) {
            return res.status(400).json({ error: 'Roll number and permission file are required.' });
        }

        // 1. Check for duplicate submission today in Supabase
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const { data: existing, error: checkError } = await supabase
            .from('submissions')
            .select('id')
            .eq('roll_number', rollNumber)
            .gte('created_at', todayStart.toISOString())
            .lte('created_at', todayEnd.toISOString())
            .single();

        if (existing) {
            return res.status(409).json({
                error: `Roll number ${rollNumber} has already submitted a permission letter today.`,
                duplicate: true
            });
        }

        // 2. Upload file to Vercel Blob
        const fileBuffer = fs.readFileSync(file.filepath);
        const blob = await put(`submissions/${Date.now()}-${file.originalFilename}`, fileBuffer, {
            access: 'public',
            contentType: file.mimetype,
        });

        // 3. Insert into Supabase
        const { data, error: insertError } = await supabase
            .from('submissions')
            .insert([
                {
                    roll_number: rollNumber,
                    name: name,
                    reason: reason,
                    file_url: blob.url,
                    original_name: file.originalFilename,
                }
            ])
            .select()
            .single();

        if (insertError) throw insertError;

        // 4. Return receipt
        const now = new Date();
        return res.status(200).json({
            success: true,
            message: 'Permission letter submitted successfully!',
            receipt: {
                rollNumber: rollNumber,
                name: name,
                submittedAt: now.toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true
                })
            }
        });

    } catch (err) {
        console.error('Submit error:', err);
        return res.status(500).json({ error: 'Failed to submit. Please try again.' });
    }
}
