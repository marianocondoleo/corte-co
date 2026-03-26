"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1
          className="text-5xl mb-12"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Dashboard.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SOLICITUDES */}
          <Link
            href="/admin/solicitudes"
            className="border border-white/10 p-8 rounded-2xl bg-white/5 hover:bg-white/10 transition"
          >
            <h2 className="text-xl mb-2">Solicitudes</h2>
            <p className="text-white/40 text-sm">
              Revisar, aprobar y gestionar pedidos
            </p>
          </Link>

          {/* FUTURO */}
          <div className="border border-white/10 p-8 rounded-2xl bg-white/5 opacity-50">
            <h2 className="text-xl mb-2">Producción</h2>
            <p className="text-white/40 text-sm">
              Próximamente
            </p>
          </div>

          <div className="border border-white/10 p-8 rounded-2xl bg-white/5 opacity-50">
            <h2 className="text-xl mb-2">Envíos</h2>
            <p className="text-white/40 text-sm">
              Próximamente
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}