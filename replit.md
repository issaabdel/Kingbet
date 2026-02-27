# Kingbet - Sports Betting Predictions App

## Overview

Kingbet is a mobile-first sports betting predictions web application with a futuristic dark/neon aesthetic. Users can browse free daily predictions, access VIP (locked) predictions, view historical results by date, and read admin announcements. An admin dashboard (protected by PIN) allows managing predictions and messages. The app is built as a full-stack TypeScript monorepo with a React frontend and Express backend, using PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project follows a three-folder monorepo pattern:
- **`client/`** — React SPA (Vite-based)
- **`server/`** — Express API server
- **`shared/`** — Shared types, schemas, and API contracts used by both client and server

### Frontend (`client/src/`)
- **Framework:** React with TypeScript
- **Routing:** Wouter (lightweight client-side router)
- **State/Data Fetching:** TanStack React Query for server state management
- **UI Components:** Shadcn/ui (new-york style) built on Radix UI primitives
- **Styling:** Tailwind CSS with CSS variables for theming (dark mode by default, neon purple/violet primary, gold VIP accents)
- **Animations:** Framer Motion for card and page transitions
- **Forms:** React Hook Form with Zod resolvers
- **Icons:** Lucide React
- **Key Pages:**
  - `/` — Home with announcements and highlights
  - `/free` — Free predictions with date picker
  - `/vip` — VIP predictions (locked/unlocked state, simulated payment)
  - `/history` — Historical predictions by date
  - `/admin-login` — PIN-based admin authentication
  - `/admin/dashboard` — Admin CRUD for predictions and messages
- **Path aliases:** `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend (`server/`)
- **Framework:** Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Pattern:** RESTful JSON API under `/api/` prefix
- **API Contract:** Defined in `shared/routes.ts` using Zod schemas, shared between client and server
- **Session Management:** `express-session` with `memorystore` (in-memory session store)
- **Admin Auth:** Simple PIN-based authentication (`20077002`) stored in session. Not production-grade — uses session flag `isAdmin`.
- **Dev Server:** Vite dev server middleware integrated for HMR during development
- **Production:** Static files served from `dist/public/` with SPA fallback
- **Build:** Custom build script using esbuild (server) + Vite (client), outputs to `dist/`

### Database & ORM
- **Database:** PostgreSQL (required via `DATABASE_URL` environment variable)
- **ORM:** Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema file:** `shared/schema.ts` — defines two tables:
  - `predictions` — match name, time, bet type, odds, confidence, category (free/vip), status (pending/won/lost), date, locked flag
  - `messages` — content, optional link, timestamp
- **Migrations:** Drizzle Kit with `drizzle-kit push` command (no migration files checked in by default)
- **Storage layer:** `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class using Drizzle queries

### API Endpoints
All defined in `server/routes.ts`:
- `GET /api/predictions` — List predictions (filterable by date, category)
- `POST /api/predictions` — Create prediction (admin only)
- `PATCH /api/predictions/:id` — Update prediction (admin only)
- `DELETE /api/predictions/:id` — Delete prediction (admin only)
- `GET /api/messages` — List messages
- `POST /api/messages` — Create message (admin only)
- `DELETE /api/messages/:id` — Delete message (admin only)
- `POST /api/admin/login` — Admin PIN login
- `POST /api/admin/logout` — Admin logout
- `GET /api/admin/check` — Check admin session status

### Key Design Decisions
1. **Shared API contract** — Zod schemas in `shared/routes.ts` define both request/response shapes, enabling type-safe client hooks
2. **Mobile-first design** — Max-width containers (max-w-md), bottom navigation bar, touch-friendly date pickers
3. **VIP locking is client-side** — VIP content visibility is simulated on the frontend (no real payment integration yet)
4. **Session-based admin** — No user registration system; admin is a single role authenticated by PIN

## External Dependencies

### Required Services
- **PostgreSQL** — Primary database. Must be provisioned and `DATABASE_URL` environment variable set. Used via `pg` driver + Drizzle ORM.

### Key NPM Packages
- **Frontend:** React, Vite, Wouter, TanStack React Query, Shadcn/ui (Radix primitives), Tailwind CSS, Framer Motion, React Hook Form, Zod, date-fns, Lucide React
- **Backend:** Express 5, express-session, memorystore, Drizzle ORM, pg (node-postgres), drizzle-zod
- **Build Tools:** tsx (TypeScript execution), esbuild (server bundling), Vite (client bundling), Drizzle Kit (DB schema management)
- **Replit-specific:** `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `NODE_ENV` — Controls dev vs production mode