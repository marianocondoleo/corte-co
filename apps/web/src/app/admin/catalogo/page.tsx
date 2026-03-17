"use client";
import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type Product = {
  id: string;
  name: string;
  sku: string;
  pricePerKg: string;
  stockKg: string;
  isActive: boolean;
  images: string[];
  category: string;
  categoryId: string;
};

export default function AdminCatalogo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Product | null>(null);
  const [creando, setCreando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", sku: "", pricePerKg: "", stockKg: "",
    origin: "", breed: "", images: "", categoryId: "",
  });

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = () => {
    fetch("/api/admin/productos")
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); });
  };

  const handleEditar = (product: Product) => {
    setEditando(product);
    setCreando(false);
    setForm({
      name: product.name,
      sku: product.sku,
      pricePerKg: product.pricePerKg,
      stockKg: product.stockKg,
      origin: "",
      breed: "",
      images: product.images?.[0] ?? "",
      categoryId: product.categoryId,
    });
  };

  const handleNuevo = () => {
    setCreando(true);
    setEditando(null);
    setForm({ name: "", sku: "", pricePerKg: "", stockKg: "", origin: "", breed: "", images: "", categoryId: "" });
  };

  const handleGuardar = async () => {
    setSaving(true);
    const body = {
      name: form.name,
      sku: form.sku,
      pricePerKg: form.pricePerKg,
      stockKg: form.stockKg,
      origin: form.origin || null,
      breed: form.breed || null,
      images: form.images ? [form.images] : [],
      categoryId: form.categoryId,
    };

    if (editando) {
      await fetch(`/api/admin/productos/${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch("/api/admin/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setSaving(false);
    setEditando(null);
    setCreando(false);
    cargarProductos();
  };

  const handleToggleActivo = async (product: Product) => {
    await fetch(`/api/admin/productos/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    cargarProductos();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <AdminNav />
      <main className="ml-56 flex-1 p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-2">Admin</p>
            <h1 className="text-white text-4xl font-light" style={{ fontFamily: "Georgia, serif" }}>Catálogo</h1>
            <div className="w-8 h-px bg-white/20 mt-4" />
          </div>
          <button
            onClick={handleNuevo}
            className="bg-white text-black px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium hover:bg-zinc-200 transition-all"
          >
            + Nuevo producto
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
            ) : products.map(product => (
              <div
                key={product.id}
                className={`border rounded-lg p-4 flex items-center gap-4 transition-all ${
                  editando?.id === product.id ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="w-12 h-12 rounded bg-zinc-900 overflow-hidden flex-shrink-0">
                  <img src={product.images?.[0] ?? ""} alt={product.name} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-light" style={{ fontFamily: "Georgia, serif" }}>{product.name}</p>
                  <p className="text-white/30 text-xs">
                    ${Number(product.pricePerKg).toLocaleString("es-AR")} / kg · {Number(product.stockKg).toFixed(0)} kg stock
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActivo(product)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      product.isActive
                        ? "text-green-400 border-green-400/30 bg-green-400/10 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30"
                        : "text-red-400 border-red-400/30 bg-red-400/10 hover:bg-green-400/10 hover:text-green-400 hover:border-green-400/30"
                    }`}
                  >
                    {product.isActive ? "Activo" : "Inactivo"}
                  </button>
                  <button
                    onClick={() => handleEditar(product)}
                    className="text-white/30 hover:text-white text-xs tracking-widest uppercase transition-colors px-3 py-1 border border-white/10 rounded-full hover:border-white/30"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {(editando || creando) && (
            <div className="border border-white/10 rounded-lg p-6">
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-6">
                {editando ? "Editar producto" : "Nuevo producto"}
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Nombre *", name: "name", placeholder: "Ej: Bife de Chorizo" },
                  { label: "SKU *", name: "sku", placeholder: "Ej: VAC-001" },
                  { label: "Precio por kg *", name: "pricePerKg", placeholder: "Ej: 8500" },
                  { label: "Stock (kg)", name: "stockKg", placeholder: "Ej: 50" },
                  { label: "Origen", name: "origin", placeholder: "Ej: Pampeana" },
                  { label: "Raza", name: "breed", placeholder: "Ej: Aberdeen Angus" },
                  { label: "URL de imagen", name: "images", placeholder: "https://..." },
                  { label: "Category ID *", name: "categoryId", placeholder: "ID de la categoría" },
                ].map(field => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-white/30 text-xs tracking-widest uppercase">{field.label}</label>
                    <input
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder:text-white/20 px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                    />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleGuardar}
                    disabled={saving}
                    className="flex-1 py-3 bg-white text-black text-xs tracking-widest uppercase font-medium rounded-full hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    onClick={() => { setEditando(null); setCreando(false); }}
                    className="px-6 py-3 border border-white/20 text-white/50 text-xs tracking-widest uppercase rounded-full hover:border-white/50 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}