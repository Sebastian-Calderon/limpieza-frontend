// frontend/src/pages/Dashboard.jsx
// Reemplaza el archivo actual completo.
// Cambios respecto a la versión anterior:
//   · Botón "X" para eliminar imagen en modales de editar cat/subcat
//   · Renderizado condicional: sin imagen → solo inicial, sin placeholder roto
//   · Las subcategorías ahora muestran su imagen correctamente

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  LayoutDashboard, Package, Tag, Mail, Users,
  Plus, Trash2, Edit3, X, ChevronRight,
  Loader2, ImageOff, Menu, LogOut,
  UploadCloud, Search, CheckCircle2, AlertCircle,
  RefreshCw, ChevronDown, Layers, Beaker,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const UNIDADES_DISPONIBLES = [
  { id: 1, nombre: "1 litro" },
  { id: 2, nombre: "2 litros" },
  { id: 3, nombre: "3 litros" },
  { id: 4, nombre: "1 galón" },
  { id: 5, nombre: "500 mililitros" },
  { id: 6, nombre: "250 gramos" },
  { id: 7, nombre: "500 gramos" },
  { id: 8, nombre: "1 kilo" },
];

function resolveImg(src) {
  if (!src) return null;
  return src.startsWith("http") ? src : `${BASE_URL}${src}`;
}

// Imagen de producto con fallback a ícono
function Img({ src, alt, className }) {
  const [err, setErr] = useState(false);
  const url = resolveImg(src);
  if (err || !url) {
    return (
      <div className={`${className} bg-slate-100 flex items-center justify-center flex-shrink-0`}>
        <ImageOff size={16} className="text-slate-300" />
      </div>
    );
  }
  return <img src={url} alt={alt} onError={() => setErr(true)} className={`${className} object-cover`} />;
}

// Thumbnail para categoría/subcategoría:
// · Con imagen → <img>
// · Sin imagen → cuadrado con inicial, sin error, sin espacio roto
function CatImg({ imagen, nombre, className = "w-14 h-14", textSize = "text-xl" }) {
  const [err, setErr] = useState(false);
  const url = resolveImg(imagen);

  if (!url || err) {
    return (
      <div className={`${className} rounded-xl bg-[#3ec6e0]/15 flex items-center justify-center flex-shrink-0`}>
        <span className={`font-display text-[#0d2952] font-bold ${textSize}`}>
          {nombre?.charAt(0)?.toUpperCase()}
        </span>
      </div>
    );
  }
  return (
    <img src={url} alt={nombre} onError={() => setErr(true)}
      className={`${className} rounded-xl object-cover flex-shrink-0`} />
  );
}

// Thumbnail pequeño para subcategorías dentro del panel expandible
function SubcatImg({ imagen, nombre }) {
  const [err, setErr] = useState(false);
  const url = resolveImg(imagen);

  if (!url || err) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#3ec6e0]/10 flex items-center justify-center flex-shrink-0">
        <span className="text-[#3ec6e0] font-bold text-xs">{nombre?.charAt(0)?.toUpperCase()}</span>
      </div>
    );
  }
  return (
    <img src={url} alt={nombre} onError={() => setErr(true)}
      className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold pointer-events-auto ${
            toast.type === "success" ? "bg-[#0d2952] text-white" : "bg-red-500 text-white"
          }`}
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {toast.type === "success"
            ? <CheckCircle2 size={16} className="flex-shrink-0" />
            : <AlertCircle  size={16} className="flex-shrink-0" />}
          <span>{toast.msg}</span>
          <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity">
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(13,41,82,0.45)", backdropFilter: "blur(6px)" }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden w-full max-h-[92vh] ${
              wide ? "max-w-2xl" : "max-w-md"
            }`}>
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
              <h3 className="font-display text-[#0d2952] text-xl">{title}</h3>
              <button onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <X size={14} className="text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-7 py-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-[#0d2952] placeholder:text-slate-400 focus:outline-none focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/15 transition-all";

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-[#3ec6e0]" : "bg-slate-200"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-[#0d2952] font-medium">{label}</span>
    </label>
  );
}

function BtnPrimary({ loading: isLoading, children, ...props }) {
  return (
    <button {...props} disabled={isLoading || props.disabled}
      className="flex-1 py-3 rounded-xl bg-[#3ec6e0] text-[#0d2952] text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {isLoading ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : children}
    </button>
  );
}

function ImageField({ label, hint, value, onChange }) {
  return (
    <Field label={label} hint={hint}>
      <label className={`${inputCls} flex items-center gap-3 cursor-pointer hover:border-[#3ec6e0] transition-colors`}>
        <UploadCloud size={16} className="text-slate-400 flex-shrink-0" />
        <span className="text-slate-400 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {value ? value.name : "Seleccionar imagen..."}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={e => onChange(e.target.files[0])} />
      </label>
    </Field>
  );
}

// Preview de imagen actual con botón para eliminarla
function ImagePreview({ imagen, onEliminar, loadingKey, loading }) {
  const url = resolveImg(imagen);
  if (!url) return null;
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="relative flex-shrink-0">
        <img src={url} alt="actual" className="w-12 h-12 rounded-lg object-cover"
          onError={e => { e.target.style.display = "none"; }} />
        {/* Botón X para eliminar imagen */}
        <button type="button" onClick={onEliminar}
          disabled={loading[loadingKey]}
          title="Eliminar imagen"
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors disabled:opacity-60">
          {loading[loadingKey]
            ? <Loader2 size={10} className="animate-spin" />
            : <X size={10} />}
        </button>
      </div>
      <p className="text-xs text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Imagen actual — sube una nueva para reemplazarla, o haz clic en la <span className="text-red-400 font-semibold">×</span> para eliminarla.
      </p>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "resumen",    label: "Resumen",    icon: <LayoutDashboard size={18} /> },
  { id: "productos",  label: "Productos",  icon: <Package  size={18} /> },
  { id: "categorias", label: "Categorías", icon: <Tag      size={18} /> },
  { id: "mensajes",   label: "Mensajes",   icon: <Mail     size={18} /> },
  { id: "usuarios",   label: "Usuarios",   icon: <Users    size={18} /> },
];

const FORM_INICIAL = {
  nombre: "", descripcion: "", imagen: null,
  categoria_id: "", subcategoria_id: "",
  descuento: "", stock: "",
  tiene_precio: false,
  aroma: "",
  unidades: [], presentaciones: [], destacado: false,
};

export default function Dashboard() {

  const [seccion,  setSeccion]  = useState("resumen");
  const [sideOpen, setSideOpen] = useState(false);

  const [productos,     setProductos]     = useState([]);
  const [categorias,    setCategorias]    = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [mensajes,      setMensajes]      = useState([]);

  const [subcatsPorCategoria, setSubcatsPorCategoria] = useState({});
  const [catExpandida,        setCatExpandida]        = useState(null);
  const [loadingSubcats,      setLoadingSubcats]      = useState({});

  const [form, setForm] = useState(FORM_INICIAL);
  const [nuevaCategoria,    setNuevaCategoria]    = useState({ nombre: "", imagen: null });
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState({ nombre: "", categoria_id: "", imagen: null });
  const [usuario, setUsuario] = useState({ nombre: "", email: "", telefono: "", password: "", rol: "usuario" });

  const [editCat,        setEditCat]        = useState(null);
  const [editSubcat,     setEditSubcat]     = useState(null);
  const [editCatForm,    setEditCatForm]    = useState({ nombre: "", imagen: null });
  const [editSubcatForm, setEditSubcatForm] = useState({ nombre: "", imagen: null });

  // Imagen actual (sincronizada con la DB, se actualiza al eliminar)
  const [editCatImagen,    setEditCatImagen]    = useState(null);
  const [editSubcatImagen, setEditSubcatImagen] = useState(null);

  const [toast,        setToast]        = useState(null);
  const [loading,      setLoading]      = useState({});
  const [busqueda,     setBusqueda]     = useState("");
  const [productoEdit, setProductoEdit] = useState(null);
  const [formErrors,   setFormErrors]   = useState({});

  const [modalProducto,     setModalProducto]     = useState(false);
  const [modalCategoria,    setModalCategoria]    = useState(false);
  const [modalSubcategoria, setModalSubcategoria] = useState(false);
  const [modalUsuario,      setModalUsuario]      = useState(false);
  const [modalEditCat,      setModalEditCat]      = useState(false);
  const [modalEditSubcat,   setModalEditSubcat]   = useState(false);

  const adminNombre = localStorage.getItem("nombre") || "Admin";

  const notify  = (msg, type = "success") => setToast({ msg, type });
  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }));
  const catNombre = (id) => categorias.find(c => c.id === parseInt(id))?.nombre || "—";

  // ── CARGAR DATA ───────────────────────────────────────────────
  const cargarProductos = async () => {
    try {
      setLoad("prods", true);
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch { notify("Error al cargar productos", "error"); }
    finally { setLoad("prods", false); }
  };

  const cargarCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch { notify("Error al cargar categorías", "error"); }
  };

  const cargarSubcategorias = async (categoriaId) => {
    if (!categoriaId) { setSubcategorias([]); return; }
    const res = await api.get(`/subcategorias/${categoriaId}`);
    setSubcategorias(res.data);
  };

  const cargarSubcatsDeCat = async (catId, forzar = false) => {
    if (subcatsPorCategoria[catId] && !forzar) return;
    try {
      setLoadingSubcats(p => ({ ...p, [catId]: true }));
      const res = await api.get(`/subcategorias/${catId}`);
      setSubcatsPorCategoria(p => ({ ...p, [catId]: res.data }));
    } catch { notify("Error al cargar subcategorías", "error"); }
    finally { setLoadingSubcats(p => ({ ...p, [catId]: false })); }
  };

  const cargarMensajes = async () => {
    try {
      setLoad("msgs", true);
      const res = await api.get("/contacto");
      setMensajes(res.data);
    } catch { notify("Error cargando mensajes", "error"); }
    finally { setLoad("msgs", false); }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarMensajes();
  }, []);

  const toggleUnidad = (id) => {
    setForm(p => ({
      ...p,
      unidades: p.unidades.includes(id)
        ? p.unidades.filter(u => u !== id)
        : [...p.unidades, id],
    }));
  };

  const agregarPresentacion = () => {
    setForm(p => ({ ...p, presentaciones: [...p.presentaciones, { nombre: "", precio: "", stock: "" }] }));
  };
  const actualizarPresentacion = (index, campo, valor) => {
    setForm(p => {
      const copia = [...p.presentaciones];
      copia[index] = { ...copia[index], [campo]: valor };
      return { ...p, presentaciones: copia };
    });
  };
  const eliminarPresentacionLocal = (index) => {
    setForm(p => ({ ...p, presentaciones: p.presentaciones.filter((_, i) => i !== index) }));
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      setLoad("usuario", true);
      await api.post("/usuarios", usuario);
      notify("Usuario creado correctamente");
      setUsuario({ nombre: "", email: "", telefono: "", password: "", rol: "usuario" });
      setModalUsuario(false);
    } catch { notify("Error al crear usuario", "error"); }
    finally { setLoad("usuario", false); }
  };

  // ── CATEGORÍAS ────────────────────────────────────────────────
  const crearCategoria = async (e) => {
    e.preventDefault();
    if (!nuevaCategoria.nombre) return notify("El nombre es obligatorio", "error");
    try {
      setLoad("cat", true);
      const data = new FormData();
      data.append("nombre", nuevaCategoria.nombre);
      if (nuevaCategoria.imagen) data.append("imagen", nuevaCategoria.imagen);
      await api.post("/categorias", data, { headers: { "Content-Type": "multipart/form-data" } });
      notify("Categoría creada");
      setNuevaCategoria({ nombre: "", imagen: null });
      setModalCategoria(false);
      cargarCategorias();
    } catch { notify("Error al crear categoría", "error"); }
    finally { setLoad("cat", false); }
  };

  const abrirEditarCategoria = (cat) => {
    setEditCat(cat);
    setEditCatForm({ nombre: cat.nombre, imagen: null });
    setEditCatImagen(cat.imagen);   // imagen actual desde DB
    setModalEditCat(true);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    if (!editCatForm.nombre.trim()) return notify("El nombre es obligatorio", "error");
    try {
      setLoad("editCat", true);
      const data = new FormData();
      data.append("nombre", editCatForm.nombre.trim());
      if (editCatForm.imagen) data.append("imagen", editCatForm.imagen);
      const res = await api.put(`/categorias/${editCat.id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      notify("Categoría actualizada");
      setModalEditCat(false);
      setEditCat(null);
      cargarCategorias();
    } catch { notify("Error al actualizar categoría", "error"); }
    finally { setLoad("editCat", false); }
  };

  // Eliminar solo la imagen de la categoría (pone null en DB)
  const eliminarImagenCategoria = async () => {
    try {
      setLoad("delImgCat", true);
      await api.delete(`/categorias/${editCat.id}/imagen`);
      setEditCatImagen(null);   // actualiza preview local
      notify("Imagen eliminada");
      cargarCategorias();
    } catch { notify("Error al eliminar imagen", "error"); }
    finally { setLoad("delImgCat", false); }
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?\nSe eliminará solo si no tiene productos asociados.")) return;
    try {
      await api.delete(`/categorias/${id}`);
      notify("Categoría eliminada");
      cargarCategorias();
      cargarProductos();
    } catch (err) {
      notify(err?.response?.data?.error || "No se pudo eliminar la categoría", "error");
    }
  };

  // ── SUBCATEGORÍAS ─────────────────────────────────────────────
  const crearSubcategoria = async (e) => {
    e.preventDefault();
    if (!nuevaSubcategoria.nombre || !nuevaSubcategoria.categoria_id) {
      return notify("Nombre y categoría son obligatorios", "error");
    }
    try {
      setLoad("subcat", true);
      const data = new FormData();
      data.append("nombre",       nuevaSubcategoria.nombre);
      data.append("categoria_id", nuevaSubcategoria.categoria_id);
      if (nuevaSubcategoria.imagen) data.append("imagen", nuevaSubcategoria.imagen);
      await api.post("/subcategorias", data, { headers: { "Content-Type": "multipart/form-data" } });
      notify("Subcategoría creada");
      const catId = parseInt(nuevaSubcategoria.categoria_id);
      await cargarSubcatsDeCat(catId, true);
      setNuevaSubcategoria({ nombre: "", categoria_id: "", imagen: null });
      setModalSubcategoria(false);
    } catch { notify("Error al crear subcategoría", "error"); }
    finally { setLoad("subcat", false); }
  };

  const abrirEditarSubcat = (sub, catId) => {
    setEditSubcat({ ...sub, catId });
    setEditSubcatForm({ nombre: sub.nombre, imagen: null });
    setEditSubcatImagen(sub.imagen);   // imagen actual desde DB
    setModalEditSubcat(true);
  };

  const guardarSubcategoria = async (e) => {
    e.preventDefault();
    if (!editSubcatForm.nombre.trim()) return notify("El nombre es obligatorio", "error");
    try {
      setLoad("editSubcat", true);
      const data = new FormData();
      data.append("nombre", editSubcatForm.nombre.trim());
      if (editSubcatForm.imagen) data.append("imagen", editSubcatForm.imagen);
      const res = await api.put(`/subcategorias/${editSubcat.id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      notify("Subcategoría actualizada");
      const catId = editSubcat.catId;
      setSubcatsPorCategoria(p => ({
        ...p,
        [catId]: (p[catId] || []).map(s => s.id === editSubcat.id ? res.data : s),
      }));
      setModalEditSubcat(false);
      setEditSubcat(null);
    } catch { notify("Error al actualizar subcategoría", "error"); }
    finally { setLoad("editSubcat", false); }
  };

  // Eliminar solo la imagen de la subcategoría (pone null en DB)
  const eliminarImagenSubcategoria = async () => {
    try {
      setLoad("delImgSubcat", true);
      const res = await api.delete(`/subcategorias/${editSubcat.id}/imagen`);
      setEditSubcatImagen(null);   // actualiza preview local
      // También actualiza en el listado del panel
      const catId = editSubcat.catId;
      setSubcatsPorCategoria(p => ({
        ...p,
        [catId]: (p[catId] || []).map(s => s.id === editSubcat.id ? res.data : s),
      }));
      notify("Imagen eliminada");
    } catch { notify("Error al eliminar imagen", "error"); }
    finally { setLoad("delImgSubcat", false); }
  };

  const eliminarSubcategoria = async (subId, catId) => {
    if (!window.confirm("¿Eliminar esta subcategoría?")) return;
    try {
      await api.delete(`/subcategorias/${subId}`);
      notify("Subcategoría eliminada");
      setSubcatsPorCategoria(p => ({ ...p, [catId]: p[catId]?.filter(s => s.id !== subId) }));
    } catch { notify("Error al eliminar subcategoría", "error"); }
  };

  const toggleCat = async (catId) => {
    if (catExpandida === catId) { setCatExpandida(null); return; }
    setCatExpandida(catId);
    await cargarSubcatsDeCat(catId);
  };

  // ── PRODUCTOS ─────────────────────────────────────────────────
  const crearProducto = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.nombre)       errs.nombre       = "El nombre es obligatorio";
    if (!form.categoria_id) errs.categoria_id = "Selecciona una categoría";
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});

    const formData = new FormData();
    formData.append("nombre",       form.nombre);
    formData.append("descripcion",  form.descripcion);
    formData.append("categoria_id", form.categoria_id);
    formData.append("descuento",    form.descuento || 0);
    formData.append("stock",        form.stock     || 0);
    formData.append("tiene_precio", form.tiene_precio ? "true" : "false");
    formData.append("destacado",    form.destacado    ? "true" : "false");

    if (form.subcategoria_id) formData.append("subcategoria_id", form.subcategoria_id);
    if (form.aroma.trim()) formData.append("aroma", form.aroma.trim());
    if (form.unidades.length > 0) formData.append("unidades", JSON.stringify(form.unidades));
    if (form.imagen) formData.append("imagen", form.imagen);

    const presentacionesValidas = form.presentaciones.filter(p => p.nombre && p.nombre.trim() !== "");
    formData.append("presentaciones", JSON.stringify(presentacionesValidas));

    try {
      setLoad("prod", true);
      if (productoEdit) {
        await api.put(`/productos/${productoEdit.id}`, formData);
        notify("Producto actualizado");
      } else {
        await api.post("/productos", formData);
        notify("Producto creado");
      }
      setForm(FORM_INICIAL);
      setSubcategorias([]);
      setModalProducto(false);
      setProductoEdit(null);
      cargarProductos();
    } catch { notify("Error al guardar el producto", "error"); }
    finally { setLoad("prod", false); }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      notify("Producto eliminado");
      cargarProductos();
    } catch { notify("Error al eliminar", "error"); }
  };

  const abrirEditar = (p) => {
    setProductoEdit(p);
    setForm({
      nombre:          p.nombre,
      descripcion:     p.descripcion || "",
      imagen:          null,
      categoria_id:    String(p.categoria_id),
      subcategoria_id: p.subcategoria_id ? String(p.subcategoria_id) : "",
      descuento:       p.descuento ?? "",
      stock:           p.stock ?? "",
      tiene_precio:    Boolean(p.tiene_precio),
      aroma:           p.aroma ?? "",
      unidades:        (p.unidades || []).map(u => u.id),
      presentaciones:  (p.presentaciones || []).map(pr => ({
        nombre: pr.nombre,
        precio: pr.precio !== null ? String(pr.precio) : "",
        stock:  String(pr.stock ?? 0),
      })),
      destacado: Boolean(p.destacado),
    });
    cargarSubcategorias(p.categoria_id);
    setFormErrors({});
    setModalProducto(true);
  };

  const prodFiltrados = productos.filter(p => {
    if (!busqueda.trim()) return true;
    const q = busqueda.toLowerCase();
    return p.nombre.toLowerCase().includes(q) || (p.descripcion || "").toLowerCase().includes(q);
  });

  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  return (
    <div className="flex h-screen bg-[#f4f8fb] overflow-hidden">

      {/* ── Sidebar ── */}
      <>
        <AnimatePresence>
          {sideOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-[#0d2952]/40 backdrop-blur-sm md:hidden"
              onClick={() => setSideOpen(false)} />
          )}
        </AnimatePresence>

        <aside className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0d2952]
          transition-all duration-300 ease-out
          ${sideOpen ? "w-60 translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:w-[72px] md:hover:w-60
          group/sidebar overflow-hidden flex-shrink-0
        `}>
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.08] overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#3ec6e0] flex items-center justify-center flex-shrink-0">
              <span className="font-display text-[#0d2952] text-base font-bold">Q</span>
            </div>
            <span className="font-display text-white text-sm whitespace-nowrap opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity duration-200 md:opacity-100"
              style={{ opacity: sideOpen ? 1 : undefined }}>
              Químicos & Soap
            </span>
          </div>

          <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
            {NAV_ITEMS.map(item => {
              const active = seccion === item.id;
              return (
                <button key={item.id}
                  onClick={() => { setSeccion(item.id); setSideOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 overflow-hidden ${
                    active ? "bg-[#3ec6e0] text-[#0d2952]" : "text-white/50 hover:bg-white/[0.07] hover:text-white"
                  }`}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                    style={{ fontFamily: "'DM Sans', sans-serif", opacity: sideOpen ? 1 : undefined }}>
                    {item.label}
                  </span>
                  {active && (
                    <span className="ml-auto flex-shrink-0 opacity-0 md:group-hover/sidebar:opacity-100 transition-opacity"
                      style={{ opacity: sideOpen ? 1 : undefined }}>
                      <ChevronRight size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/[0.08] overflow-hidden">
            <div className="flex items-center gap-3 px-3 py-2 mb-1 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users size={13} className="text-white/60" />
              </div>
              <span className="text-white/50 text-xs truncate whitespace-nowrap"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{adminNombre}</span>
            </div>
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-red-500/15 hover:text-red-400 transition-all overflow-hidden">
              <LogOut size={16} className="flex-shrink-0" />
              <span className="text-sm whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>Cerrar sesión</span>
            </button>
          </div>
        </aside>
      </>

      {/* ── Área principal ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        <header className="flex items-center gap-4 px-5 md:px-8 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0 z-10">
          <button className="md:hidden w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            onClick={() => setSideOpen(true)}>
            <Menu size={17} />
          </button>
          <div>
            <h1 className="font-display text-[#0d2952] text-lg leading-none">
              {NAV_ITEMS.find(n => n.id === seccion)?.label}
            </h1>
            <p className="text-slate-400 text-[11px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Panel Administrativo · Químicos & Soap
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <div className="w-5 h-5 rounded-md bg-[#3ec6e0]/15 flex items-center justify-center">
                <Users size={11} className="text-[#3ec6e0]" />
              </div>
              <span className="text-[#0d2952] text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {adminNombre}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={seccion}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.22 }}>

              {/* ══════════ RESUMEN ══════════ */}
              {seccion === "resumen" && (
                <div>
                  <h2 className="font-display text-[#0d2952] text-2xl md:text-3xl mb-7">Bienvenido, {adminNombre} 👋</h2>
                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { label: "Productos totales",  value: productos.length,  icon: <Package size={20} />, color: "#3ec6e0", bg: "#3ec6e0" },
                      { label: "Categorías activas", value: categorias.length, icon: <Tag     size={20} />, color: "#5abf72", bg: "#5abf72" },
                      { label: "Mensajes recibidos", value: mensajes.length,   icon: <Mail    size={20} />, color: "#0d2952", bg: "#0d2952" },
                    ].map((w, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.09 }}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `${w.bg}18`, color: w.color }}>{w.icon}</div>
                          <span className="font-display text-[#0d2952] text-3xl">{w.value}</span>
                        </div>
                        <p className="text-slate-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{w.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                      <h3 className="font-display text-[#0d2952] text-lg">Últimos productos</h3>
                      <button onClick={() => setSeccion("productos")}
                        className="text-[#3ec6e0] text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Ver todos <ChevronRight size={13} />
                      </button>
                    </div>
                    {loading.prods ? (
                      <div className="flex justify-center py-10"><Loader2 size={22} className="animate-spin text-[#3ec6e0]" /></div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {productos.slice(0, 5).map(p => (
                          <div key={p.id} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50/60 transition-colors">
                            <Img src={p.imagen} alt={p.nombre} className="w-9 h-9 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#0d2952] text-sm truncate">{p.nombre}</p>
                              <p className="text-slate-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {catNombre(p.categoria_id)}
                                {(p.presentaciones || []).length > 0 && (
                                  <span className="ml-2 text-[#3ec6e0]">
                                    · {p.presentaciones.length} presentación{p.presentaciones.length !== 1 ? "es" : ""}
                                  </span>
                                )}
                              </p>
                            </div>
                            {p.destacado ? <span className="bg-yellow-50 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0">⭐</span> : null}
                            {p.descuento > 0 && (
                              <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0">-{p.descuento}%</span>
                            )}
                          </div>
                        ))}
                        {productos.length === 0 && (
                          <p className="text-center text-slate-400 text-sm py-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>No hay productos aún</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ PRODUCTOS ══════════ */}
              {seccion === "productos" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                    <h2 className="font-display text-[#0d2952] text-2xl md:text-3xl">Productos</h2>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                          placeholder="Buscar producto..."
                          className="pl-8 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-[#3ec6e0] focus:ring-2 focus:ring-[#3ec6e0]/15 transition-all w-44"
                          style={{ fontFamily: "'DM Sans', sans-serif" }} />
                      </div>
                      <button onClick={cargarProductos}
                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#0d2952] hover:border-slate-300 transition-all">
                        <RefreshCw size={14} className={loading.prods ? "animate-spin" : ""} />
                      </button>
                      <button onClick={() => { setProductoEdit(null); setForm(FORM_INICIAL); setSubcategorias([]); setFormErrors({}); setModalProducto(true); }}
                        className="flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 hover:shadow-lg transition-all whitespace-nowrap"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <Plus size={15} /> Nuevo producto
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {loading.prods ? (
                      <div className="flex justify-center py-16"><Loader2 size={26} className="animate-spin text-[#3ec6e0]" /></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              {["Producto", "Categoría", "Presentaciones", "Stock", "Descuento", "Destacado", "Acciones"].map(h => (
                                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap"
                                  style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {prodFiltrados.length === 0 ? (
                              <tr><td colSpan={7} className="text-center py-14 text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {busqueda ? `Sin resultados para "${busqueda}"` : "No hay productos creados aún"}
                              </td></tr>
                            ) : prodFiltrados.map((p, i) => (
                              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-3">
                                    <Img src={p.imagen} alt={p.nombre} className="w-9 h-9 rounded-lg flex-shrink-0" />
                                    <div className="min-w-0">
                                      <p className="font-semibold text-[#0d2952] truncate max-w-[160px]">{p.nombre}</p>
                                      <p className="text-slate-400 text-xs truncate max-w-[160px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.descripcion}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-3">
                                  <span className="bg-[#3ec6e0]/10 text-[#0d2952] text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}>{catNombre(p.categoria_id)}</span>
                                </td>
                                <td className="px-5 py-3">
                                  {(p.presentaciones || []).length > 0 ? (
                                    <div>
                                      <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                                        {p.presentaciones.length} variante{p.presentaciones.length !== 1 ? "s" : ""}
                                      </span>
                                      {p.tiene_precio && (
                                        <p className="text-[10px] text-slate-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                          {p.presentaciones.filter(pr => pr.precio != null).map(pr => `$${Number(pr.precio).toLocaleString("es-CO")}`).join(" · ")}
                                        </p>
                                      )}
                                      {!p.tiene_precio && (
                                        <p className="text-[10px] text-slate-400 mt-1 italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>Precio oculto al cliente</p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-300 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>—</span>
                                  )}
                                </td>
                                <td className="px-5 py-3 text-slate-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.stock}</td>
                                <td className="px-5 py-3">
                                  {p.descuento > 0
                                    ? <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full">-{p.descuento}%</span>
                                    : <span className="text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>—</span>}
                                </td>
                                <td className="px-5 py-3">
                                  {p.destacado
                                    ? <span className="bg-yellow-50 text-yellow-600 text-xs font-bold px-2.5 py-1 rounded-full">⭐ Sí</span>
                                    : <span className="text-slate-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>—</span>}
                                </td>
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => abrirEditar(p)} title="Editar"
                                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#3ec6e0]/15 hover:text-[#3ec6e0] text-slate-400 flex items-center justify-center transition-all">
                                      <Edit3 size={13} />
                                    </button>
                                    <button onClick={() => eliminarProducto(p.id)} title="Eliminar"
                                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all">
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  {prodFiltrados.length > 0 && (
                    <p className="text-slate-400 text-xs mt-3 text-right" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {prodFiltrados.length} producto{prodFiltrados.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}

              {/* ══════════ CATEGORÍAS ══════════ */}
              {seccion === "categorias" && (
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <h2 className="font-display text-[#0d2952] text-2xl md:text-3xl">Categorías</h2>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setModalSubcategoria(true)}
                        className="flex items-center gap-2 border border-[#3ec6e0] text-[#0d2952] font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#3ec6e0]/10 transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <Layers size={15} /> Nueva subcategoría
                      </button>
                      <button onClick={() => setModalCategoria(true)}
                        className="flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 hover:shadow-lg transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <Plus size={15} /> Nueva categoría
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {categorias.map((cat, i) => (
                      <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          {/* Imagen o inicial — renderizado condicional limpio */}
                          <CatImg imagen={cat.imagen} nombre={cat.nombre} className="w-14 h-14" textSize="text-xl" />

                          <div className="flex-1 min-w-0">
                            <p className="font-display text-[#0d2952] text-base">{cat.nombre}</p>
                            <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {productos.filter(p => p.categoria_id === cat.id).length} productos
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => toggleCat(cat.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                catExpandida === cat.id ? "bg-[#3ec6e0]/15 text-[#0d2952]" : "bg-slate-100 text-slate-400 hover:text-[#0d2952]"
                              }`}
                              style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              <Layers size={13} />
                              Subcategorías
                              <ChevronDown size={12} className={`transition-transform ${catExpandida === cat.id ? "rotate-180" : ""}`} />
                            </button>
                            <button onClick={() => abrirEditarCategoria(cat)} title="Editar categoría"
                              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#3ec6e0]/15 hover:text-[#3ec6e0] text-slate-400 flex items-center justify-center transition-all">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => eliminarCategoria(cat.id)} title="Eliminar categoría"
                              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <AnimatePresence>
                          {catExpandida === cat.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                              <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/50">
                                {loadingSubcats[cat.id] ? (
                                  <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-[#3ec6e0]" /></div>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between mb-3">
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Subcategorías de {cat.nombre}
                                      </p>
                                      <button onClick={() => { setNuevaSubcategoria({ nombre: "", categoria_id: String(cat.id), imagen: null }); setModalSubcategoria(true); }}
                                        className="flex items-center gap-1 text-xs font-bold text-[#3ec6e0] hover:text-[#0d2952] transition-colors"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        <Plus size={12} /> Agregar
                                      </button>
                                    </div>
                                    {(subcatsPorCategoria[cat.id] || []).length === 0 ? (
                                      <p className="text-slate-400 text-xs text-center py-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Esta categoría no tiene subcategorías
                                      </p>
                                    ) : (
                                      <div className="space-y-2">
                                        {(subcatsPorCategoria[cat.id] || []).map(sub => (
                                          <div key={sub.id}
                                            className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                              {/* Imagen o inicial — renderizado condicional limpio */}
                                              <SubcatImg imagen={sub.imagen} nombre={sub.nombre} />
                                              <p className="text-sm font-semibold text-[#0d2952]">{sub.nombre}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                              <button onClick={() => abrirEditarSubcat(sub, cat.id)} title="Editar"
                                                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-[#3ec6e0]/15 hover:text-[#3ec6e0] text-slate-300 flex items-center justify-center transition-all">
                                                <Edit3 size={12} />
                                              </button>
                                              <button onClick={() => eliminarSubcategoria(sub.id, cat.id)} title="Eliminar"
                                                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-300 flex items-center justify-center transition-all">
                                                <Trash2 size={12} />
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                    {categorias.length === 0 && (
                      <div className="text-center py-16 text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        No hay categorías creadas aún
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════ MENSAJES ══════════ */}
              {seccion === "mensajes" && (
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <h2 className="font-display text-[#0d2952] text-2xl md:text-3xl">Mensajes</h2>
                    <button onClick={cargarMensajes}
                      className="flex items-center gap-2 text-slate-400 text-sm hover:text-[#0d2952] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <RefreshCw size={13} className={loading.msgs ? "animate-spin" : ""} /> Actualizar
                    </button>
                  </div>
                  {loading.msgs ? (
                    <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-[#3ec6e0]" /></div>
                  ) : mensajes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
                      <Mail size={36} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Aún no hay mensajes de contacto</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mensajes.map((m, i) => (
                        <motion.div key={m.id || i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#3ec6e0]/10 flex items-center justify-center flex-shrink-0">
                                <Mail size={15} className="text-[#3ec6e0]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#0d2952] text-sm">{m.nombre}</p>
                                <p className="text-slate-400 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                  {m.email}{m.telefono ? ` · ${m.telefono}` : ""}
                                </p>
                              </div>
                            </div>
                            {(m.created_at || m.createdAt) && (
                              <span className="text-slate-300 text-xs flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {new Date(m.created_at || m.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          {m.mensaje && (
                            <p className="mt-3 text-slate-500 text-sm leading-relaxed pl-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              "{m.mensaje}"
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ══════════ USUARIOS ══════════ */}
              {seccion === "usuarios" && (
                <div>
                  <div className="flex items-center justify-between mb-7">
                    <h2 className="font-display text-[#0d2952] text-2xl md:text-3xl">Usuarios</h2>
                    <button onClick={() => setModalUsuario(true)}
                      className="flex items-center gap-2 bg-[#3ec6e0] text-[#0d2952] font-bold px-5 py-2.5 rounded-xl text-sm hover:scale-105 hover:shadow-lg transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      <Plus size={15} /> Nuevo usuario
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <Users size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Crea accesos administrativos usando el botón de arriba.
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODALES
      ══════════════════════════════════════════════════════════ */}

      {/* Modal: Crear / Editar Producto */}
      <Modal open={modalProducto}
        onClose={() => { setModalProducto(false); setProductoEdit(null); setFormErrors({}); }}
        title={productoEdit ? "Editar producto" : "Nuevo producto"} wide>
        <form onSubmit={crearProducto} className="space-y-5">

          <Field label="Nombre del producto" error={formErrors.nombre}>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Jabón multiusos"
              className={`${inputCls} ${formErrors.nombre ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}`} />
          </Field>

          <Field label="Descripción">
            <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe el producto brevemente..." rows={3} className={`${inputCls} resize-none`} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Descuento (%)">
              <input type="number" min="0" max="100" value={form.descuento}
                onChange={e => setForm({ ...form, descuento: e.target.value })} placeholder="0" className={inputCls} />
            </Field>
            <Field label="Stock disponible">
              <input type="number" min="0" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" className={inputCls} />
            </Field>
          </div>

          <Field label="Categoría" error={formErrors.categoria_id}>
            <div className="relative">
              <select value={form.categoria_id}
                onChange={e => { setForm({ ...form, categoria_id: e.target.value, subcategoria_id: "" }); cargarSubcategorias(e.target.value); }}
                className={`${inputCls} appearance-none ${formErrors.categoria_id ? "border-red-300" : ""}`}>
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>

          {subcategorias.length > 0 && (
            <Field label="Subcategoría (opcional)">
              <div className="relative">
                <select value={form.subcategoria_id} onChange={e => setForm({ ...form, subcategoria_id: e.target.value })}
                  className={`${inputCls} appearance-none`}>
                  <option value="">Sin subcategoría</option>
                  {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>
          )}

          {/* Presentaciones */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Beaker size={13} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0d2952] uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Presentaciones / Variantes
                  </p>
                  <p className="text-[10px] text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Ej: 500ml · 1 Litro · 5 Litros — el precio se define por presentación
                  </p>
                </div>
              </div>
              <button type="button" onClick={agregarPresentacion}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <Plus size={13} /> Agregar
              </button>
            </div>
            <div className="px-4 py-3 space-y-3">
              {form.presentaciones.length === 0 ? (
                <p className="text-center text-slate-400 text-xs py-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Sin presentaciones — el producto se cotizará como unidad genérica.
                </p>
              ) : (
                form.presentaciones.map((pres, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                    className="grid grid-cols-[1fr_120px_90px_32px] gap-2 items-center">
                    <input value={pres.nombre} onChange={e => actualizarPresentacion(idx, "nombre", e.target.value)}
                      placeholder="Ej: 500ml, 1 Litro..." className={`${inputCls} text-xs py-2.5`} />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                      <input type="number" min="0" value={pres.precio}
                        onChange={e => actualizarPresentacion(idx, "precio", e.target.value)}
                        placeholder="Precio" className={`${inputCls} text-xs py-2.5 pl-6`} />
                    </div>
                    <input type="number" min="0" value={pres.stock}
                      onChange={e => actualizarPresentacion(idx, "stock", e.target.value)}
                      placeholder="Stock" className={`${inputCls} text-xs py-2.5`} />
                    <button type="button" onClick={() => eliminarPresentacionLocal(idx)}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-all flex-shrink-0">
                      <X size={13} />
                    </button>
                  </motion.div>
                ))
              )}
              {form.presentaciones.length > 0 && (
                <div className="grid grid-cols-[1fr_120px_90px_32px] gap-2 pt-1">
                  {["Nombre", "Precio (COP)", "Stock", ""].map((h, i) => (
                    <p key={i} className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Field label="Aroma (opcional)" hint="Si el producto no tiene aroma, deja este campo vacío">
            <input value={form.aroma} onChange={e => setForm({ ...form, aroma: e.target.value })}
              placeholder="Ej: Menta, Lavanda, Sin aroma..." className={inputCls} />
          </Field>

          <Toggle checked={form.destacado} onChange={val => setForm({ ...form, destacado: val })}
            label="Producto destacado en el inicio" />

          <Toggle checked={form.tiene_precio}
            onChange={val => setForm({ ...form, tiene_precio: val })}
            label="Mostrar precios de las presentaciones al cliente" />

          <Field label={productoEdit ? "Imagen (vacío = mantener la actual)" : "Imagen del producto"}>
            <label className={`${inputCls} flex items-center gap-3 cursor-pointer hover:border-[#3ec6e0] transition-colors`}>
              <UploadCloud size={16} className="text-slate-400 flex-shrink-0" />
              <span className="text-slate-400 text-sm truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {form.imagen ? form.imagen.name : "Seleccionar imagen..."}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={e => setForm({ ...form, imagen: e.target.files[0] })} />
            </label>
          </Field>

          <div className="flex gap-3 pt-1">
            <button type="button"
              onClick={() => { setModalProducto(false); setProductoEdit(null); setFormErrors({}); }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.prod}>{productoEdit ? "Guardar cambios" : "Crear producto"}</BtnPrimary>
          </div>
        </form>
      </Modal>

      {/* Modal: Nueva Categoría */}
      <Modal open={modalCategoria} onClose={() => setModalCategoria(false)} title="Nueva categoría">
        <form onSubmit={crearCategoria} className="space-y-5">
          <Field label="Nombre de la categoría">
            <input value={nuevaCategoria.nombre}
              onChange={e => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
              placeholder="Ej: Hogar" className={inputCls} required />
          </Field>
          <ImageField label="Imagen de portada (opcional)"
            hint="Si no se selecciona imagen, se mostrará la inicial del nombre"
            value={nuevaCategoria.imagen}
            onChange={img => setNuevaCategoria({ ...nuevaCategoria, imagen: img })} />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalCategoria(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.cat}>Crear categoría</BtnPrimary>
          </div>
        </form>
      </Modal>

      {/* Modal: EDITAR Categoría */}
      <Modal open={modalEditCat} onClose={() => { setModalEditCat(false); setEditCat(null); }} title="Editar categoría">
        <form onSubmit={guardarCategoria} className="space-y-5">
          <Field label="Nombre de la categoría">
            <input value={editCatForm.nombre}
              onChange={e => setEditCatForm({ ...editCatForm, nombre: e.target.value })}
              placeholder="Nombre de la categoría" className={inputCls} required />
          </Field>
          <ImageField label="Nueva imagen (opcional)"
            hint="Deja vacío para mantener la imagen actual"
            value={editCatForm.imagen}
            onChange={img => setEditCatForm({ ...editCatForm, imagen: img })} />
          {/* Preview con botón para eliminar imagen */}
          <ImagePreview
            imagen={editCatImagen}
            onEliminar={eliminarImagenCategoria}
            loadingKey="delImgCat"
            loading={loading}
          />
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => { setModalEditCat(false); setEditCat(null); }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.editCat}>Guardar cambios</BtnPrimary>
          </div>
        </form>
      </Modal>

      {/* Modal: Nueva Subcategoría */}
      <Modal open={modalSubcategoria} onClose={() => setModalSubcategoria(false)} title="Nueva subcategoría">
        <form onSubmit={crearSubcategoria} className="space-y-5">
          <Field label="Categoría padre">
            <div className="relative">
              <select value={nuevaSubcategoria.categoria_id}
                onChange={e => setNuevaSubcategoria({ ...nuevaSubcategoria, categoria_id: e.target.value })}
                className={`${inputCls} appearance-none`} required>
                <option value="">Selecciona una categoría</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Nombre de la subcategoría">
            <input value={nuevaSubcategoria.nombre}
              onChange={e => setNuevaSubcategoria({ ...nuevaSubcategoria, nombre: e.target.value })}
              placeholder="Ej: Limpieza de cocina" className={inputCls} required />
          </Field>
          
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalSubcategoria(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.subcat}>Crear subcategoría</BtnPrimary>
          </div>
        </form>
      </Modal>

      {/* Modal: EDITAR Subcategoría */}
      <Modal open={modalEditSubcat} onClose={() => { setModalEditSubcat(false); setEditSubcat(null); }} title="Editar subcategoría">
        <form onSubmit={guardarSubcategoria} className="space-y-5">
          <Field label="Nombre de la subcategoría">
            <input value={editSubcatForm.nombre}
              onChange={e => setEditSubcatForm({ ...editSubcatForm, nombre: e.target.value })}
              placeholder="Nombre de la subcategoría" className={inputCls} required />
          </Field>
          
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => { setModalEditSubcat(false); setEditSubcat(null); }}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.editSubcat}>Guardar cambios</BtnPrimary>
          </div>
        </form>
      </Modal>

      {/* Modal: Nuevo Usuario */}
      <Modal open={modalUsuario} onClose={() => setModalUsuario(false)} title="Nuevo usuario">
        <form onSubmit={crearUsuario} className="space-y-4">
          <Field label="Nombre completo">
            <input value={usuario.nombre} onChange={e => setUsuario({ ...usuario, nombre: e.target.value })}
              placeholder="Nombre completo" className={inputCls} />
          </Field>
          <Field label="Correo electrónico">
            <input type="email" value={usuario.email} onChange={e => setUsuario({ ...usuario, email: e.target.value })}
              placeholder="correo@ejemplo.com" className={inputCls} />
          </Field>
          <Field label="Teléfono">
            <input value={usuario.telefono} onChange={e => setUsuario({ ...usuario, telefono: e.target.value })}
              placeholder="+57 300 000 0000" className={inputCls} />
          </Field>
          <Field label="Contraseña">
            <input type="password" value={usuario.password} onChange={e => setUsuario({ ...usuario, password: e.target.value })}
              placeholder="Contraseña segura" className={inputCls} />
          </Field>
          <Field label="Rol">
            <div className="relative">
              <select value={usuario.rol} onChange={e => setUsuario({ ...usuario, rol: e.target.value })}
                className={`${inputCls} appearance-none`}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </Field>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setModalUsuario(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Cancelar</button>
            <BtnPrimary loading={loading.usuario}>Crear usuario</BtnPrimary>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
