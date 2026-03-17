"use client";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type Stats = {
  pedidosHoy: number;
  pendientes: number;
  confirmados: number;
  enCamino: number;
  entregados: number;
  totalIngresos: number;
  totalUsuarios: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(r => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminNav />

      <main className="ml-56 flex-1 p-10">
        <div className="mb-10">
          <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-2">Panel de control</p>
          <h1 className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>
            Dashboard
          </h1>
          <div className="w-8 h-px bg-white/20 mt-4" />
        </div>

        {!stats ? (
          <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
        ) : (
          <>
            {/* Stats principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Pedidos hoy", value: stats.pedidosHoy, color: "text-white" },
                { label: "Pendientes", value: stats.pendientes, color: "text-orange-400" },
                { label: "En camino", value: stats.enCamino, color: "text-blue-400" },
                { label: "Entregados hoy", value: stats.entregados, color: "text-green-400" },
              ].map((stat, i) => (
                <div key={i} className="bg-zinc-900 border border-white/5 rounded-lg p-6">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">{stat.label}</p>
                  <p className={`text-4xl font-light ${stat.color}`} style={{ fontFamily: "Georgia, serif" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Ingresos y usuarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-white/5 rounded-lg p-6">
                <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Ingresos del día</p>
                <p className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>
                  ${stats.totalIngresos.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-zinc-900 border border-white/5 rounded-lg p-6">
                <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Usuarios registrados</p>
                <p className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>
                  {stats.totalUsuarios}
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}