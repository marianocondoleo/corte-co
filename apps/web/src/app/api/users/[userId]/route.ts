
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { userId: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { userId } = params;

    // Buscamos el usuario en Neon
    const user = await db.query.users.findFirst({
      where: (u) => u.id.eq(userId),
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Retornamos el objeto del usuario (incluyendo role)
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error en /api/users/[userId]:", error);
    return NextResponse.json({ error: "Error interno", details: String(error) }, { status: 500 });
  }
}