import { db } from "@/lib/db";
import { solicitudes, products, solicitudFiles } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 🔐 Auth
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "No autorizado" }, { status: 401 });

    // 📥 FormData
    const formData = await req.formData();
    const productId = formData.get("productId") as string;
    const talle = formData.get("talle") as string;
    const pie = (formData.get("pie") as string) || "ambos";
    const medicoNombre = formData.get("medicoNombre") as string;
    const notas = formData.get("notas") as string;
    const file = formData.get("file") as File | null;

    if (!productId || !talle) {
      return Response.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    // 🔍 Buscar producto
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
    });

    if (!product) {
      return Response.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // 📂 GUARDAR ARCHIVO
    let fileUrl: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filePath = path.join(uploadDir, fileName);
      const fs = await import("fs/promises");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${fileName}`;
    }

    // 💾 INSERT SOLICITUD
    const nueva = await db.insert(solicitudes).values({
      userId,
      productId,
      talle,
      pie,
      medicoNombre: medicoNombre || null,
      notas: notas || null,
      precioProducto: product.price,   // <- aquí guardamos el precio real
      precioTotal: product.price,      // opcional, puede actualizarse después con envío
      status: "enviada",
    }).returning();

    // 📎 INSERT ARCHIVO EN TABLA RELACIONADA
    if (fileUrl) {
      await db.insert(solicitudFiles).values({
        id: crypto.randomUUID(),
        solicitudId: nueva[0].id,
        url: fileUrl,
        type: file?.name || null,
      });
    }

    return Response.json({ success: true, solicitud: nueva[0] });
  } catch (error) {
    console.error("❌ ERROR API SOLICITUDES:", error);
    return Response.json({ error: "Error interno", detalle: String(error) }, { status: 500 });
  }
}