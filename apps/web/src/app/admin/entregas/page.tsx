"use client";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type ConfigItem = {
  id: string;
  type: string;
  value: string;
  isActive: boolean;
  order: number;
};

export default function AdminEntregas() {
  const [items, setItems] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoValor, setNuevoValor] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState<"day" | "slot">("day");

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    fetch("/api/admin/entregas")
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); });
  };

  const handleToggle = async (item: ConfigItem) => {
    await fetch(`/api/admin/entregas/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    cargar();
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Eliminár este item?")) return;
    await fetch(`/api/admin/entregas/${id}`, { method: "DELETE" });
    cargar();
  };

  const handleAgregar = async () => {
    if (!nuevoValor.trim()) return;
    await fetch("/api/admin/entregas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: nuevoTipo, value: nuevoValor.trim(), order: items.length }),
    });
    setNuevoValor("");
    cargar();
  };

  const dias = items.filter(i => i.type === "day");
  const franjas = items.filter(i => i.type === "slot");

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminNav />
      <main className="ml-56 flex-1 p-10">
        <div className="mb-10">
          <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-2">Admin</p>
          <h1 className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>Entregas</h1>
          <div className="w-8 h-px bg-white/20 mt-4" />
        </div>

        {loading ? (
          <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Días */}
            <div className="border border-white/10 rounded-lg p-6">
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-6">Días de entrega</p>
              <div className="flex flex-col gap-2">
                {dias.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-white/70 text-sm font-light">{item.value}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(item)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${
                          item.isActive
                            ? "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30"
                            : "text-red-400 border-red-400/30 bg-red-400/10 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/30"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Inactivo"}
                      </button>
                      <button
                        onClick={() => handleEliminar(item.id)}
                        className="text-white/20 hover:text-red-400 text-xs transition-colors px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Franjas */}
            <div className="border border-white/10 rounded-lg p-6">
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-6">Franjas horarias</p>
              <div className="flex flex-col gap-2">
                {franjas.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-white/70 text-sm font-light">{item.value}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(item)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${
                          item.isActive
                            ? "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30"
                            : "text-red-400 border-red-400/30 bg-red-400/10 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/30"
                        }`}
                      >
                        {item.isActive ? "Activo" : "Inactivo"}
                      </button>
                      <button
                        onClick={() => handleEliminar(item.id)}
                        className="text-white/20 hover:text-red-400 text-xs transition-colors px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agregar nuevo */}
            <div className="border border-white/10 rounded-lg p-6 lg:col-span-2">
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-6">Agregar nuevo</p>
              <div className="flex items-center gap-4">
                <select
                  value={nuevoTipo}
                  onChange={e => setNuevoTipo(e.target.value as "day" | "slot")}
                  className="bg-white/5 border border-white/10 text-white/60 text-sm px-4 py-3 rounded-lg outline-none"
                >
                  <option value="day">Día</option>
                  <option value="slot">Franja horaria</option>
                </select>
                <input
                  value={nuevoValor}
                  onChange={e => setNuevoValor(e.target.value)}
                  placeholder={nuevoTipo === "day" ? "Ej: Domingo" : "Ej: 20-23hs"}
                  className="flex-1 bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder:text-white/20 px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                />
                <button
                  onClick={handleAgregar}
                  className="bg-white text-black px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium hover:bg-zinc-200 transition-all"
                >
                  Agregar
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}