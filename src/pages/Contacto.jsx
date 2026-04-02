import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Facebook, Phone, Send, MapPin, Clock } from "lucide-react";
import api from "../services/api";

const WA_LINK =
  "https://api.whatsapp.com/send/?phone=573228540713&text&type=phone_number&app_absent=0";
const FB_LINK =
  "https://web.facebook.com/quimicossoap?_rdc=1&_rdr#";

export default function Contacto() {
  // ── Lógica original intacta ──────────────────────────────────
  const [form, setForm] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await api.post("/contacto", form);
      setEnviado(true);
      setForm({});
    } catch (err) {
      alert("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };
  // ────────────────────────────────────────────────────────────

  const INFO = [
    {
      icon: <MessageCircle size={20} />,
      label: "WhatsApp",
      value: "+57 322 854 0713",
      href: WA_LINK,
      color: "#3ec6e0",
    },
    {
      icon: <Facebook size={20} />,
      label: "Facebook",
      value: "quimicossoap",
      href: FB_LINK,
      color: "#3ec6e0",
    },
    {
      icon: <MapPin size={20} />,
      label: "Ubicación",
      value: "Colombia",
      href: null,
      color: "#5abf72",
    },
    {
      icon: <Clock size={20} />,
      label: "Atención",
      value: "Lun – Sáb · 8am – 6pm",
      href: null,
      color: "#5abf72",
    },
  ];

  const inputBase =
    "w-full bg-[#f4f8fb] border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/20 transition-all";

  return (
    <div className="min-h-screen bg-[#f4f8fb]">

      {/* ── Header ── */}
      <section className="bg-[#0d2952] pt-16 pb-24 px-6 md:px-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(62,198,224,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="text-[#3ec6e0] text-xs font-bold tracking-[0.25em] uppercase block mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Hablemos
            </span>
            <h1
              className="font-display text-white mb-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              Contáctanos.
            </h1>
            <p
              className="text-slate-300 text-lg max-w-lg leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Un asesor especializado responderá tu consulta en el menor tiempo posible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Dos columnas ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 -mt-12 pb-24">
        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* ── Columna izquierda: Datos de contacto ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-2 flex flex-col gap-6"
          >
            {/* Card info principal */}
            <div className="bg-[#0d2952] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              {/* Orbe decorativo */}
              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(62,198,224,0.15), transparent)",
                }}
              />
              <h2 className="font-display text-2xl mb-2 relative z-10">
                Información de contacto
              </h2>
              <p
                className="text-slate-300 text-sm mb-8 relative z-10"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Estamos listos para ayudarte a encontrar la solución perfecta.
              </p>

              <div className="flex flex-col gap-5 relative z-10">
                {INFO.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        className="text-slate-400 text-[11px] uppercase tracking-wider mb-0.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white text-sm font-semibold hover:text-[#3ec6e0] transition-colors"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span
                          className="text-white text-sm font-semibold"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card WhatsApp directo */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3ec6e0]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3ec6e0] transition-colors duration-300">
                <MessageCircle size={22} className="text-[#3ec6e0] group-hover:text-white transition-colors" />
              </div>
              <div>
                <div
                  className="text-[#0d2952] font-bold text-sm mb-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Cotizar por WhatsApp
                </div>
                <div
                  className="text-slate-400 text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Respuesta inmediata · Lun – Sáb
                </div>
              </div>
              <div className="ml-auto text-[#3ec6e0] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </a>

            {/* Card Facebook */}
            <a
              href={FB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#5abf72]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5abf72] transition-colors duration-300">
                <Facebook size={22} className="text-[#5abf72] group-hover:text-white transition-colors" />
              </div>
              <div>
                <div
                  className="text-[#0d2952] font-bold text-sm mb-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Síguenos en Facebook
                </div>
                <div
                  className="text-slate-400 text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  @quimicossoap
                </div>
              </div>
              <div className="ml-auto text-[#5abf72] opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </a>
          </motion.div>

          {/* ── Columna derecha: Formulario ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-slate-100">
              {enviado ? (
                /* Estado de éxito */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#c2e8cb] flex items-center justify-center mx-auto mb-5">
                    <Send size={28} className="text-[#5abf72]" />
                  </div>
                  <h3 className="font-display text-[#0d2952] text-2xl mb-3">
                    ¡Mensaje enviado!
                  </h3>
                  <p
                    className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Gracias por contactarnos. Un asesor especializado te responderá pronto.
                  </p>
                  <button
                    onClick={() => setEnviado(false)}
                    className="text-[#3ec6e0] text-sm font-semibold hover:underline"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                /* Formulario */
                <>
                  <h2 className="font-display text-[#0d2952] text-2xl mb-2">
                    Envíanos un mensaje
                  </h2>
                  <p
                    className="text-slate-400 text-sm mb-8"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Completa el formulario y te contactamos a la brevedad.
                  </p>

                  {/* ── FORM: lógica original 100% intacta ── */}
                  <form onSubmit={enviar} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          className="block text-xs font-bold text-[#0d2952] uppercase tracking-wider mb-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Nombre *
                        </label>
                        <input
                          required
                          placeholder="Tu nombre completo"
                          value={form.nombre || ""}
                          onChange={(e) =>
                            setForm({ ...form, nombre: e.target.value })
                          }
                          className={inputBase}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-bold text-[#0d2952] uppercase tracking-wider mb-2"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Correo *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="tu@correo.com"
                          value={form.email || ""}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className={inputBase}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold text-[#0d2952] uppercase tracking-wider mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Teléfono
                      </label>
                      <input
                        placeholder="+57 300 000 0000"
                        value={form.telefono || ""}
                        onChange={(e) =>
                          setForm({ ...form, telefono: e.target.value })
                        }
                        className={inputBase}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold text-[#0d2952] uppercase tracking-wider mb-2"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Mensaje *
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Cuéntanos tu necesidad o consulta..."
                        value={form.mensaje || ""}
                        onChange={(e) =>
                          setForm({ ...form, mensaje: e.target.value })
                        }
                        className={`${inputBase} resize-none`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={enviando}
                      whileHover={{ scale: enviando ? 1 : 1.02, boxShadow: "0 16px 48px rgba(13,41,82,0.2)" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 bg-[#0d2952] text-white font-bold py-4 rounded-xl text-base shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {enviando ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Enviar mensaje
                        </>
                      )}
                    </motion.button>

                    <p
                      className="text-slate-400 text-xs text-center"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ¿Prefieres atención inmediata?{" "}
                      <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3ec6e0] font-semibold hover:underline"
                      >
                        Escríbenos por WhatsApp
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
