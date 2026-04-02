import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpg";

const WA_LINK =
  "https://api.whatsapp.com/send/?phone=573228540713&text&type=phone_number&app_absent=0";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/contacto", label: "Contacto" },
  { to: "/informacion", label: "Información" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logueado, setLogueado] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const sync = () => setLogueado(!!localStorage.getItem("token"));
  sync();
  window.addEventListener("storage", sync);
  return () => window.removeEventListener("storage", sync);
}, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const entrarAdmin = () => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    if (!token) { navigate("/login"); return; }
    rol === "admin" ? navigate("/dashboard") : alert("No tienes permisos de administrador");
  };

  const logout = () => {
    localStorage.clear();
    setLogueado(false);
    navigate("/");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0d2952]/95 backdrop-blur-md shadow-[0_4px_40px_rgba(13,41,82,0.4)] py-2" : "bg-[#0d2952] py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between">

          {/* Logo + Brand */}
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              {/* Glow aqua difuso */}
              <div className="absolute inset-0 rounded-full bg-[#3ec6e0] opacity-25 blur-[10px] scale-[1.4] group-hover:opacity-55 transition-opacity duration-300" />
              {/* Fondo blanco ciruclar + imagen */}
              <div className="relative w-10 h-10 rounded-full bg-white p-[2px] shadow-lg group-hover:scale-110 transition-transform duration-300">
                <img
                  src={logo}
                  alt="Químicos & Soap"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="font-display text-white text-xl tracking-wide group-hover:text-[#3ec6e0] transition-colors duration-300">
              Químicos & Soap
            </span>
          </button>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg ${
                    active ? "text-[#3ec6e0]" : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                  {active && (
                    <motion.span layoutId="nav-dot"
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#3ec6e0]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 hover:shadow-[0_0_24px_rgba(62,198,224,0.4)] transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <MessageCircle size={15} /> Cotizar
            </a>
            <button onClick={entrarAdmin}
              className="text-white/40 text-xs font-medium px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white/70 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Admin
            </button>
            {logueado && (
              <button onClick={logout}
                className="text-red-400 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Salir
              </button>
            )}
          </div>

          {/* Burger */}
          <button className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-[#0d2952]/98 backdrop-blur-md border-t border-white/10 shadow-2xl md:hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === to ? "bg-white/10 text-[#3ec6e0]" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold py-3 rounded-xl text-sm"
                >
                  <MessageCircle size={16} /> Cotizar por WhatsApp
                </a>
                <button onClick={entrarAdmin} className="text-white/40 text-sm py-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Admin</button>
                {logueado && <button onClick={logout} className="text-red-400 text-sm py-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cerrar sesión</button>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[68px]" />
    </>
  );
}
