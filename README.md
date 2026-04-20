# EZ Subcontractor (Next.js)

This is a Next.js 14 frontend project.

## 1) Requirements

- Node.js 18.18+ (recommended Node.js 20 LTS)
- npm 9+

## 2) Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
copy .env.example .env
```

3. Fill values in `.env`.

Required variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

Optional:

- `NEXT_PUBLIC_PUSHER_APP_ID`

## 3) Run project

Development:

```bash
npm run dev
```

Open: `http://localhost:3000`

Production build test:

```bash
npm run build
npm run start
```

## 4) Database and data source

This repository is a frontend app and does **not** include a local database server setup.

Data is fetched from the backend API configured in:

- `NEXT_PUBLIC_API_BASE_URL`

If you want all dynamic data to appear, your backend API must be reachable and return valid data for all endpoints used by the frontend.

## 5) Troubleshooting

- If pages open but data is empty, verify `.env` values and backend API access.
- If auth/profile pages fail, check login token flow and backend auth endpoints.
- If map/autocomplete is missing, verify `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
- If Stripe pages fail, verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- If chat/realtime fails, verify pusher keys and cluster.
