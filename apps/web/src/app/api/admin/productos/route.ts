import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      pricePerKg: products.pricePerKg,
      stockKg: products.stockKg,
      isActive: products.isActive,
      images: products.images,
      category: categories.name,
      categorySlug: categories.slug,
      categoryId: categories.id,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.name);

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, sku, categoryId, pricePerKg, stockKg, origin, breed, images } = body;

  if (!name || !sku || !categoryId || !pricePerKg) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }

  const [product] = await db.insert(products).values({
    name,
    sku,
    categoryId,
    pricePerKg,
    stockKg: stockKg ?? "0",
    origin: origin ?? null,
    breed: breed ?? null,
    images: images ?? [],
    isActive: true,
  }).returning();

  return NextResponse.json(product);
}