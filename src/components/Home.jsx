import { useEffect, useState } from "react";
import { getComercios } from "../services/api";
import Header from "./Header";

export default function Home() {
  const [comercios, setComercios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchComercios() {
      try {
        const data = await getComercios();
        setComercios(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error al cargar comercios:", error);
      }
    }
    fetchComercios();
  }, []);

  // Filtros, búsqueda y orden
  useEffect(() => {
    let result = [...comercios];

    if (categoria) result = result.filter(c => c.category === categoria);
    if (ciudad) result = result.filter(c => c.city?.toLowerCase().includes(ciudad.toLowerCase()));
    if (minScore) result = result.filter(c => c.scoring >= parseFloat(minScore));
    if (maxScore) result = result.filter(c => c.scoring <= parseFloat(maxScore));
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        c =>
          c.email?.toLowerCase().includes(s) ||
          c.category?.toLowerCase().includes(s) ||
          c.city?.toLowerCase().includes(s)
      );
    }

    // Ordenar
    if (sortOrder === "A-Z") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

    setFiltered(result);
    setCurrentPage(1); // Reset página al filtrar/buscar
  }, [categoria, ciudad, minScore, maxScore, search, sortOrder, comercios]);

  const categorias = ["Todas", ...new Set(comercios.map(c => c.category))];

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#111827] text-white">
      <Header search={search} setSearch={setSearch} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1F2937] p-5 flex flex-col gap-6 border-r border-gray-700 overflow-auto">
          <div className="flex items-center gap-2">
   
    <h2 className="text-[22px] font-bold text-green-400 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
      </svg>
      Filtros
    </h2>

  </div>

          {/* Categoría */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-[#111827] border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat === "Todas" ? "" : cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white">Ciudad</label>
            <input
              type="text"
              placeholder="Ej: Madrid"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full bg-[#111827] border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Scoring mínimo */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white">Scoring mínimo</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="Ej: 3.5"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full bg-[#111827] border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Scoring máximo */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white">Scoring máximo</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="Ej: 4.8"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className="w-full bg-[#111827] border border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col overflow-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Comercios</h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#1F2937] border border-gray-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="A-Z">De la A - Z</option>
              <option value="Z-A">De la Z - A</option>
            </select>
          </div>

          {/* Grid de comercios */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {currentItems.length === 0 ? (
              <p className="text-gray-400 col-span-4 text-center">No se encontraron comercios.</p>
            ) : (
              currentItems.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#1F2937] rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition cursor-pointer"
                  onClick={() => window.location.href = `/comercio/${c.id}`}
                >
                  <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <p className="text-sm text-gray-400">{c.city} — {c.category}</p>
                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="text-green-400 font-semibold">⭐ {c.scoring?.toFixed(1)}</span>
                      <span className="text-gray-400">{c.nscore} reseñas</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer con paginación */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-700 mt-auto">
            <span className="text-gray-400">
              Total de comercios: {comercios.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
