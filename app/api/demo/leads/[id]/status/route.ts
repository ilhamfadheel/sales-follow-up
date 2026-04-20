import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { LeadStatus } from "@/types/lead";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json(
        { detail: { code: "VALIDATION_ERROR", message: "status must be one of: new, contacted, closed" } },
        { status: 400 }
      );
    }

    const existing = await db.execGet("SELECT id FROM leads WHERE id = ?", [id]);
    if (!existing) {
      return NextResponse.json(
        { detail: { code: "LEAD_NOT_FOUND", message: "Lead not found" } },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    await db.execQuery("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?", [status, now, id]);

    const lead = await db.execGet("SELECT * FROM leads WHERE id = ?", [id]);

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("PATCH /api/demo/leads/[id]/status error:", error);
    return NextResponse.json(
      { detail: { code: "INTERNAL_ERROR", message: "Failed to update lead status" } },
      { status: 500 }
    );
  }
}
