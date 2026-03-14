import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { orders, orderItems, users, addresses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { items, deliveryDate, deliverySlot, notes } = body;

  if (!items?.length || !deliveryDate || !deliverySlot) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const address = await db.select().from(addresses).where(eq(addresses.userId, userId)).limit(1);

  if (!user[0]?.phone || !user[0]?.dni || !address[0]?.street) {
    return NextResponse.json({ error: "Perfil incompleto" }, { status: 400 });
  }

  const total = items.reduce((acc: number, item: any) => {
    return acc + Number(item.pricePerKg) * Number(item.cantidad);
  }, 0);

  const [order] = await db.insert(orders).values({
    userId,
    total: total.toFixed(2),
    deliveryDate: new Date(deliveryDate),
    deliverySlot,
    notes: notes ?? null,
    status: "pending",
  }).returning();

  await db.insert(orderItems).values(
    items.map((item: any) => ({
      orderId: order.id,
      productId: item.id,
      quantityKg: Number(item.cantidad).toFixed(3),
      priceSnapshot: Number(item.pricePerKg).toFixed(2),
      unitPrice: Number(item.pricePerKg).toFixed(2),
    }))
  );

  return NextResponse.json({ ok: true, orderId: order.id });
}