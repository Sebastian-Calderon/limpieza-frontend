// frontend/src/pages/Home.jsx
// Reemplaza el archivo actual completo con este contenido.
// Cambios:
//   · Se elimina el array FEATURED hardcodeado
//   · La sección "Productos destacados" consulta GET /api/productos/destacados
//   · Si no hay productos destacados muestra un estado vacío elegante

import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";

import {
  Zap, FlaskConical, Layers, HeadphonesIcon,
  ArrowRight, ChevronRight, MessageCircle, Facebook,
  Shield, Timer, TrendingUp, ImageOff,
} from "lucide-react";

import detailing    from "../assets/detailing.jpg";
import desinfeccion from "../assets/desinfeccion.jpg";
import lavanderia   from "../assets/lavanderia.jpg";
import piso         from "../assets/piso.jpg";
import industrial   from "../assets/industrial.jpg";

const API      = import.meta.env.VITE_API_URL  || "http://localhost:4000/api";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const WA_LINK = "https://api.whatsapp.com/send/?phone=573228540713&text&type=phone_number&app_absent=0";
const FB_LINK = "https://web.facebook.com/quimicossoap?_rdc=1&_rdr#";

const PILLARS = [
  {
    icon: <Zap size={26} strokeWidth={1.5} />,
    title: "Fórmulas de Alto Impacto",
    desc: "Limpieza profunda en menos tiempo. Química de precisión que elimina lo que otros productos no pueden.",
    accent: "#3ec6e0",
  },
  {
    icon: <FlaskConical size={26} strokeWidth={1.5} />,
    title: "Ahorro Inteligente",
    desc: "Productos concentrados que rinden hasta 10× más por cada litro. Menos gasto, mayor resultado.",
    accent: "#5abf72",
  },
  {
    icon: <Layers size={26} strokeWidth={1.5} />,
    title: "Líneas Especializadas",
    desc: "Soluciones técnicas por industria: automotriz, alimenticia, lavandería, pisos y más.",
    accent: "#3ec6e0",
  },
  {
    icon: <HeadphonesIcon size={26} strokeWidth={1.5} />,
    title: "Asesoría Especializada",
    desc: "No solo vendemos productos, brindamos soluciones de limpieza a medida de cada cliente.",
    accent: "#5abf72",
  },
];

const STATS = [
  { value: "100+", label: "Clientes activos" },
  { value: "+5 años", label: "De experiencia" },
  { value: "98%", label: "Satisfacción" },
  { value: "40+", label: "Productos" },
];

function WaButton({ className = "", children }) {
  return (
    <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

// Resuelve la URL de la imagen de un producto
function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${BASE_URL}${src}`;
}

// Tarjeta de producto destacado (dinámica)
function ProductoDestacadoCard({ producto }) {
  const navigate  = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const imgUrl = resolveImg(producto.imagen);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => navigate("/productos")}
      className="group bg-[#f4f8fb] rounded-2xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {imgUrl && !imgErr ? (
          <img
            src={imgUrl}
            alt={producto.nombre}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2952]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {producto.descuento > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              -{producto.descuento}%
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-[#0d2952] text-lg leading-tight">{producto.nombre}</h3>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 group-hover:bg-[#3ec6e0] group-hover:border-[#3ec6e0] transition-all duration-300 flex-shrink-0 ml-2">
            <ArrowRight size={13} className="text-[#3ec6e0] group-hover:text-white transition-colors" />
          </div>
        </div>
        {producto.descripcion && (
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {producto.descripcion}
          </p>
        )}
        {producto.tiene_precio && producto.precio && (
          <div className="flex items-center gap-1.5 mt-3">
            <Timer size={12} className="text-[#3ec6e0]" />
            <span className="text-[#0d2952] text-xs font-semibold"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {Number(producto.precio).toLocaleString("es-CO", {
                style: "currency", currency: "COP",
                minimumFractionDigits: 0, maximumFractionDigits: 0,
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const heroRef  = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // ── Productos destacados desde la API ─────────────────────────
  const [destacados,        setDestacados]        = useState([]);
  const [loadingDestacados, setLoadingDestacados] = useState(true);

  useEffect(() => {
    axios.get(`${API}/productos/destacados`)
      .then(res => setDestacados(res.data))
      .catch(() => setDestacados([]))
      .finally(() => setLoadingDestacados(false));
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: (i = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.75, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="overflow-x-hidden bg-[#f4f8fb]">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden bg-[#0d2952]"
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-[45%] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(62,198,224,0.06) 60%, rgba(62,198,224,0.03) 100%)",
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
        <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(62,198,224,0.12) 0%, transparent 65%)" }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 py-24"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col">
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 border border-[#3ec6e0]/40 text-[#3ec6e0] text-xs font-semibold px-4 py-2 rounded-full mb-8 w-fit tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3ec6e0] animate-pulse" />
                  Soluciones Profesionales · Colombia
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1}
  className="font-display text-white leading-[1.0] mb-6"
  style={{ fontSize: "clamp(3rem, 6vw, 5.8rem)" }}
>
  Soluciones Profesionales de{" "}
  <span className="relative">
    <span style={{
      background: "linear-gradient(90deg, #3ec6e0, #a8e4ef)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>
      Limpieza
    </span>
    <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
      style={{ background: "linear-gradient(90deg, #3ec6e0, transparent)" }}
    />
  </span>
</motion.h1>

<motion.p variants={fadeUp} custom={2}
  className="text-slate-300 text-lg leading-relaxed max-w-lg mb-10 font-light"
  style={{ fontFamily: "'DM Sans', sans-serif" }}
>
  Productos químicos de alta calidad para el hogar e industria.
  Garantizamos resultados excepcionales con fórmulas avanzadas que
  respetan el medio ambiente y cuidan tus superficies.
</motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(62,198,224,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/productos")}
                  className="flex items-center gap-3 bg-[#3ec6e0] text-[#0d2952] font-bold px-8 py-4 rounded-xl text-base shadow-xl transition-all"
                >
                  Ver catálogo <ArrowRight size={18} />
                </motion.button>
                <WaButton className="inline-flex items-center gap-3 border-2 border-white/20 text-white font-semibold px-7 py-4 rounded-xl text-base hover:border-[#3ec6e0] hover:text-[#3ec6e0] transition-all">
                  <MessageCircle size={18} /> Consultar asesor
                </WaButton>
              </motion.div>

              <motion.div variants={fadeUp} custom={4}
                className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/10"
              >
                {STATS.slice(0, 3).map(({ value, label }) => (
                  <div key={label}>
                    <div className="font-display text-[#3ec6e0] text-2xl font-bold">{value}</div>
                    <div className="text-slate-400 text-xs mt-1 uppercase tracking-wider"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Collage asimétrico */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
              style={{ height: "600px" }}
            >
              <motion.div whileHover={{ scale: 1.02 }}
                className="absolute top-0 right-0 w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                style={{ zIndex: 3 }}
              >
                <img src={industrial} className="w-full h-full object-cover" alt="industrial" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2952]/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[#3ec6e0] text-[10px] font-bold tracking-widest uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Línea Industrial</span>
                  <div className="text-white text-sm font-semibold mt-0.5">Alto Rendimiento</div>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02, rotate: -1 }}
                className="absolute top-24 left-0 w-52 h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                style={{ zIndex: 4 }}
              >
                <img src={detailing} className="w-full h-full object-cover" alt="detailing" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2952]/60 to-transparent" />
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }}
                className="absolute bottom-0 left-16 right-0 h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                style={{ zIndex: 2 }}
              >
                <img src={desinfeccion} className="w-full h-full object-cover" alt="desinfeccion" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d2952]/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#3ec6e0] text-[#0d2952] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                    Certificado
                  </span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute top-4 left-4 bg-[#3ec6e0] rounded-xl shadow-2xl px-5 py-3 z-10"
              >
                <div className="text-[#0d2952] text-xs font-bold uppercase tracking-wide">Rendimiento</div>
                <div className="text-[#0d2952] text-2xl font-display font-bold">10×</div>
                <div className="text-[#0d2952]/70 text-[10px]">más que la competencia</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "easeInOut" }}
                className="absolute bottom-16 right-[-12px] bg-white rounded-xl shadow-2xl px-5 py-3 z-10"
              >
                <div className="text-slate-400 text-[10px] uppercase tracking-wide">Clientes</div>
                <div className="text-[#0d2952] text-2xl font-display font-bold">100+</div>
                <div className="text-slate-400 text-[10px]">confían en nosotros</div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30C360 60 720 0 1080 30C1260 45 1380 20 1440 30V60H0V30Z" fill="#f4f8fb" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PILARES
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16"
          >
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Nuestra propuesta</span>
            <h2 className="font-display text-[#0d2952]" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Por qué los profesionales<br />nos eligen.
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PILLARS.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
                />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${p.accent}18`, color: p.accent }}>
                  {p.icon}
                </div>
                <h3 className="font-display text-[#0d2952] text-lg mb-3 leading-tight">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="bg-[#0d2952] py-16 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="font-display text-white text-4xl md:text-5xl font-bold mb-2">{s.value}</div>
              <div className="text-[#3ec6e0] text-xs tracking-[0.18em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LÍNEAS DE PRODUCTO
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16"
          >
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Nuestras líneas</span>
            <h2 className="font-display text-[#0d2952]" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Soluciones para cada entorno.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-lg group cursor-pointer"
              onClick={() => navigate("/productos")}
            >
              <div className="h-56 overflow-hidden">
                <img src={lavanderia} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="hogar" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-[#5abf72]" />
                  <span className="text-[#5abf72] text-xs font-bold tracking-widest uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Línea Hogar</span>
                </div>
                <h3 className="font-display text-[#0d2952] text-2xl mb-3">Cuidado avanzado para tu familia.</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Productos de alto rendimiento formulados para el uso diario. Eficacia profesional en la palma de tu mano.
                </p>
                <span className="flex items-center gap-2 text-[#0d2952] font-semibold text-sm group-hover:text-[#3ec6e0] transition-colors">
                  Explorar línea <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl bg-[#0d2952] shadow-2xl group cursor-pointer"
              onClick={() => navigate("/productos")}
            >
              <div className="h-56 overflow-hidden">
                <img src={industrial} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" alt="industrial" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d2952]/30 via-transparent to-[#0d2952]" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-[#3ec6e0]" />
                  <span className="text-[#3ec6e0] text-xs font-bold tracking-widest uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Línea Industrial</span>
                </div>
                <h3 className="font-display text-white text-2xl mb-3">Soluciones técnicas de alta exigencia.</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Automotriz · Industria Alimenticia · Lavandería · Pisos &amp; Zonas Comunes. Cada sector, su solución específica.
                </p>
                <span className="flex items-center gap-2 text-[#3ec6e0] font-semibold text-sm hover:text-white transition-colors">
                  Ver soluciones <ChevronRight size={16} />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRODUCTOS DESTACADOS — dinámicos desde la DB
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          >
            <div>
              <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Catálogo</span>
              <h2 className="font-display text-[#0d2952]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Productos destacados.
              </h2>
            </div>
            <motion.button whileHover={{ x: 4 }} onClick={() => navigate("/productos")}
              className="flex items-center gap-2 text-[#0d2952] font-semibold text-sm border-b-2 border-[#3ec6e0] pb-1 hover:text-[#3ec6e0] transition-colors self-start md:self-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Ver catálogo completo <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {/* Loading */}
          {loadingDestacados && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#f4f8fb] rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                  <div className="h-52 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sin productos destacados */}
          {!loadingDestacados && destacados.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-[#f4f8fb] flex items-center justify-center mx-auto mb-4">
                <Timer size={28} className="text-[#3ec6e0]" />
              </div>
              <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Pronto habrá productos destacados aquí.
              </p>
              <button onClick={() => navigate("/productos")}
                className="inline-flex items-center gap-2 bg-[#0d2952] text-white font-bold px-8 py-3 rounded-xl text-sm hover:scale-105 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Ver catálogo completo <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Swiper con productos dinámicos */}
          {!loadingDestacados && destacados.length > 0 && (
            <>
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                className="pb-4"
              >
                {destacados.map(producto => (
                  <SwiperSlide key={producto.id}>
                    <ProductoDestacadoCard producto={producto} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="text-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 16px 48px rgba(13,41,82,0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/productos")}
                  className="inline-flex items-center gap-3 bg-[#0d2952] text-white font-bold px-12 py-5 rounded-xl text-base shadow-xl"
                >
                  Ver toda la tienda <ArrowRight size={18} />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BANNER CTA
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="max-w-5xl mx-auto bg-[#0d2952] rounded-3xl overflow-hidden relative"
          style={{ boxShadow: "0 40px 100px rgba(13,41,82,0.3)" }}
        >
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(62,198,224,0.12) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 px-10 md:px-16 py-16">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#3ec6e0]" />
                <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>Asesoría especializada</span>
              </div>
              <h2 className="font-display text-white text-3xl md:text-4xl mb-4 leading-tight">
                No solo vendemos productos.
                <span className="block text-[#3ec6e0]">Brindamos soluciones.</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Cuéntanos tu necesidad y un asesor especializado te recomendará la solución exacta para tu industria o hogar.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(62,198,224,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/contacto")}
                className="inline-flex items-center justify-center gap-3 bg-[#3ec6e0] text-[#0d2952] font-bold px-10 py-4 rounded-xl text-base shadow-xl transition-all"
              >
                <MessageCircle size={20} /> Consultar con un Asesor
              </motion.button>
              <WaButton className="inline-flex items-center justify-center gap-3 border-2 border-white/20 text-white font-semibold px-10 py-4 rounded-xl text-base hover:border-[#3ec6e0] hover:text-[#3ec6e0] transition-all">
                Cotizar por WhatsApp
              </WaButton>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="bg-[#0d2952] pt-16 pb-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-display text-white text-2xl mb-4">Químicos & Soap</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Soluciones de limpieza de alto rendimiento para hogar e industria. Química que funciona.
              </p>
              <a href={FB_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#3ec6e0] text-sm font-semibold hover:text-white transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Facebook size={18} /> Síguenos en Facebook
              </a>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Navegación</h4>
              <ul className="space-y-3">
                {[["Inicio", "/"], ["Productos", "/productos"], ["Contacto", "/contacto"], ["Información", "/informacion"]].map(([label, path]) => (
                  <li key={path}>
                    <button onClick={() => navigate(path)}
                      className="text-slate-400 text-sm hover:text-[#3ec6e0] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold tracking-widest uppercase mb-5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>Contacto</h4>
              <div className="space-y-4">
                <WaButton className="flex items-center gap-3 text-slate-400 text-sm hover:text-[#3ec6e0] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-[#3ec6e0]/10 flex items-center justify-center group-hover:bg-[#3ec6e0]/20 transition-colors">
                    <MessageCircle size={15} className="text-[#3ec6e0]" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>+57 322 854 0713</span>
                </WaButton>
                <a href={FB_LINK} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 text-sm hover:text-[#3ec6e0] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#3ec6e0]/10 flex items-center justify-center group-hover:bg-[#3ec6e0]/20 transition-colors">
                    <Facebook size={15} className="text-[#3ec6e0]" />
                  </div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>quimicossoap</span>
                </a>
              </div>
              <div className="mt-8">
                <WaButton className="w-full flex items-center justify-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold py-3 rounded-xl text-sm hover:scale-105 transition-all">
                  <MessageCircle size={16} /> Cotizar por WhatsApp
                </WaButton>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              © {new Date().getFullYear()} Químicos & Soap · Todos los derechos reservados.
            </p>
            <p className="text-slate-600 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Colombia · Soluciones profesionales de limpieza
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
