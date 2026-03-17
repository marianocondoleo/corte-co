import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { paymentConfig } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await db.select().from(paymentConfig);
  return NextResponse.json(result);
}