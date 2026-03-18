import { db } from "@/lib/db";
import { deliveryConfig, paymentConfig } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const dias = await db
    .select()
    .from(deliveryConfig)
    .where(eq(deliveryConfig.isActive, true))
    .orderBy(asc(deliveryConfig.order));

  const pagos = await db
    .select()
    .from(paymentConfig)
    .where(eq(paymentConfig.isActive, true));

  return NextResponse.json({ dias, pagos });
}