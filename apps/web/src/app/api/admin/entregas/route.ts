import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { deliveryConfig } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await db.select().from(deliveryConfig).orderBy(asc(deliveryConfig.order));
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { type, value, order } = await req.json();

  const [item] = await db.insert(deliveryConfig).values({
    type, value, isActive: true, order: order ?? 0,
  }).returning();

  return NextResponse.json(item);
}
