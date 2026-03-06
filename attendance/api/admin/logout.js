export default async function handler(req, res) {
    // Logout is handled client-side by deleting the token,
    // but we provide this endpoint for consistency if needed.
    return res.status(200).json({ success: true, message: 'Logged out.' });
}
