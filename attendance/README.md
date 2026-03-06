# No Proxy Attendance Portal

> Submit permission letters transparently and maintain attendance integrity.

A modern web application for managing student permission letters related to attendance. Students upload permission letters, and admins can view, search, filter, and export all submissions.

![Theme](https://img.shields.io/badge/Theme-Academic%20Integrity-0a1628)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%2B%20Express%20%2B%20SQLite-4a90d9)

## Features

### Student Interface
- Upload permission letters (PDF or images)
- Enter roll number, name, and reason
- Drag & drop file upload with visual feedback
- Success/error notifications

### Admin Dashboard
- Secure login (session-based auth)
- View all submissions in a sortable table
- Search by roll number
- Filter by date range
- Download submissions as CSV
- Preview image files in modal
- Delete individual submissions
- Real-time statistics cards

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| File Upload | Multer |
| Auth | Express-session |
| CSV Export | csv-writer |

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or higher

### Installation

```bash
# Navigate to the project directory
cd attendance

# Install dependencies
npm install

# Start the server
npm start
```

The server will start at **http://localhost:3000**


> ⚠️ **Change these credentials in `server.js` before deploying to production.**

## Project Structure

```
attendance/
├── server.js          # Express server + API routes
├── index.html         # Student submission page
├── admin.html         # Admin dashboard
├── styles.css         # Design system & styles
├── package.json       # Dependencies
├── attendance.db      # SQLite database (auto-created)
├── uploads/           # Uploaded files (auto-created)
└── README.md          # This file
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/submit` | Submit permission letter | No |
| POST | `/api/admin/login` | Admin login | No |
| GET | `/api/admin/logout` | Admin logout | Yes |
| GET | `/api/admin/check` | Check auth status | No |
| GET | `/api/submissions` | Get all submissions | Yes |
| GET | `/api/submissions/csv` | Download CSV | Yes |
| DELETE | `/api/submissions/:id` | Delete submission | Yes |

## Deployment

### Render
1. Push code to a Git repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variable: `PORT=3000`

### Railway / Fly.io
Similar setup — connect your repo and configure start command as `npm start`.

> **Note:** For platforms like Vercel/Netlify (static-only), you'll need to deploy the backend separately or use a full-stack platform like Render or Railway.

## License

MIT
