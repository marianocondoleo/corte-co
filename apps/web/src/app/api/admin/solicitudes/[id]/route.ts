import { db } from "@/lib/db";
import { solicitudes } from "@/lib/db/schema";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const { status } = body;

    const updated = await db
      .update(solicitudes)
      .set({ status })
      .where((s, { eq }) => eq(s.id, params.id))
      .returning();

    return Response.json(updated[0]);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error" }, { status: 500 });
  }
}