"use client";

import { useEffect, useState } from "react";

type Solicitud = {
  id: string;
  talle: string;
  pie: string;
  status: string;
  medicoNombre?: string;
  notas?: string;
  precio?: string;
  product?: { name: string; price: string };
  user?: { email: string };
  files?: { url: string }[];
};

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mapeo de estados a labels legibles
  const statusLabels: Record<string, string> = {
    enviada: "Enviada",
    aprobada_pendiente_pago: "Aprobada, Pendiente de Pago",
    en_produccion: "En Producción",
    despachado: "Despachado",
    recibida: "Recibida",
    cancelada: "Cancelada",
  };

  // 🔹 Fetch API
  const fetchSolicitudes = async () => {
    try {
      const res = await fetch("/api/admin/solicitudes");
      
      console.log("📍 Response status:", res.status);
      
      if (!res.ok) {
        const error = await res.json();
        console.error("❌ API Error:", error);
        setSolicitudes([]);
        return;
      }

      const data = await res.json();

      console.log("✅ DATA DE LA API:", data);
      console.log("📊 Es array?", Array.isArray(data));
      console.log("📊 Longitud:", data.length);

      // Asegurarnos de que siempre sea un array
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar solicitudes:", error);
      setSolicitudes([]);
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // 🔹 Expandir / colapsar solicitud
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 🔹 Actualizar estado de la solicitud
  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchSolicitudes();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  // 🔹 Agrupar solicitudes por status
  const grouped = solicitudes.reduce<Record<string, Solicitud[]>>(
    (acc, s) => {
      const key = s.status || "sin_estado";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      {Object.keys(grouped).length === 0 && (
        <p className="text-white/50">No hay solicitudes para mostrar.</p>
      )}

      {Object.keys(grouped).map((status) => (
        <div key={status}>
          <h2 className="text-2xl font-semibold mb-4">{statusLabels[status] || status}</h2>

          <div className="space-y-4">
            {grouped[status].map((s) => (
              <div
                key={s.id}
                className="border border-white/10 rounded-2xl p-4 bg-white/5"
              >
                {/* Header de la solicitud */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(s.id)}
                >
                  <div>
                    <p className="font-medium">{s.product?.name || "Producto"}</p>
                    <p className="text-white/50 text-sm">{s.user?.email || "Usuario"}</p>
                  </div>
                  <span className="text-xs uppercase text-white/40">{statusLabels[s.status] || s.status}</span>
                </div>

                {/* Detalles expandibles */}
                {expandedId === s.id && (
                  <div className="mt-4 text-sm text-white/60 space-y-2">
                    <p>Talle: {s.talle}</p>
                    <p>Pie: {s.pie}</p>
                    {s.medicoNombre && <p>Médico: {s.medicoNombre}</p>}
                    {s.notas && <p>Notas: {s.notas}</p>}
                    {s.precio && <p>Precio: ${s.precio}</p>}

                    {s.files?.length > 0 && (
                      <div>
                        Archivos:
                        {s.files.map((f, i) => (
                          <a
                            key={i}
                            href={f.url}
                            target="_blank"
                            className="block text-[#6294A0] underline text-sm"
                          >
                            Ver archivo {i + 1}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {s.status === "enviada" && (
                        <>
                          <button
                            onClick={() => updateStatus(s.id, "aprobada_pendiente_pago")}
                            className="px-3 py-1 rounded-full bg-[#6294A0] text-white text-xs uppercase"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => updateStatus(s.id, "cancelada")}
                            className="px-3 py-1 rounded-full border border-white/20 text-xs uppercase"
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {s.status === "aprobada_pendiente_pago" && (
                        <button
                          onClick={() => updateStatus(s.id, "cancelada")}
                          className="px-3 py-1 rounded-full border border-white/20 text-xs uppercase"
                        >
                          Cancelar
                        </button>
                      )}

                      {s.status === "en_produccion" && (
                        <>
                          <button
                            onClick={() => updateStatus(s.id, "despachado")}
                            className="px-3 py-1 rounded-full bg-[#6294A0] text-white text-xs uppercase"
                          >
                            Despachar
                          </button>
                          <button
                            onClick={() => updateStatus(s.id, "recibida")}
                            className="px-3 py-1 rounded-full bg-green-600 text-white text-xs uppercase"
                          >
                            Recibida
                          </button>
                        </>
                      )}

                      {s.status !== "cancelada" && s.status !== "recibida" && s.status !== "enviada" && (
                        <button
                          onClick={() => updateStatus(s.id, "cancelada")}
                          className="px-3 py-1 rounded-full border border-red-500/50 text-red-400 text-xs uppercase"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}