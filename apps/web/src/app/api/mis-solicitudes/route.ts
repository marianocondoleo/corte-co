import { db } from "@/lib/db";
import { solicitudes, products, users, solicitudFiles } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // 🔐 Auth (Clerk)
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    // 🔍 Buscar solicitudes del usuario
    const userSolicitudes = await db.query.solicitudes.findMany({
      where: (s, { eq }) => eq(s.userId, userId),
      orderBy: (s, { desc }) => desc(s.createdAt),
      with: {
        product: true,
        files: true,
        user: true,
      },
    });

    // Convertimos campos numéricos a string para que JSON no rompa
    const formatted = userSolicitudes.map((s) => ({
      ...s,
      precioProducto: s.precioProducto?.toString() || "0",
      precioEnvio: s.precioEnvio?.toString() || "0",
      precioTotal: s.precioTotal?.toString() || "0",
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ ERROR API MIS SOLICITUDES:", error);
    return new Response(JSON.stringify({ error: "Error interno", detalle: String(error) }), { status: 500 });
  }
}