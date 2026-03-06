# No Proxy Attendance Portal (Vercel Edition)

> Submit permission letters transparently and maintain attendance integrity.

A serverless web application for managing student permission letters related to attendance. Students upload letters directly to cloud storage, and admins manage everything via a secure dashboard.

![Theme](https://img.shields.io/badge/Theme-Academic%20Integrity-0a1628)
![Stack](https://img.shields.io/badge/Stack-Supabase%20%2B%20Vercel%20Blob-4a90d9)

## Features

### Student Interface
- Cloud-based uploads (Vercel Blob)
- Real-time duplicate submission prevention
- Instant success receipt card
- Mobile-first responsive design

### Admin Dashboard
- **JWT Authentication** for persistent security
- Cloud database powered by **Supabase**
- Real-time statistics and unique student tracking
- Full search, date filtering, and CSV export
- File preview and bulk deletion tools

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| API | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Storage | Vercel Blob |
| Auth | JWT (JsonWebToken) + BcryptJS |

## Getting Started

### Prerequisites
- [Vercel CLI](https://vercel.com/docs/cli) installed (`npm install -g vercel`)
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start-dev
```

The server will start at **http://localhost:3000** (via Vercel CLI).

### Environment Variables
Create a `.env` file based on `.env.example`:
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `JWT_SECRET`
- `ADMIN_USER` & `ADMIN_PASS_HASH`

## Project Structure

```
attendance/
├── api/                 # Serverless API routes
├── lib/                 # Shared logic (Supabase, Auth)
├── public/              # Frontend (served as static)
├── vercel.json          # Deployment config
├── package.json         # Scripts and dependencies
└── README.md            # This file
```

## Deployment

1. Push this folder to a GitHub repository.
2. Connect the repository to **Vercel**.
3. Add the environment variables from your `.env` to Vercel Settings.
4. Run the SQL from the implementation plan in your Supabase SQL Editor to create the `submissions` table.

## License
MIT
