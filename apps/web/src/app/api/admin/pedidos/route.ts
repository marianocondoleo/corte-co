import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { orders, orderItems, products, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const todosLosOrders = await db
    .select({
      id: orders.id,
      status: orders.status,
      total: orders.total,
      deliveryDate: orders.deliveryDate,
      deliverySlot: orders.deliverySlot,
      metodoPago: orders.metodoPago,
      notes: orders.notes,
      createdAt: orders.createdAt,
      userEmail: users.email,
      userPhone: users.phone,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const ordersConItems = await Promise.all(
    todosLosOrders.map(async (order) => {
      const items = await db
        .select({
          id: orderItems.id,
          productName: products.name,
          quantityKg: orderItems.quantityKg,
          unitPrice: orderItems.unitPrice,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      return { ...order, items };
    })
  );

  return NextResponse.json(ordersConItems);
}