import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

export async function GET() {
  const result = await db.select().from(categories).orderBy(asc(categories.displayOrder));
  return NextResponse.json(result);
}