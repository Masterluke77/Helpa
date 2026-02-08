# Helpa - Neighborhood Web App

A full-stack Next.js application for local neighborhood requests and deals.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + PostGIS (via Prisma)
- **Auth**: Auth.js (NextAuth) v5
- **Styling**: Tailwind CSS + Shadcn/ui
- **Realtime**: Socket.io (separate service in `apps/websocket-server`)
- **Storage**: MinIO (S3 compatible)
- **Infrastructure**: Docker Compose

## Prerequisites
- Docker & Docker Compose
- Node.js 18+

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Infrastructure (Docker)**:
   ```bash
   cd infra
   docker compose up -d
   ```
   *Note: Ensure Docker Desktop is running. This starts Postgres, MinIO, and Redis.*

3. **Setup Database**:
   ```bash
   # From root
   npx prisma generate
   # Push schema to DB
   npx prisma db push
   # Seed data
   npx prisma db seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

   - Web App: [http://localhost:3000](http://localhost:3000)
   - Websocket Server: [http://localhost:3001](http://localhost:3001)
   - MinIO Console: [http://localhost:9001](http://localhost:9001) (user: minioadmin / pass: minioadmin)

## Features & Verification
- **Login**: Use Email (magic link simulation) or Google (configure `.env`).
- **Requests**: Go to `/requests` to see local requests. Filter by radius.
- **Create**: Click `Create Request`, upload images (saved to MinIO), sets location.
- **Map**: View requests on Mapbox map (needs `NEXT_PUBLIC_MAPBOX_TOKEN`).
- **Offers**: Open a request (not your own) to make an offer.
- **Chat**: Accept an offer to start a realtime chat.
- **Admin**: Login with `admin@helpa.local` (seeded) to access `/admin`.

## Environment Variables
See `.env.example`. Copy to `.env` and fill in secrets (Google ID, Mapbox Token).

## Architecture Decisions
- **Monorepo**: Turborepo used for clear separation of `web`, `db`, `shared`, and `websocket-server`.
- **Realtime**: Chosen Socket.io over Supabase Realtime for full control and custom event logic in a dedicated Node.js service.
- **Geolocation**: PostGIS used for efficient spatial queries (`ST_DWithin`) which performance better than basic Haversine formula in app code.
- **Validation**: Zod used throughout (API & Frontend) via `packages/shared`.

## Deployment
For easy deployment with Portainer, see [PORTAINER.md](PORTAINER.md).
