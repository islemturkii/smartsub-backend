# SmartSub

SmartSub detects recurring subscriptions from bank transaction CSV files and provides a dashboard to track spending, upcoming payments, and potential savings.

## Tech Stack

**Backend:** Node.js, Express.js, PostgreSQL, Multer, CSV Parser  
**Frontend:** Next.js (App Router), TypeScript, Tailwind CSS

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Database

```bash
# Create database and run schema
psql -U postgres -c "CREATE DATABASE smartsub;"
psql -U postgres -d smartsub -f schema.sql
```

### 2. Backend

```bash
cp .env.example .env   # edit DATABASE_URL with your credentials
npm install
npm run dev            # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:3001
```

### 4. Demo Flow

1. Open http://localhost:3001
2. Go to **Upload** and import `sample-data/demo-transactions.csv`
3. View the **Dashboard** — subscriptions, spending, and savings appear
4. Click a subscription to see **Details** and transaction history
5. Check **Notifications** for upcoming payments

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
| GET | /savings | Potential savings analysis |
| DELETE | /demo/reset | Reset demo data |

## Project Structure

```
smartsub-backend/
├── index.js              # Express entry point
├── schema.sql            # Database schema
├── .env.example          # Environment template
├── sample-data/          # Demo CSV for testing
├── src/
│   ├── config/           # DB connection
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Helpers
└── frontend/
    ├── src/
    │   ├── app/          # Next.js pages
    │   ├── components/   # UI components
    │   ├── services/     # API client
    │   └── types/        # TypeScript interfaces
    └── .env.local        # Frontend config
```
