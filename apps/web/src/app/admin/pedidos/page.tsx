"use client";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type OrderItem = {
  id: string;
  productName: string;
  quantityKg: string;
  unitPrice: string;
};

type Order = {
  id: string;
  status: string;
  total: string;
  deliveryDate: string;
  deliverySlot: string;
  metodoPago: string;
  notes: string | null;
  createdAt: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "Pendiente",
  confirmed: "Confirmado",
  packed:    "Preparando",
  shipped:   "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  pending:   "text-orange-400 border-orange-400/30 bg-orange-400/10",
  confirmed: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  packed:    "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  shipped:   "text-purple-400 border-purple-400/30 bg-purple-400/10",
  delivered: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
};

const FILTROS = ["todos", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [expandido, setExpandido] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/pedidos")
      .then(r => r.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const handleStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    await fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    setUpdatingId(null);
  };

  const filtrados = filtro === "todos" ? orders : orders.filter(o => o.status === filtro);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminNav />

      <main className="ml-56 flex-1 p-10">
        <div className="mb-10">
          <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-2">Admin</p>
          <h1 className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>
            Pedidos
          </h1>
          <div className="w-8 h-px bg-white/20 mt-4" />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {FILTROS.map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase font-light transition-all duration-200 ${
                filtro === f
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/40 hover:text-white hover:border-white/50"
              }`}
            >
              {f === "todos" ? "Todos" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="text-white/20 text-sm">No hay pedidos con este filtro</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtrados.map(order => (
              <div key={order.id} className="border border-white/10 rounded-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5">
                  <button
                    onClick={() => setExpandido(expandido === order.id ? null : order.id)}
                    className="flex items-center gap-5 text-left flex-1"
                  >
                    <div>
                      <p className="text-white/30 text-xs font-mono mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-white text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>
                        {order.userEmail}
                      </p>
                      <p className="text-white/30 text-xs mt-1">
                        {new Date(order.deliveryDate).toLocaleDateString("es-AR", {
                          weekday: "long", day: "numeric", month: "long"
                        })} · {order.deliverySlot}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLOR[order.status]}`}>
                      {STATUS_LABEL[order.status]}
                    </span>
                    <p className="text-white text-lg font-light w-28 text-right" style={{ fontFamily: "Georgia, serif" }}>
                      ${Number(order.total).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                    </p>

                    {/* Selector de status */}
                    <select
                      value={order.status}
                      onChange={e => handleStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="bg-zinc-900 border border-white/10 text-white/60 text-xs px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-white/30 transition-colors disabled:opacity-50"
                    >
                      {Object.entries(STATUS_LABEL).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>

                    <span className="text-white/20 text-sm ml-2">
                      {expandido === order.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Detalle expandible */}
                {expandido === order.id && (
                  <div className="border-t border-white/5 p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Teléfono</p>
                        <p className="text-white/60">{order.userPhone ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Método de pago</p>
                        <p className="text-white/60 capitalize">{order.metodoPago ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Fecha de pedido</p>
                        <p className="text-white/60">
                          {new Date(order.createdAt).toLocaleDateString("es-AR")}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                          <p className="text-white/70 font-light">{item.productName}</p>
                          <p className="text-white/40">{Number(item.quantityKg).toFixed(1)} kg</p>
                          <p className="text-white/60">
                            ${(Number(item.unitPrice) * Number(item.quantityKg)).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div>
                        <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Notas</p>
                        <p className="text-white/50 text-sm">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}