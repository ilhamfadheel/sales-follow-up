# Sales Follow-Up Management

> **Built to test and evaluate [Kimi Code CLI](https://github.com/MoonshotAI/Kimi-Code-CLI)** — an AI-powered coding agent.

This project was created as a practical evaluation of Kimi Code CLI's capabilities in building a full-stack application from scratch based on a simple requirements document.

---

## Purpose

The goal was to see how effectively Kimi Code CLI could:

1. **Interpret requirements** from a plain-text test document
2. **Research best practices** for UI/UX (specifically CRM data table design)
3. **Architect a full-stack app** with Next.js App Router, client-server communication, and database persistence
4. **Write production-quality code** with proper TypeScript types, error handling, loading states, and responsive design
5. **Debug real issues** (e.g., native module compilation failures and switching to a WASM-based SQLite solution)

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Modern React framework with server-side API routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety across the entire stack |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS for rapid, consistent UI |
| **HTTP Client** | [Axios](https://axios-http.com/) | Request/response interceptors, auto JSON parsing, better error handling |
| **Database** | [SQLite](https://www.sqlite.org/) via [sql.js](https://sql.js.org/) | Zero-config, serverless, file-based SQL. Uses WASM to avoid native compilation issues |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |

---

## Features

### Core Requirements
- [x] Fetch lead data from a REST API
- [x] Display data in a rich table view
- [x] Search by name or phone number (debounced)
- [x] Filter by status (`new`, `contacted`, `closed`)
- [x] Add a new lead via modal form
- [x] Update a lead's follow-up status inline
- [x] Loading, empty, and error UI states
- [x] Runs locally for live demo

### UX Enhancements (from research)
- **Skeleton loaders** — match table layout to reduce perceived wait time
- **Toast notifications** — instant feedback on actions
- **Inline status dropdown** — update without leaving the page
- **Icon + color badges** — accessibility-compliant status indicators
- **Responsive design** — full table on desktop, stacked cards on mobile
- **Pagination** — server-side with smart page ellipsis

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000
```

The SQLite database (`data/leads.db`) is created automatically on first run and seeded with 7 sample leads.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/demo/meta` | Get available status enums |
| `GET` | `/api/demo/leads` | List leads (supports `keyword`, `status`, `page`, `pageSize`) |
| `POST` | `/api/demo/leads` | Create a new lead |
| `GET` | `/api/demo/leads/:id` | Get a single lead |
| `PATCH` | `/api/demo/leads/:id/status` | Update lead status |

---

## What Was Tested

| Capability | Result |
|------------|--------|
| Read & parse test requirements | ✅ Extracted requirements from test document |
| Research UI/UX best practices | ✅ Deep research on CRM table design patterns |
| Full-stack architecture | ✅ Next.js App Router + API routes + DB |
| Database choice | ✅ Chose SQLite for zero-config local dev |
| Problem solving | ✅ Switched from `better-sqlite3` (C++ compile failure on Node 25) to `sql.js` (WASM) |
| Code quality | ✅ TypeScript, proper error handling, loading/empty/error states |
| Refactoring | ✅ Converted `h-* w-*` pairs to `size-*` shorthand across codebase |

---

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/demo/           # REST API routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Main dashboard
├── components/             # 12 React components
├── lib/
│   ├── db.ts               # sql.js database layer
│   └── api.ts              # Axios API client
├── types/
│   └── lead.ts             # TypeScript interfaces
├── data/leads.db           # SQLite database (auto-created)
├── README.md
├── SKILL.md                # Detailed project documentation
└── package.json
```

---

## License

MIT — Built for evaluation purposes.
