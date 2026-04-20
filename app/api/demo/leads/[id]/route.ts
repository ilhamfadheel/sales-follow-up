import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const lead = await db.execGet("SELECT * FROM leads WHERE id = ?", [id]);

    if (!lead) {
      return NextResponse.json(
        { detail: { code: "LEAD_NOT_FOUND", message: "Lead not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("GET /api/demo/leads/[id] error:", error);
    return NextResponse.json(
      { detail: { code: "INTERNAL_ERROR", message: "Failed to fetch lead" } },
      { status: 500 }
    );
  }
}
