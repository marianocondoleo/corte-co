"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Product = {
  id: string;
  name: string;
  sku: string;
  pricePerKg: string;
  stockKg: string;
  origin: string;
  images: string[];
  category: string;
  categorySlug: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("");

  useEffect(() => {
    fetch("/api/catalogo")
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });

    fetch("/api/categorias")
      .then(r => r.json())
      .then(setCategorias);
  }, []);

  const productosFiltrados = products.filter(p => {
    const matchBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase());
    const matchCategoria = categoriaActiva === "" || p.categorySlug === categoriaActiva;
    return matchBusqueda && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-10 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-4">
            Seleccion premium
          </p>
          <h1
            className="text-white text-5xl font-light"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Catalogo
          </h1>
          <div className="w-8 h-px bg-white/20 mt-4" />
        </div>

        {/* Busqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full max-w-sm bg-white/5 border border-white/10 focus:border-white/30 text-white placeholder:text-white/20 px-5 py-3 rounded-full text-sm outline-none transition-colors"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoriaActiva("")}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-light transition-all duration-200 ${
                categoriaActiva === ""
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
            >
              Todos
            </button>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.slug)}
                className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase font-light transition-all duration-200 ${
                  categoriaActiva === cat.slug
                    ? "bg-white text-black"
                    : "border border-white/20 text-white/50 hover:border-white/50 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div className="text-white/20 text-sm tracking-widest uppercase">Cargando...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-white/20 text-sm py-24 text-center">
            No se encontraron productos
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map(product => (
              <Link
                key={product.id}
                href={`/producto/${product.id}`}
                className="group border border-white/10 hover:border-white/30 rounded-lg overflow-hidden transition-all duration-300"
              >
                <div className="aspect-square bg-zinc-900 overflow-hidden">
                  <img
                    src={product.images?.[0] ?? ""}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="p-5">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-2">
                    {product.category}
                  </p>
                  <h3
                    className="text-white text-lg font-light mb-3"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/40 text-xs mb-1">precio por kg</p>
                      <p className="text-white text-lg font-light">
                        ${Number(product.pricePerKg).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                      <span className="text-white/50 group-hover:text-black text-sm">+</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}