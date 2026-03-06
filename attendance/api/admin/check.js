import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
    const decoded = verifyToken(req);
    return res.status(200).json({ isAdmin: !!decoded });
}
