import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { LeadStatus } from "@/types/lead";

function generateId(): string {
  return `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword") || "";
    const status = searchParams.get("status") as LeadStatus | null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));

    let whereClause = "WHERE 1=1";
    const params: (string | number)[] = [];

    if (keyword) {
      whereClause += " AND (name LIKE ? OR phone LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    // Get total count
    const countResult = await db.execSelect(`SELECT COUNT(*) as total FROM leads ${whereClause}`, params);
    const total = Number(countResult[0]?.total || 0);

    // Get paginated results
    const offset = (page - 1) * pageSize;
    const items = await db.execSelect(
      `SELECT * FROM leads ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
        filters: {
          keyword: keyword || undefined,
          status: status || undefined,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/demo/leads error:", error);
    return NextResponse.json(
      {
        detail: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch leads",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, source = "manual", status = "new", owner = "Unassigned", note = "" } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { detail: { code: "VALIDATION_ERROR", message: "name is required" } },
        { status: 400 }
      );
    }

    if (!phone || !/^\d{11}$/.test(phone)) {
      return NextResponse.json(
        { detail: { code: "VALIDATION_ERROR", message: "phone must be an 11-digit mobile number" } },
        { status: 400 }
      );
    }

    if (!["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json(
        { detail: { code: "VALIDATION_ERROR", message: "status must be one of: new, contacted, closed" } },
        { status: 400 }
      );
    }

    // Check for duplicate phone
    const existing = await db.execGet("SELECT id FROM leads WHERE phone = ?", [phone]);
    if (existing) {
      return NextResponse.json(
        { detail: { code: "PHONE_EXISTS", message: "phone already exists" } },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const id = generateId();

    await db.execQuery(
      `INSERT INTO leads (id, name, phone, source, status, owner, note, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), phone, source, status, owner, note, now, now]
    );

    const lead = await db.execGet("SELECT * FROM leads WHERE id = ?", [id]);

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/demo/leads error:", error);
    return NextResponse.json(
      {
        detail: {
          code: "INTERNAL_ERROR",
          message: "Failed to create lead",
        },
      },
      { status: 500 }
    );
  }
}
