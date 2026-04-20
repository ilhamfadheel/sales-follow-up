import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

const DB_PATH = path.join(process.cwd(), "data", "leads.db");

const SOURCES = ["manual", "website", "referral", "social"];
const STATUSES = ["new", "contacted", "closed"] as const;
const OWNERS = ["Mia", "Amy", "Iris", "Unassigned"];

const NOTE_TEMPLATES = [
  "Booked product demo",
  "Quote sent",
  "Deal closed",
  "Waiting for first contact",
  "Following up",
  "Needs owner assigned",
  "Deal lost",
  "Requested callback",
  "Interested in enterprise plan",
  "Meeting scheduled for next week",
  "Sent follow-up email",
  "Price negotiation in progress",
  "Contract signed",
  "Onboarding scheduled",
  "Referred by existing client",
];

function generatePhone(): string {
  return "138" + String(Math.floor(10000000 + Math.random() * 90000000));
}

export function generateLeads(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const now = new Date().toISOString();
    return {
      id: `lead_${1000 + i + 1}`,
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      phone: generatePhone(),
      source: faker.helpers.arrayElement(SOURCES),
      status: faker.helpers.arrayElement(STATUSES),
      owner: faker.helpers.arrayElement(OWNERS),
      note: faker.helpers.arrayElement(NOTE_TEMPLATES),
      created_at: now,
      updated_at: now,
    };
  });
}

export async function seedDatabase(count: number = 10) {
  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const SQL = await initSqlJs();
  let db: any;

  // Load existing or create new
  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // Create schema
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'manual',
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'closed')),
      owner TEXT NOT NULL DEFAULT 'Unassigned',
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_leads_name ON leads(name);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);`);

  const leads = generateLeads(count);

  const stmt = db.prepare(
    `INSERT INTO leads (id, name, phone, source, status, owner, note, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const lead of leads) {
    stmt.run([
      lead.id,
      lead.name,
      lead.phone,
      lead.source,
      lead.status,
      lead.owner,
      lead.note,
      lead.created_at,
      lead.updated_at,
    ]);
  }
  stmt.free();

  // Persist
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);

  return leads;
}
