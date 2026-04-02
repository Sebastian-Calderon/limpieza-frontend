// frontend/src/components/ProductModal.jsx
// Reemplaza el archivo completo.
//
// Cambios:
// · El precio se lee de la presentación seleccionada, no de producto.precio
// · Si tiene_precio=false los precios se ocultan y se muestra "Consultar precio"
// · El mensaje de WhatsApp refleja el precio de la presentación elegida

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, MessageCircle, Minus, Plus, ChevronDown } from "lucide-react";

const WA_NUMBER = "573228540713";
const BASE_URL  = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${BASE_URL}${src}`;
}

function formatCOP(valor) {
  return Number(valor).toLocaleString("es-CO", {
    style: "currency", currency: "COP",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  });
}

const selectCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0d2952] appearance-none focus:outline-none focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/15 transition-all";

export default function ProductModal({ producto, cerrar }) {
  const [mostrar,         setMostrar]         = useState(false);
  const [cantidad,        setCantidad]        = useState(1);
  const [presentacionIdx, setPresentacionIdx] = useState("");
  const [aroma,           setAroma]           = useState("");

  useEffect(() => {
    if (producto) {
      setTimeout(() => setMostrar(true), 10);
      // Preseleccionar primera presentación
      if (producto.presentaciones?.length > 0) setPresentacionIdx("0");
      if (producto.aroma) setAroma(producto.aroma);
    } else {
      setMostrar(false);
    }
  }, [producto]);

  const handleCerrar = () => {
    setMostrar(false);
    setTimeout(() => {
      setCantidad(1);
      setPresentacionIdx("");
      setAroma("");
      cerrar();
    }, 250);
  };

  if (!producto) return null;

  const tienePresentaciones = Array.isArray(producto.presentaciones) && producto.presentaciones.length > 0;
  const tieneAroma          = Boolean(producto.aroma);
  // tiene_precio controla la visibilidad pública del precio
  const mostrarPrecio       = Boolean(producto.tiene_precio);

  // Presentación seleccionada
  const presentacionSel = tienePresentaciones && presentacionIdx !== ""
    ? producto.presentaciones[parseInt(presentacionIdx)]
    : null;

  // Precio efectivo: viene de la presentación seleccionada
  const precioUnitario = mostrarPrecio && presentacionSel?.precio != null
    ? Number(presentacionSel.precio)
    : null;

  const precioTotal = precioUnitario !== null ? precioUnitario * cantidad : null;

  // Aromas
  const aromasSugeridos = producto.aroma
    ? producto.aroma.split(",").map(a => a.trim()).filter(Boolean)
    : [];

  // Mensaje WhatsApp
  const buildMensaje = () => {
    const lineas = [
      "Hola, estoy interesado en el siguiente producto:",
      "",
      `🧴 *Producto:* ${producto.nombre}`,
      `📦 *Cantidad:* ${cantidad}`,
    ];
    if (presentacionSel) lineas.push(`📐 *Presentación:* ${presentacionSel.nombre}`);
    if (aroma.trim())    lineas.push(`🌸 *Aroma:* ${aroma}`);
    if (precioTotal !== null) {
      lineas.push(`💰 *Precio unitario:* ${formatCOP(precioUnitario)}`);
      lineas.push(`💵 *Precio total:* ${formatCOP(precioTotal)}`);
    }
    lineas.push("", "¡Muchas gracias!");
    return lineas.join("\n");
  };

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMensaje())}`;

  return (
    <div onClick={handleCerrar}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-end md:items-center z-50 p-0 md:p-4">
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: mostrar ? 1 : 0, y: mostrar ? 0 : 60, scale: mostrar ? 1 : 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-t-3xl md:rounded-3xl w-full md:w-[600px] md:max-w-[600px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-xs font-bold text-[#3ec6e0] uppercase tracking-widest mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Cotizar producto
            </p>
            <h2 className="font-display text-[#0d2952] text-xl leading-tight">{producto.nombre}</h2>
          </div>
          <button onClick={handleCerrar}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="overflow-y-auto flex-1">

          {/* Imagen */}
          <div className="relative h-56 md:h-64 bg-slate-50 flex-shrink-0">
            <img src={resolveImg(producto.imagen)} alt={producto.nombre}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = "none"; }} />
            {producto.descuento > 0 && (
              <div className="absolute top-3 right-3">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  -{producto.descuento}% OFF
                </span>
              </div>
            )}
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* Descripción */}
            {producto.descripcion && (
              <p className="text-slate-500 text-sm leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {producto.descripcion}
              </p>
            )}

            {/* ── Selector de Presentación ── */}
            {tienePresentaciones && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Presentación
                </p>

                {producto.presentaciones.length <= 4 ? (
                  <div className="flex flex-wrap gap-2">
                    {producto.presentaciones.map((pr, idx) => (
                      <button key={idx} type="button"
                        onClick={() => setPresentacionIdx(String(idx))}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          presentacionIdx === String(idx)
                            ? "bg-[#3ec6e0]/15 border-[#3ec6e0] text-[#0d2952]"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span className="font-semibold">{pr.nombre}</span>
                        {/* Precio en la pill solo si tiene_precio está activo */}
                        {mostrarPrecio && pr.precio != null && (
                          <span className={`ml-1.5 text-xs ${
                            presentacionIdx === String(idx) ? "text-[#0d2952]/70" : "text-slate-400"
                          }`}>
                            {formatCOP(pr.precio)}
                          </span>
                        )}
                        {/* Si no se muestran precios, indica que hay que consultar */}
                        {!mostrarPrecio && (
                          <span className="ml-1.5 text-xs text-slate-400">Consultar</span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <select value={presentacionIdx}
                      onChange={e => setPresentacionIdx(e.target.value)}
                      className={selectCls}>
                      <option value="">Selecciona una presentación</option>
                      {producto.presentaciones.map((pr, idx) => (
                        <option key={idx} value={String(idx)}>
                          {pr.nombre}
                          {mostrarPrecio && pr.precio != null ? ` — ${formatCOP(pr.precio)}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                )}

                {/* Stock de la presentación seleccionada */}
                {presentacionSel && (
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${presentacionSel.stock > 0 ? "bg-green-400" : "bg-red-400"}`} />
                    {presentacionSel.stock > 0
                      ? `${presentacionSel.stock} unidades disponibles`
                      : "Sin stock en esta presentación"}
                  </p>
                )}
              </div>
            )}

            {/* ── Cantidad ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Cantidad
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0 border border-slate-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setCantidad(c => Math.max(1, c - 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#0d2952] hover:bg-slate-50 transition-colors">
                    <Minus size={15} />
                  </button>
                  <span className="w-12 text-center font-display text-[#0d2952] text-lg select-none">
                    {cantidad}
                  </span>
                  <button type="button" onClick={() => setCantidad(c => c + 1)}
                    className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#0d2952] hover:bg-slate-50 transition-colors">
                    <Plus size={15} />
                  </button>
                </div>

                {/* Precio unitario visible o "Consultar precio" */}
                <div className="flex-1">
                  <p className="text-xs text-slate-400 mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Precio unitario
                  </p>
                  {mostrarPrecio && precioUnitario !== null ? (
                    <p className="font-display text-[#0d2952] text-lg">{formatCOP(precioUnitario)}</p>
                  ) : (
                    <p className="text-sm font-semibold text-slate-400 italic"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Consultar precio
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Aroma ── */}
            {tieneAroma && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Aroma
                </p>
                {aromasSugeridos.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {aromasSugeridos.map(a => (
                      <button key={a} type="button"
                        onClick={() => setAroma(prev => prev === a ? "" : a)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          aroma === a
                            ? "bg-[#3ec6e0]/15 border-[#3ec6e0] text-[#0d2952]"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {a}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input value={aroma} onChange={e => setAroma(e.target.value)}
                    placeholder="Ej: Menta, Lavanda, sin aroma..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0d2952] placeholder:text-slate-400 focus:outline-none focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/15 transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }} />
                )}
              </div>
            )}

            {/* ── Resumen del pedido (solo si hay precio visible) ── */}
            {mostrarPrecio && precioTotal !== null && (
              <div className="bg-[#f4f8fb] rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Resumen
                </p>
                {presentacionSel && (
                  <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Presentación: <span className="font-semibold text-[#0d2952]">{presentacionSel.nombre}</span>
                  </p>
                )}
                <div className="flex justify-between items-center text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-slate-500">{cantidad} × {formatCOP(precioUnitario)}</span>
                  <span className="font-bold text-[#0d2952] text-base">{formatCOP(precioTotal)}</span>
                </div>
                {producto.descuento > 0 && (
                  <p className="text-xs text-green-600 font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ✓ Descuento del {producto.descuento}% aplicable — confirmar con el asesor
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex-shrink-0 bg-white">
          <a href={waUrl} target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#1ebe5d] hover:scale-[1.01] hover:shadow-lg transition-all"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <MessageCircle size={18} />
            Enviar pedido por WhatsApp
          </a>
          <p className="text-center text-slate-400 text-xs mt-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Se abrirá WhatsApp con los detalles de tu pedido
          </p>
        </div>
      </motion.div>
    </div>
  );
}
