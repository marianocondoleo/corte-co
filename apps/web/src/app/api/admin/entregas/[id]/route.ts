import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { deliveryConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  await db.update(deliveryConfig).set(body).where(eq(deliveryConfig.id, id));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await db.delete(deliveryConfig).where(eq(deliveryConfig.id, id));
  return NextResponse.json({ ok: true });
}