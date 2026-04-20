/**
 * Standalone seed script
 * Creates the SQLite database and populates it with randomized sample lead data.
 * Run with: npm run db:seed
 */

import fs from "fs";
import path from "path";
import { seedDatabase } from "../lib/seed";

const DB_PATH = path.join(process.cwd(), "data", "leads.db");

async function run() {
  // Remove existing database if present
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log("Removed existing database.");
  }

  const count = parseInt(process.argv[2], 10) || 10;
  const leads = await seedDatabase(count);

  console.log(`Seeded ${leads.length} leads into ${DB_PATH}`);
  console.log("\nSample leads:");
  leads.slice(0, 5).forEach((lead) => {
    console.log(`  - ${lead.name} (${lead.phone}) — ${lead.note}`);
  });
  if (leads.length > 5) {
    console.log(`  ... and ${leads.length - 5} more`);
  }
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
