import { db } from "@/lib/db";
import { solicitudes, users, products, solicitudFiles } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    console.log("📍 GET /api/admin/solicitudes - userId:", userId);

    if (!userId) {
      console.log("❌ No autorizado - userId es null");
      return Response.json({ error: "No autorizado" }, { status: 401 });
    }

    // 👉 opcional: validar que sea admin
    // (lo dejamos simple por ahora)

    const data = await db.query.solicitudes.findMany({
      with: {
        product: true,
        user: true,
        files: true,
      },
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    });

    console.log("✅ Solicitudes encontradas:", data.length);
    console.log("📊 Data completa:", JSON.stringify(data, null, 2));

    return Response.json(data);
  } catch (error) {
    console.error("❌ Error en GET /api/admin/solicitudes:", error);
    return Response.json({ error: "Error", details: String(error) }, { status: 500 });
  }
}