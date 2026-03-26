"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const { session, isLoaded } = useSession(); // Trae sesión completa
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      if (!isLoaded) return; // Esperamos a que la sesión cargue

      if (session) {
        // Si hay sesión, buscamos rol en Neon
        try {
          const res = await fetch(`/api/users/${session.userId}`);
          const data = await res.json();

          if (res.ok) {
            if (data.role === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/home");
            }
          } else {
            console.error("Error al obtener rol:", data.error);
          }
        } catch (err) {
          console.error(err);
        }
      }

      setLoading(false); // Permitimos mostrar SignIn si no hay sesión
    };

    checkRoleAndRedirect();
  }, [isLoaded, session, router]);

  // Mientras cargamos o redirigimos
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verificando usuario...</p>
      </div>
    );
  }

  // Si no hay sesión, mostramos SignIn
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <SignIn />
    </div>
  );
}