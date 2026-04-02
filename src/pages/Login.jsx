import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import api from "../services/api";
import logo from "../assets/logo.jpg";

export default function Login() {
  // ── Lógica de autenticación original 100% intacta ──────────
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones visuales básicas
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      // Guardar datos de sesión (lógica original)
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol",   res.data.rol);
      localStorage.setItem("nombre", res.data.nombre);
      window.dispatchEvent(new Event("storage"));

      // Recargar para actualizar Navbar (lógica original)
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  };
  // ───────────────────────────────────────────────────────────

  const inputBase =
    "w-full bg-white/10 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-200 backdrop-blur-sm";

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

      {/* ── Fondo: gradiente navy profundo + texturas ── */}
      <div className="absolute inset-0 bg-[#0a1e3d]" />

      {/* Orbes de color */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(62,198,224,0.15) 0%, transparent 65%)" }}
      />
      <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(90,191,114,0.10) 0%, transparent 65%)" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(13,41,82,0.8) 0%, transparent 70%)" }}
      />

      {/* Grid sutil */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
      />

      {/* ── Tarjeta Glassmorphism ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* Logo + encabezado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Logo con glow */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#3ec6e0] opacity-30 blur-xl scale-[1.6]" />
                <div className="relative w-16 h-16 rounded-full bg-white p-[3px] shadow-2xl">
                  <img src={logo} alt="Químicos & Soap" className="w-full h-full rounded-full object-cover" />
                </div>
              </div>
            </div>

            <h1 className="font-display text-white text-2xl mb-1">Panel Administrativo</h1>
            <p className="text-white/40 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Químicos & Soap · Acceso restringido
            </p>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="admin@quimicossoap.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`${inputBase} ${
                  error && !form.email
                    ? "border-red-400/60 focus:border-red-400"
                    : "border-white/15 focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/20"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputBase} pr-12 ${
                    error && !form.password
                      ? "border-red-400/60 focus:border-red-400"
                      : "border-white/15 focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/20"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3"
              >
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{error}</p>
              </motion.div>
            )}

            {/* Botón submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : "0 0 32px rgba(62,198,224,0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-[#3ec6e0] text-[#0d2952] font-bold py-4 rounded-xl text-base shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Iniciar sesión
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer de la card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={13} className="text-[#3ec6e0]" />
            <p className="text-white/30 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Acceso seguro · Solo personal autorizado
            </p>
          </motion.div>
        </div>

        {/* Enlace de regreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-center mt-5"
        >
          <a href="/"
            className="text-white/35 text-xs hover:text-white/60 transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Volver al inicio
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
