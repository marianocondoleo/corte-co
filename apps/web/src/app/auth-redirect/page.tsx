import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AuthRedirect() {
  const { userId, sessionClaims } = await auth();

  if (!userId) redirect("/sign-in");

  const role = (sessionClaims?.metadata as any)?.role;

  redirect(role === "admin" ? "/admin" : "/");
}