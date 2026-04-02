import { motion } from "framer-motion";
import {
  Target, Eye, Star, Zap, Users, Leaf,
  HeartHandshake, TrendingUp, Shield, ArrowRight, MessageCircle,
} from "lucide-react";

const WA_LINK =
  "https://api.whatsapp.com/send/?phone=573228540713&text&type=phone_number&app_absent=0";

// Variante reutilizable
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const VALORES = [
  {
    icon: <Star size={22} strokeWidth={1.5} />,
    title: "Calidad",
    desc: "En nuestro servicio y en cada producto que fabricamos, sin excepción.",
    color: "#3ec6e0",
  },
  {
    icon: <HeartHandshake size={22} strokeWidth={1.5} />,
    title: "Respeto",
    desc: "Por nuestros clientes, colaboradores y proveedores, en cada interacción.",
    color: "#5abf72",
  },
  {
    icon: <Zap size={22} strokeWidth={1.5} />,
    title: "Innovación",
    desc: "Mejoramiento continuo de productos, servicios y procesos. Sin pausa.",
    color: "#3ec6e0",
  },
  {
    icon: <TrendingUp size={22} strokeWidth={1.5} />,
    title: "Compromiso",
    desc: "Elegimos el presente para comprometernos con el futuro de nuestros clientes.",
    color: "#5abf72",
  },
  {
    icon: <Leaf size={22} strokeWidth={1.5} />,
    title: "Sostenibilidad",
    desc: "Crecemos de forma sostenible sin perder de vista nuestra responsabilidad social y ambiental.",
    color: "#3ec6e0",
  },
  {
    icon: <Shield size={22} strokeWidth={1.5} />,
    title: "Integridad",
    desc: "Coherencia y comportamiento ético hacia las personas, el medio ambiente y la sociedad.",
    color: "#5abf72",
  },
];

// Sub-componente: bloque de sección con scroll reveal
function RevealSection({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Informacion() {
  return (
    <div className="bg-[#f4f8fb] overflow-x-hidden">

      {/* ══════════════════ HEADER ══════════════════ */}
      <section className="bg-[#0d2952] pt-16 pb-28 px-6 md:px-16 relative overflow-hidden">
        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(62,198,224,0.10) 0%, transparent 70%)" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85 }}>
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Quiénes somos
            </span>
            <h1 className="font-display text-white mb-5" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.05 }}>
              Más de cinco años<br />
              <span style={{ background: "linear-gradient(90deg, #3ec6e0, #a8e4ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                construyendo limpieza.
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Desarrollamos, producimos y comercializamos soluciones de aseo y desinfección para hogares e industrias. Somos más que un proveedor: somos tu aliado estratégico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ MISIÓN ══════════════════ */}
      <section className="px-6 md:px-16 -mt-10 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">

            {/* Misión */}
            <RevealSection delay={0}>
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#3ec6e0]/8 group-hover:bg-[#3ec6e0]/15 transition-colors duration-400" />
                <div className="w-12 h-12 rounded-2xl bg-[#3ec6e0]/12 flex items-center justify-center mb-6">
                  <Target size={24} className="text-[#3ec6e0]" strokeWidth={1.5} />
                </div>
                <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Misión
                </span>
                <h2 className="font-display text-[#0d2952] text-2xl mb-4">¿Por qué existimos?</h2>
                <p className="text-slate-500 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Desarrollar, producir, comercializar y vender productos de aseo, limpieza, desinfección y mantenimiento que logren generar <strong className="text-[#0d2952]">valor sostenible</strong> en hogares e industrias, cuidando el medio ambiente y siendo el principal aliado estratégico de cada uno de nuestros clientes, colaboradores y proveedores.
                </p>
              </div>
            </RevealSection>

            {/* Visión */}
            <RevealSection delay={1}>
              <div className="bg-[#0d2952] rounded-3xl p-10 shadow-2xl h-full relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-[#3ec6e0]/10 group-hover:bg-[#3ec6e0]/18 transition-colors duration-400" />
                <div className="w-12 h-12 rounded-2xl bg-[#3ec6e0]/15 flex items-center justify-center mb-6">
                  <Eye size={24} className="text-[#3ec6e0]" strokeWidth={1.5} />
                </div>
                <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.2em] uppercase block mb-3"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Visión
                </span>
                <h2 className="font-display text-white text-2xl mb-4">¿Hacia dónde vamos?</h2>
                <p className="text-slate-300 text-base leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Ser una empresa <strong className="text-[#3ec6e0]">líder e innovadora</strong> capaz de generar soluciones a los requerimientos que surgen día a día en hogares e industrias, con la incorporación de nuevas tecnologías, garantizando el cuidado del medio ambiente y proporcionando confianza, calidad y servicio a todos nuestros grupos de interés.
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══════════════════ POLÍTICA DE CALIDAD ══════════════════ */}
      <section className="bg-white py-24 px-6 md:px-16 relative overflow-hidden">
        {/* Orbe decorativo */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(62,198,224,0.06), transparent)" }}
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Texto */}
            <RevealSection>
              <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.2em] uppercase block mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Política de Calidad
              </span>
              <h2 className="font-display text-[#0d2952] mb-6" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.15 }}>
                Servicio que supera expectativas.
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                En Químicos & Soap nos comprometemos a brindar un servicio y productos que cumplan plenamente los requerimientos y expectativas de nuestros clientes, con <strong className="text-[#0d2952]">amabilidad, respeto, cuidado de los detalles</strong> y una rápida respuesta a sus exigencias.
              </p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0d2952] text-white font-bold px-8 py-4 rounded-xl text-sm hover:scale-105 hover:shadow-xl transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <MessageCircle size={16} />
                Consultar con un asesor
              </a>
            </RevealSection>

            {/* Métricas visuales */}
            <RevealSection delay={1}>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { val: "100+", label: "Clientes satisfechos", color: "#3ec6e0" },
                  { val: "+5", label: "Años de experiencia", color: "#5abf72" },
                  { val: "98%", label: "Índice de satisfacción", color: "#3ec6e0" },
                  { val: "40+", label: "Productos en catálogo", color: "#5abf72" },
                ].map((m, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="bg-[#f4f8fb] rounded-2xl p-6 text-center border border-slate-100 hover:shadow-md transition-all"
                  >
                    <div className="font-display text-3xl font-bold mb-1" style={{ color: m.color }}>{m.val}</div>
                    <div className="text-slate-500 text-xs leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ══════════════════ VALORES ══════════════════ */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">

          <RevealSection className="text-center mb-16">
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Nuestros valores
            </span>
            <h2 className="font-display text-[#0d2952]" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
              Lo que nos define cada día.
            </h2>
          </RevealSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {VALORES.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Borde superior en hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${v.color}, transparent)` }}
                />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${v.color}18`, color: v.color }}
                >
                  {v.icon}
                </div>
                <h3 className="font-display text-[#0d2952] text-lg mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CTA FINAL ══════════════════ */}
      <section className="px-6 md:px-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
          className="max-w-4xl mx-auto bg-[#0d2952] rounded-3xl px-10 md:px-16 py-16 text-center relative overflow-hidden"
          style={{ boxShadow: "0 40px 100px rgba(13,41,82,0.25)" }}
        >
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(62,198,224,0.12) 0%, transparent 70%)" }}
          />
          <div className="relative z-10">
            <span className="text-[#3ec6e0] text-xs font-bold tracking-[0.2em] uppercase block mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Tu aliado estratégico
            </span>
            <h2 className="font-display text-white mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.15 }}>
              Estamos listos para<br />
              <span className="text-[#3ec6e0]">resolver tu necesidad.</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Contáctanos y un asesor especializado te acompañará en cada paso del proceso.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-10 py-4 rounded-xl text-base hover:scale-105 hover:shadow-[0_0_40px_rgba(62,198,224,0.35)] transition-all"
              >
                <MessageCircle size={18} />
                Cotizar por WhatsApp
              </a>
              <a href="/productos"
                className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-10 py-4 rounded-xl text-base hover:border-[#3ec6e0] hover:text-[#3ec6e0] transition-all"
              >
                Ver productos <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
