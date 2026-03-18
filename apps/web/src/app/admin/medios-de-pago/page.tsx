"use client";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type PaymentMethod = {
  id: string;
  method: string;
  label: string;
  icon: string;
  isActive: boolean;
  bankName: string | null;
  cbu: string | null;
  alias: string | null;
  titular: string | null;
  whatsapp: string | null;
};

export default function AdminMediosDePago() {
  const [medios, setMedios] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoBanco, setEditandoBanco] = useState(false);
const [banco, setBanco] = useState({ bankName: "", cbu: "", alias: "", titular: "", whatsapp: "" });  const [saving, setSaving] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    fetch("/api/admin/pagos")
      .then(r => r.json())
      .then(data => {
        setMedios(data);
        const transferencia = data.find((m: PaymentMethod) => m.method === "transferencia");
        if (transferencia) {
          setBanco({
            bankName: transferencia.bankName ?? "",
            cbu: transferencia.cbu ?? "",
            alias: transferencia.alias ?? "",
            titular: transferencia.titular ?? "",
            whatsapp: transferencia.whatsapp ?? "",
          });
        }
        setLoading(false);
      });
  };

  const handleToggle = async (medio: PaymentMethod) => {
    await fetch(`/api/admin/pagos/${medio.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !medio.isActive }),
    });
    cargar();
  };

  const handleGuardarBanco = async () => {
    setSaving(true);
    const transferencia = medios.find(m => m.method === "transferencia");
    if (!transferencia) return;

    await fetch(`/api/admin/pagos/${transferencia.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(banco),
    });

    setSaving(false);
    setEditandoBanco(false);
    cargar();
  };

  const transferencia = medios.find(m => m.method === "transferencia");

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminNav />
      <main className="ml-56 flex-1 p-10">
        <div className="mb-10">
          <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-2">Admin</p>
          <h1 className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>Medios de pago</h1>
          <div className="w-8 h-px bg-white/20 mt-4" />
        </div>

        {loading ? (
          <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
        ) : (
          <div className="max-w-xl flex flex-col gap-4">

            {/* Lista de medios */}
            {medios.map(medio => (
              <div key={medio.id} className="border border-white/10 rounded-lg p-5 flex items-center gap-5">
                <span className="text-2xl">{medio.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>{medio.label}</p>
                  <p className="text-white/30 text-xs mt-1">{medio.method}</p>
                </div>
                <button
                  onClick={() => handleToggle(medio)}
                  className={`text-xs px-4 py-2 rounded-full border transition-all ${
                    medio.isActive
                      ? "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30"
                      : "text-red-400 border-red-400/30 bg-red-400/10 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/30"
                  }`}
                >
                  {medio.isActive ? "Activo" : "Inactivo"}
                </button>
              </div>
            ))}

            {/* Datos bancarios */}
            <div className="border border-white/10 rounded-lg p-6 mt-2">
              <div className="flex items-center justify-between mb-6">
                <p className="text-white/30 tracking-[0.3em] uppercase text-xs">Datos bancarios (transferencia)</p>
                <button
                  onClick={() => setEditandoBanco(!editandoBanco)}
                  className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors border border-white/10 px-3 py-1 rounded-full hover:border-white/30"
                >
                  {editandoBanco ? "Cancelar" : "Editar"}
                </button>
              </div>

              {editandoBanco ? (
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Banco", key: "bankName", placeholder: "Ej: Banco Galicia" },
                    { label: "CBU", key: "cbu", placeholder: "22 dígitos" },
                    { label: "Alias", key: "alias", placeholder: "Ej: CORTE.CO.MP" },
                    { label: "Titular", key: "titular", placeholder: "Nombre del titular" },
                    { label: "WhatsApp", key: "whatsapp", placeholder: "Ej: 5491112345678" },
                  ].map(field => (
                    <div key={field.key} className="flex flex-col gap-2">
                      <label className="text-white/30 text-xs tracking-widest uppercase">{field.label}</label>
                      <input
                        value={banco[field.key as keyof typeof banco]}
                        onChange={e => setBanco(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder:text-white/20 px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleGuardarBanco}
                    disabled={saving}
                    className="w-full py-3 bg-white text-black text-xs tracking-widest uppercase font-medium rounded-full hover:bg-zinc-200 transition-all disabled:opacity-50 mt-2"
                  >
                    {saving ? "Guardando..." : "Guardar datos bancarios"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Banco", value: transferencia?.bankName },
                    { label: "CBU", value: transferencia?.cbu },
                    { label: "Alias", value: transferencia?.alias },
                    { label: "Titular", value: transferencia?.titular },
                    { label: "WA", value: transferencia?.whatsapp },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5">
                      <span className="text-white/20 w-16 text-xs tracking-widest uppercase">{item.label}</span>
                      <span className="text-white/50 text-sm">{item.value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}