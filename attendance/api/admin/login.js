import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || '';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASS_HASH)) {
        const token = signToken({ isAdmin: true, user: username });
        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: token
        });
    } else {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }
}
