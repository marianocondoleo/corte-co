import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { eq, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const pedidosHoy = await db
    .select()
    .from(orders)
    .where(gte(orders.createdAt, hoy));

  const pendientes = pedidosHoy.filter(o => o.status === "pending").length;
  const confirmados = pedidosHoy.filter(o => o.status === "confirmed").length;
  const enCamino = pedidosHoy.filter(o => o.status === "shipped").length;
  const entregados = pedidosHoy.filter(o => o.status === "delivered").length;

  const totalIngresos = pedidosHoy.reduce((acc, o) => acc + Number(o.total), 0);

const totalUsuarios = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, "customer"));
  return NextResponse.json({
    pedidosHoy: pedidosHoy.length,
    pendientes,
    confirmados,
    enCamino,
    entregados,
    totalIngresos,
    totalUsuarios: Number(totalUsuarios[0].count),
  });
}