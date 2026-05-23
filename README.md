# SmartSub

SmartSub detects recurring subscriptions from bank transaction CSV files and provides a dashboard to track spending, upcoming payments, and potential savings.

## Tech Stack

**Backend:** Node.js, Express.js, PostgreSQL / Supabase, Multer, CSV Parser  
**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase project)

### Backend

```bash
# From repo root
cp .env.example .env   # configure DB credentials
npm install
npm run dev            # runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # runs on http://localhost:3001
```

The frontend reads `NEXT_PUBLIC_API_BASE_URL` from `frontend/.env.local` (defaults to `http://localhost:3000`).

## Features

- Upload transaction CSV files
- Parse and validate CSV rows
- Store transactions in PostgreSQL
- Detect recurring subscriptions
- Estimate billing cycle and next payment date
- Calculate monthly subscription spending
- Generate upcoming payment notifications
- Potential savings estimation
- Reset demo data

## Project Structure

```txt
smartsub-backend/
├── index.js
├── package.json
├── README.md
├── .env
├── .gitignore
├── uploads/
├── src/
│   ├── config/
│   ├── routes/
│   ├── services/
│   └── utils/
└── frontend/
    ├── src/
    │   ├── app/          # Next.js pages
    │   ├── components/   # Reusable UI
    │   ├── services/     # API client
    │   └── types/        # TypeScript interfaces
    ├── package.json
    └── .env.local
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /imports | Upload CSV file |
| GET | /transactions | List transactions |
| POST | /subscriptions/detect/:import_id | Detect subscriptions |
| GET | /subscriptions | List subscriptions |
| GET | /subscriptions/:id | Subscription details |
| GET | /notifications | Upcoming payments |
| GET | /summary/monthly | Monthly spending summary |
| DELETE | /demo/reset | Reset demo data |
