// ProductCard.jsx
// Nota: este componente independiente ya NO es usado por Productos.jsx,
// que tiene su propio ProductCard interno con toda la lógica de Hogar.
// Se mantiene aquí por si se usa en otro contexto (ej: Home.jsx).
// Si no se usa en ningún otro lugar, puedes eliminar este archivo.

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${BASE_URL}${src}`;
}

export default function ProductCard({ product, openModal }) {
  return (
    <div
      className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      onClick={() => openModal && openModal(product)}
    >
      <div className="h-40 bg-slate-100 overflow-hidden">
        <img
          src={resolveImg(product.imagen)}
          alt={product.nombre}
          className="h-full w-full object-cover"
          onError={e => { e.target.style.display = "none"; }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#0d2952]">{product.nombre}</h3>
        {product.descripcion && (
          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{product.descripcion}</p>
        )}
      </div>
    </div>
  );
}
