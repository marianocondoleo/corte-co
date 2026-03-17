"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/pedidos", label: "Pedidos", icon: "📋" },
  { href: "/admin/catalogo", label: "Catálogo", icon: "🥩" },
  { href: "/admin/entregas", label: "Entregas", icon: "🚚" },
  { href: "/admin/medios-de-pago", label: "Medios de pago", icon: "💳" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-zinc-950 border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/5">
        <Link href="/" className="text-white tracking-[0.2em] uppercase text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>
          Corte & Co.
        </Link>
        <p className="text-white/20 text-xs tracking-widest uppercase mt-1">Admin</p>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-light transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-white/5 flex items-center justify-between">
        <Link
          href="/"
          className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors"
        >
          ← Web
        </Link>
        <UserButton />
      </div>
    </aside>
  );
}