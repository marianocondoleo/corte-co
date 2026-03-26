import { db } from "@/lib/db";
import { solicitudes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🔔 Webhook MercadoPago recibido:", body);

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: body.data.id });

    const solicitudId = paymentData.external_reference;
    const status = paymentData.status;

    console.log("💳 Payment ID:", paymentData.id, "Status:", status, "Solicitud ID:", solicitudId);

    if (!solicitudId) {
      console.log("⚠️ No external_reference encontrada");
      return NextResponse.json({ ok: true });
    }

    if (status === "approved") {
      console.log("✅ Pago aprobado para solicitud:", solicitudId);
      
      await db.update(solicitudes)
        .set({ 
          status: "en_produccion",
        })
        .where(eq(solicitudes.id, solicitudId));

      console.log("✅ Solicitud actualizada a 'en_produccion'");
    } else if (status === "rejected" || status === "cancelled") {
      console.log("❌ Pago rechazado/cancelado para solicitud:", solicitudId);
      
      await db.update(solicitudes)
        .set({ 
          status: "cancelada",
        })
        .where(eq(solicitudes.id, solicitudId));

      console.log("❌ Solicitud actualizada a 'cancelada'");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error en webhook MercadoPago:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 });
  }
}