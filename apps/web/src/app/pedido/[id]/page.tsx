"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PedidoConfirmadoPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-8 text-2xl">
          ✓
        </div>
        <p className="text-white/30 tracking-[0.4em] uppercase text-xs mb-4">
          Pedido confirmado
        </p>
        <h1
          className="text-white text-4xl font-light mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ¡Gracias por tu compra!
        </h1>
        <div className="w-8 h-px bg-white/20 mx-auto my-6" />
        <p className="text-white/40 text-sm font-light mb-2">
          Número de pedido
        </p>
        <p className="text-white/60 text-xs font-mono mb-8">
          {String(id).slice(0, 8).toUpperCase()}
        </p>
        <p className="text-white/30 text-sm font-light mb-10 leading-relaxed">
          Te vamos a contactar para confirmar el horario de entrega.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-3 border border-white/20 text-white/50 hover:text-white hover:border-white/50 px-8 py-3 rounded-full text-xs tracking-widest uppercase font-light transition-all duration-300"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}