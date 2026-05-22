# SmartSub Backend

SmartSub is a backend service that detects recurring subscriptions from bank transaction CSV files.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL / Supabase
- Multer
- CSV Parser
- Nodemon

## Features

- Upload transaction CSV files
- Parse and validate CSV rows
- Store transactions in PostgreSQL
- Detect recurring subscriptions
- Estimate billing cycle
- Estimate next payment date
- Calculate monthly subscription spending
- Generate upcoming payment notifications
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
└── src/
    ├── config/
    │   └── db.js
    ├── routes/
    ├── services/
    └── utils/