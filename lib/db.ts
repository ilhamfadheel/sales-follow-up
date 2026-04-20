import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { seedDatabase } from "./seed";

const DB_PATH = path.join(process.cwd(), "data", "leads.db");

let db: any = null;
let SQL: any = null;

async function getDb() {
  if (db) return db;

  SQL = await initSqlJs();

  // Ensure data directory exists
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Load existing database or create new
  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables if they don't exist
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

  // Auto-seed if empty
  const countResult = db.exec("SELECT COUNT(*) as count FROM leads;");
  const count = countResult[0]?.values[0]?.[0] as number || 0;

  if (count === 0) {
    await seedDatabase(10);
    // Reload DB after seeding wrote to disk
    const filebuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(filebuffer);
  }

  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export async function execQuery(sql: string, params?: any[]) {
  const database = await getDb();
  if (params && params.length > 0) {
    const stmt = database.prepare(sql);
    stmt.run(params);
    stmt.free();
  } else {
    database.run(sql);
  }
  saveDb();
}

export async function execSelect(sql: string, params?: any[]): Promise<any[]> {
  const database = await getDb();
  const stmt = database.prepare(sql);
  if (params && params.length > 0) {
    stmt.bind(params);
  }

  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export async function execGet(sql: string, params?: any[]): Promise<any | null> {
  const results = await execSelect(sql, params);
  return results[0] || null;
}

export default { execQuery, execSelect, execGet, saveDb };
