// frontend/src/pages/Productos.jsx
// Reemplaza el archivo completo.
//
// Cambios:
// · ProductCard muestra precios de presentaciones (no producto.precio)
// · Si tiene_precio=false muestra "Consultar precio" en vez del monto
// · El modal se abre para cualquier producto con presentaciones
// · Se elimina la lógica hardcodeada de CAT_CON_PRECIO="Hogar"

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  MessageCircle, Search, ChevronRight,
  AlertCircle, Loader2, ImageOff, Tag,
  ArrowLeft, ShoppingCart,
} from "lucide-react";
import ProductModal from "../components/ProductModal";

const API      = import.meta.env.VITE_API_URL  || "http://localhost:4000/api";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const WA_GENERIC = "https://api.whatsapp.com/send/?phone=573228540713&text&type=phone_number&app_absent=0";

function waLink(nombre) {
  const text = `Hola Químicos & Soap, me gustaría recibir más información y cotizar el producto: ${nombre}. ¡Muchas gracias!`;
  return `https://api.whatsapp.com/send?phone=573228540713&text=${encodeURIComponent(text)}`;
}

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

function ProductImage({ src, alt }) {
  const [error, setError] = useState(false);
  const url = resolveImg(src);
  if (error || !url) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-2">
        <ImageOff size={28} className="text-slate-300" />
        <span className="text-slate-300 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sin imagen</span>
      </div>
    );
  }
  return (
    <img src={url} alt={alt} onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
      <div className="h-48 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        <div className="h-3 bg-slate-100 rounded-lg w-full" />
        <div className="h-10 bg-slate-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function SkeletonCategory() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse shadow">
      <div className="h-40 bg-slate-100" />
      <div className="p-5 space-y-2">
        <div className="h-5 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
      </div>
    </div>
  );
}

function CategoryCard({ cat, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(13,41,82,0.13)" }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(cat)}
      className="relative overflow-hidden rounded-2xl text-left group cursor-pointer bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="h-40 overflow-hidden relative bg-slate-50">
        <ProductImage src={cat.imagen} alt={cat.nombre} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2952]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-[#3ec6e0]/15 flex items-center justify-center">
            <Tag size={12} className="text-[#3ec6e0]" />
          </div>
          <h3 className="font-display text-[#0d2952] text-lg leading-tight">{cat.nombre}</h3>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3ec6e0] group-hover:gap-2.5 transition-all mt-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Ver productos <ChevronRight size={13} />
        </span>
      </div>
    </motion.button>
  );
}

// ── Tarjeta de producto ───────────────────────────────────────
function ProductCard({ p, index, subcats, onOpenModal }) {
  const subcatNombre = subcats.find(s => s.id === p.subcategoria_id)?.nombre || null;

  // Tiene presentaciones configuradas
  const tienePresentaciones = Array.isArray(p.presentaciones) && p.presentaciones.length > 0;
  // Mostrar precio: solo si tiene_precio está activo
  const mostrarPrecio = Boolean(p.tiene_precio);

  // Precio mínimo de las presentaciones (para mostrar "Desde $X")
  const precioMinimo = mostrarPrecio && tienePresentaciones
    ? p.presentaciones
        .filter(pr => pr.precio != null)
        .sort((a, b) => a.precio - b.precio)[0]?.precio ?? null
    : null;

  const handleClick = () => {
    // Si tiene presentaciones → abrir modal
    if (tienePresentaciones && onOpenModal) {
      onOpenModal(p);
      return;
    }
    // Si no → WhatsApp directo
    window.open(waLink(p.nombre), "_blank", "noreferrer");
  };

  const abrirModal = tienePresentaciones;

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      {/* Imagen */}
      <div className="relative h-52 overflow-hidden flex-shrink-0 bg-slate-50">
        <ProductImage src={p.imagen} alt={p.nombre} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2952]/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {p.descuento > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              -{p.descuento}%
            </span>
          </div>
        )}
        {subcatNombre && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="bg-[#3ec6e0] text-[#0d2952] text-[10px] font-bold px-3 py-1.5 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {subcatNombre}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-display text-[#0d2952] text-lg mb-1 leading-tight">{p.nombre}</h3>
          {subcatNombre && (
            <p className="text-[#3ec6e0] text-xs font-semibold mb-2 uppercase tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {subcatNombre}
            </p>
          )}
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {p.descripcion}
          </p>

          {/* Precio desde las presentaciones */}
          <div className="mt-3">
            {mostrarPrecio && precioMinimo !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Desde
                </span>
                <span className="font-display text-[#0d2952] text-xl">
                  {formatCOP(precioMinimo)}
                </span>
              </div>
            ) : mostrarPrecio && !tienePresentaciones ? (
              // tiene_precio activo pero sin presentaciones con precio
              <span className="text-sm font-semibold text-slate-400 italic"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Consultar precio
              </span>
            ) : !mostrarPrecio ? (
              // tiene_precio desactivado: ocultar precio
              <span className="text-sm font-semibold text-slate-400 italic"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Consultar precio
              </span>
            ) : null}
          </div>

          {/* Badges de presentaciones disponibles */}
          {tienePresentaciones && (
            <div className="flex flex-wrap gap-1 mt-2">
              {p.presentaciones.slice(0, 3).map((pr, i) => (
                <span key={i}
                  className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {pr.nombre}
                </span>
              ))}
              {p.presentaciones.length > 3 && (
                <span className="bg-slate-100 text-slate-400 text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  +{p.presentaciones.length - 3} más
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer tarjeta */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.stock > 0 ? "bg-[#5abf72]" : "bg-red-400"}`} />
            <span className="text-xs font-semibold" style={{
              fontFamily: "'DM Sans', sans-serif",
              color: p.stock > 0 ? "#5abf72" : "#f87171",
            }}>
              {p.stock > 0 ? `${p.stock} disponibles` : "Agotado"}
            </span>
          </div>

          <button onClick={handleClick}
            className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl hover:scale-[1.02] transition-all whitespace-nowrap flex-shrink-0 ${
              abrirModal
                ? "bg-[#3ec6e0] text-[#0d2952] hover:bg-[#2bb5d2]"
                : "bg-[#0d2952] text-white hover:bg-[#1a4f8a]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {abrirModal
              ? <><ShoppingCart size={13} /> Cotizar</>
              : <><MessageCircle size={13} /> Cotizar</>
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ search, onRetry, isError }) {
  return (
    <div className="text-center py-24">
      {isError
        ? <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
        : <div className="w-16 h-16 rounded-2xl bg-[#f0fbfd] flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-[#3ec6e0]" />
          </div>
      }
      <h3 className="font-display text-[#0d2952] text-xl mb-2">
        {isError ? "Error al cargar productos" : "Sin resultados"}
      </h3>
      <p className="text-slate-400 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {isError
          ? "No se pudo conectar con el servidor."
          : search
            ? `No hay productos que coincidan con "${search}"`
            : "No hay productos en esta categoría aún."}
      </p>
      {isError
        ? <button onClick={onRetry}
            className="inline-flex items-center gap-2 bg-[#0d2952] text-white font-bold px-8 py-3 rounded-xl text-sm hover:scale-105 transition-all">
            <Loader2 size={14} /> Reintentar
          </button>
        : <a href={WA_GENERIC} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-8 py-3 rounded-xl text-sm hover:scale-105 transition-all">
            <MessageCircle size={16} /> Consultar asesor
          </a>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
export default function Productos() {

  const [nivel,     setNivel]     = useState(0);
  const [categoria, setCategoria] = useState(null);
  const [subcat,    setSubcat]    = useState(null);
  const [search,    setSearch]    = useState("");

  const [categorias, setCategorias] = useState([]);
  const [subcats,    setSubcats]    = useState([]);
  const [productos,  setProductos]  = useState([]);

  const [loadingCats,    setLoadingCats]    = useState(true);
  const [loadingSubcats, setLoadingSubcats] = useState(false);
  const [loadingProds,   setLoadingProds]   = useState(false);
  const [errorCats,      setErrorCats]      = useState(null);
  const [errorProds,     setErrorProds]     = useState(null);

  const [productoModal, setProductoModal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const { data } = await axios.get(`${API}/categorias`);
        setCategorias(data);
      } catch {
        setErrorCats("No se pudieron cargar las categorías.");
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!categoria) return;
    (async () => {
      try {
        setLoadingSubcats(true);
        const { data } = await axios.get(`${API}/subcategorias/${categoria.id}`);
        setSubcats(data);
        if (data.length === 0) {
          await cargarProductos(categoria.id, null);
          setNivel(2);
        } else {
          setNivel(1);
        }
      } catch {
        setErrorProds("Error cargando subcategorías.");
      } finally {
        setLoadingSubcats(false);
      }
    })();
  }, [categoria]);

  const cargarProductos = async (catId, subcatId) => {
    try {
      setLoadingProds(true);
      setErrorProds(null);
      const params = { categoria_id: catId };
      if (subcatId) params.subcategoria_id = subcatId;
      const { data } = await axios.get(`${API}/productos`, { params });
      setProductos(data);
    } catch {
      setErrorProds("No se pudieron cargar los productos.");
    } finally {
      setLoadingProds(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return productos;
    const q = search.toLowerCase();
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.descripcion || "").toLowerCase().includes(q)
    );
  }, [productos, search]);

  const handleSelectCategoria = (cat) => {
    setCategoria(cat);
    setSubcat(null);
    setProductos([]);
    setSearch("");
  };

  const handleSelectSubcat = async (s) => {
    setSubcat(s);
    setSearch("");
    setNivel(2);
    await cargarProductos(categoria.id, s.id);
  };

  const handleBack = () => {
    if (nivel === 2 && subcats.length > 0) {
      setNivel(1);
      setSubcat(null);
      setSearch("");
    } else {
      setNivel(0);
      setCategoria(null);
      setSubcat(null);
      setProductos([]);
      setSubcats([]);
      setSearch("");
    }
  };

  const breadcrumb = [
    { label: "Catálogo", onClick: () => { setNivel(0); setCategoria(null); setSubcat(null); setProductos([]); setSubcats([]); } },
    categoria && { label: categoria.nombre, onClick: () => { if (subcats.length > 0) { setNivel(1); setSubcat(null); } } },
    subcat    && { label: subcat.nombre, onClick: null },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f8fb]">

      {/* Header */}
      <section className="bg-[#0d2952] pt-16 pb-24 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(62,198,224,0.10) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-6 flex-wrap"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <ChevronRight size={12} />}
                  {b.onClick
                    ? <button onClick={b.onClick} className="hover:text-[#3ec6e0] transition-colors">{b.label}</button>
                    : <span className="text-[#3ec6e0]">{b.label}</span>
                  }
                </span>
              ))}
            </div>
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Catálogo profesional
            </span>
            <h1 className="font-display text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.05 }}>
              {subcat ? subcat.nombre : categoria ? categoria.nombre : "Nuestros productos."}
            </h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {nivel === 0
                ? "Selecciona una categoría para explorar el catálogo completo."
                : "Química de alto rendimiento para cada necesidad."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contenido */}
      <div className="-mt-8 pb-8">
        <AnimatePresence mode="wait">

          {/* NIVEL 0: Categorías */}
          {nivel === 0 && (
            <motion.div key="categorias"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 md:px-16 py-16">
              <div className="text-center mb-12">
                <h2 className="font-display text-[#0d2952] text-3xl md:text-4xl mb-3">¿Qué línea necesitas?</h2>
                <p className="text-slate-500 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Selecciona una categoría para ver los productos disponibles.
                </p>
              </div>
              {loadingCats && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => <SkeletonCategory key={i} />)}
                </div>
              )}
              {!loadingCats && errorCats && (
                <div className="text-center py-20">
                  <AlertCircle size={36} className="text-red-400 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{errorCats}</p>
                  <button onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 bg-[#0d2952] text-white font-bold px-8 py-3 rounded-xl text-sm">
                    <Loader2 size={14} /> Reintentar
                  </button>
                </div>
              )}
              {!loadingCats && !errorCats && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorias.map((cat, i) => (
                    <CategoryCard key={cat.id} cat={cat} index={i} onClick={handleSelectCategoria} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* NIVEL 1: Subcategorías */}
          {nivel === 1 && (
            <motion.div key="subcategorias"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 md:px-16 py-12">
              <button onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 text-sm hover:text-[#0d2952] transition-colors mb-8"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <ArrowLeft size={16} /> Volver a categorías
              </button>
              {loadingSubcats ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCategory key={i} />)}
                </div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="font-display text-[#0d2952] text-2xl mb-1">{categoria?.nombre}</h2>
                    <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {subcats.length} subcategoría{subcats.length !== 1 ? "s" : ""} disponibles
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <motion.button
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setNivel(2); cargarProductos(categoria.id, null); }}
                      className="relative overflow-hidden rounded-2xl text-left group cursor-pointer bg-[#0d2952] shadow-lg p-6 flex flex-col justify-between min-h-[140px]">
                      <div className="w-10 h-10 rounded-xl bg-[#3ec6e0]/15 flex items-center justify-center mb-4">
                        <Tag size={18} className="text-[#3ec6e0]" />
                      </div>
                      <div>
                        <h3 className="font-display text-white text-lg">Ver todos</h3>
                        <span className="text-[#3ec6e0] text-xs font-semibold flex items-center gap-1 mt-1 group-hover:gap-2 transition-all"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Todos los productos <ChevronRight size={12} />
                        </span>
                      </div>
                    </motion.button>

                    {subcats.map((s, i) => (
                      <motion.button key={s.id}
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (i + 1) * 0.07 }}
                        whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(13,41,82,0.12)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelectSubcat(s)}
                        className="relative overflow-hidden rounded-2xl text-left group cursor-pointer bg-white border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[140px] hover:shadow-lg transition-all">
                        <div className="w-10 h-10 rounded-xl bg-[#3ec6e0]/10 flex items-center justify-center mb-4">
                          <Tag size={18} className="text-[#3ec6e0]" />
                        </div>
                        <div>
                          <h3 className="font-display text-[#0d2952] text-base leading-tight">{s.nombre}</h3>
                          <span className="text-[#3ec6e0] text-xs font-semibold flex items-center gap-1 mt-2 group-hover:gap-2 transition-all"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            Ver productos <ChevronRight size={12} />
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* NIVEL 2: Grid de productos */}
          {nivel === 2 && (
            <motion.div key="productos"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Barra sticky */}
              <div className="sticky top-[68px] z-30 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 md:px-16 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button whileTap={{ scale: 0.96 }} onClick={handleBack}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#f4f8fb] text-slate-400 hover:bg-slate-100 border border-slate-200 whitespace-nowrap"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <ArrowLeft size={13} /> Volver
                    </motion.button>
                    <span className="text-slate-300 hidden md:block">|</span>
                    <span className="text-[#0d2952] text-xs font-semibold hidden md:block"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {subcat ? subcat.nombre : categoria?.nombre}
                    </span>
                  </div>
                  <div className="relative flex-shrink-0 w-full md:w-60">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Buscar producto..." value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-[#f4f8fb] border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#3ec6e0] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-[#0d2952] text-2xl">
                      {subcat ? subcat.nombre : categoria?.nombre}
                    </h2>
                    {!loadingProds && (
                      <p className="text-slate-400 text-sm mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <a href={WA_GENERIC} target="_blank" rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 bg-[#0d2952] text-white font-bold px-6 py-3 rounded-xl text-sm hover:scale-105 hover:shadow-lg transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <MessageCircle size={15} /> Cotizar por WhatsApp
                  </a>
                </div>

                {loadingProds && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                )}

                {!loadingProds && errorProds && (
                  <EmptyState isError search="" onRetry={() => cargarProductos(categoria.id, subcat?.id || null)} />
                )}

                {!loadingProds && !errorProds && filtered.length === 0 && (
                  <EmptyState search={search} />
                )}

                {!loadingProds && !errorProds && filtered.length > 0 && (
                  <AnimatePresence mode="popLayout">
                    <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filtered.map((p, i) => (
                        <ProductCard
                          key={p.id}
                          p={p}
                          index={i}
                          subcats={subcats}
                          onOpenModal={setProductoModal}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA final */}
      <section className="bg-[#0d2952] py-16 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-white text-3xl md:text-4xl mb-4">¿No encontraste lo que buscas?</h2>
            <p className="text-slate-300 mb-8 text-base" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Tenemos soluciones personalizadas para tu industria o hogar.
            </p>
            <a href={WA_GENERIC} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-10 py-4 rounded-xl text-base hover:scale-105 hover:shadow-[0_0_40px_rgba(62,198,224,0.35)] transition-all">
              <MessageCircle size={20} /> Consultar con un Asesor
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal de cotización */}
      {productoModal && (
        <ProductModal producto={productoModal} cerrar={() => setProductoModal(null)} />
      )}
    </div>
  );
}
