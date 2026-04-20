# Sales Follow-Up Management — Project Skill

## Overview

This is a **Next.js 14 App Router** project for a Sales Follow-Up / Lead Management dashboard. It demonstrates a complete full-stack CRUD application with a focus on table UX best practices, clean UI states, and SQLite database architecture.

## Architecture

```
┌─────────────────┐      axios       ┌──────────────────┐
│   React Client  │ ◄──────────────► │  Next.js API     │
│  (App Router)   │   REST JSON      │  (Node.js)       │
└─────────────────┘                  └──────────────────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │    sql.js    │
                                       │  (SQLite WASM│
                                       │   .db file)  │
                                       └──────────────┘
```

### Why sql.js (SQLite)?

**sql.js** is SQLite compiled to WebAssembly, running entirely in JavaScript with no native dependencies:
- Zero compilation issues across Node.js versions (no node-gyp, no C++ toolchains)
- The database is a single local file (`data/leads.db`)
- No separate database server to install or run
- Data persists across server restarts
- Can run in both browser and Node.js environments
- Perfect for demos, prototypes, and small-to-medium applications

### Why Axios?

Axios is used for HTTP requests from the client to Next.js API routes because it provides:
- Request/response interceptors for consistent error handling
- Automatic JSON parsing
- Request timeout and cancellation support
- Better error messages than raw `fetch`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Database | SQLite (sql.js / WASM) |
| Icons | Lucide React |

## Table UX Design Decisions

Based on deep research into CRM and data table best practices, the following patterns were implemented:

### 1. Loading Skeleton
- Shows a shimmer-style placeholder matching the table layout
- Reduces perceived wait time and prevents layout shift

### 2. Empty States
- Distinguishes between "no data at all" and "no search results"
- Provides clear call-to-action (e.g., "Clear filters")

### 3. Error States
- Full-screen error with retry button
- Network errors handled gracefully via axios interceptors

### 4. Inline Status Updates
- Dropdown directly in the table row for quick status changes
- No page navigation required
- Disabled state during update to prevent double-clicks

### 5. Status Badges with Icons + Color
- Not relying on color alone (accessibility best practice)
- Each status has a distinct icon and label
- `new` → blue circle, `contacted` → amber phone, `closed` → green check

### 6. Responsive Design
- Desktop: Full HTML table with sticky headers
- Mobile: Card-based layout stacked vertically
- Touch-friendly tap targets (minimum 44px)

### 7. Search & Filter
- Debounced search input (300ms) to reduce API calls
- Filter pills for status selection
- Both work together with server-side filtering

### 8. Pagination
- Server-side pagination with page numbers
- Smart ellipsis for large page counts
- Shows "Showing X to Y of Z" info

### 9. Micro-interactions
- Toast notifications for success/error feedback
- Row hover highlight
- Button press states
- Modal enter/exit animations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/demo/meta` | Get status enums |
| GET | `/api/demo/leads` | List leads (with query filters) |
| POST | `/api/demo/leads` | Create new lead |
| GET | `/api/demo/leads/:id` | Get single lead |
| PATCH | `/api/demo/leads/:id/status` | Update lead status |

### Query Parameters for GET /leads
- `keyword` — fuzzy search on name or phone
- `status` — filter by status
- `page` — page number (default: 1)
- `pageSize` — items per page (default: 10, max: 50)

### Error Response Format
```json
{
  "detail": {
    "code": "VALIDATION_ERROR",
    "message": "phone must be an 11-digit mobile number"
  }
}
```

## File Structure

```
.
├── app/
│   ├── api/demo/
│   │   ├── meta/route.ts
│   │   └── leads/
│   │       ├── route.ts
│   │       ├── [id]/route.ts
│   │       └── [id]/status/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SearchBar.tsx
│   ├── StatusFilter.tsx
│   ├── StatusBadge.tsx
│   ├── StatusDropdown.tsx
│   ├── LeadTable.tsx
│   ├── LeadCard.tsx
│   ├── AddLeadModal.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── LoadingSkeleton.tsx
│   └── Pagination.tsx
├── lib/
│   ├── db.ts          # sql.js database setup
│   └── api.ts         # Axios API client
├── types/
│   └── lead.ts        # TypeScript interfaces
├── data/              # SQLite database file (auto-created)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── SKILL.md           # This file
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

The database file (`data/leads.db`) is created automatically on first run with seed data.

## Extending the Project

### Adding a New Field
1. Update `types/lead.ts` — add field to `Lead` interface
2. Update `lib/db.ts` — add column to schema (recreate db or add migration)
3. Update API routes — handle new field in POST/PATCH
4. Update `components/LeadTable.tsx` and `components/LeadCard.tsx` — display field
5. Update `components/AddLeadModal.tsx` — allow editing field

### Switching to Native SQLite (better-sqlite3)

If you want synchronous native SQLite instead of sql.js:
1. Replace `sql.js` with `better-sqlite3` in package.json
2. Refactor `lib/db.ts` to use synchronous `better-sqlite3` API
3. Update API routes to be synchronous (remove async/await from db calls)
4. Note: `better-sqlite3` requires a C++ compiler and may fail on bleeding-edge Node.js versions

### Switching to PostgreSQL / MySQL
1. Replace `sql.js` with `pg` or `mysql2`
2. Update connection logic in `lib/db.ts`
3. Update SQL syntax if needed (SQLite is mostly standard)
4. Add environment variables for database credentials

## Key Learnings

1. **sql.js avoids native compilation** — pure WASM means it works on any Node.js version without node-gyp
2. **Manual persistence required** — sql.js keeps DB in memory; call `saveDb()` to write to disk
3. **Debounce search** — 300ms delay prevents API spam while typing
4. **Optimistic UI** — status updates reflect immediately in UI before API confirms
5. **Mobile-first cards** — on small screens, tables become stacked cards for readability
6. **WASM startup cost** — sql.js has a small initialization overhead on first request
