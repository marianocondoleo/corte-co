"use client";

import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Usuario no logueado
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
              Corte & Co.
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Carne premium. Puerta a puerta.
            </p>
            <Link
              href="/sign-in"
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-8 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              Ingresar
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Usuario logueado - Home
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start justify-start py-8 px-16 bg-white dark:bg-black">
        <div className="flex items-center justify-between w-full mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Bienvenido, {user.firstName}
          </h1>
          <UserButton />
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Estás logueado como {user.emailAddresses[0]?.emailAddress}
          </p>
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Este es tu home después de ingresar.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
