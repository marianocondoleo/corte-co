"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const handleSolicitar = () => {
    if (!user) {
      router.push("/sign-in");
    } else {
      router.push("/solicitar");
    }
  };

  return (
    <nav className="flex items-center justify-between px-10 py-8 border-b border-white/5">
      
      {/* LOGO */}
      <Link
        href="/"
        className="text-white tracking-[0.3em] uppercase text-sm font-light"
        style={{ fontFamily: "Georgia, serif" }}
      >
        condoleo
      </Link>

      {/* LINKS */}
      <div className="flex items-center gap-6">

        <button
          onClick={handleSolicitar}
          className={`text-xs tracking-widest uppercase font-light transition-colors ${
            isActive("/solicitar")
              ? "text-white"
              : "text-white/40 hover:text-white"
          }`}
        >
          Solicitar
        </button>

        {user && (
          <Link
            href="/mis-solicitudes"
            className={`text-xs tracking-widest uppercase font-light transition-colors ${
              isActive("/mis-solicitudes")
                ? "text-white"
                : "text-white/40 hover:text-white"
            }`}
          >
            Mis solicitudes
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/perfil"
              className={`text-xs tracking-widest uppercase font-light transition-colors ${
                isActive("/perfil")
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Mi perfil
            </Link>
            <UserButton />
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-white/70 hover:text-white border border-white/20 hover:border-white/60 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-light transition-all duration-300"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}