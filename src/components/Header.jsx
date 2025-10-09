import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ search, setSearch, setShowAddModal }) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleProfileClick = () => setShowMenu(!showMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileNavigate = () => {
    setShowMenu(false);
    setMobileMenuOpen(false);
    if (user?.role === "comercio") navigate(`/comercio/${user.id}`);
    else navigate("/profile");
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-700 bg-[#1F2937] relative">
      {/* Logo */}
      <Link to="/" className="text-2xl md:text-3xl font-bold text-green-400 cursor-pointer">
        LinkComercs
      </Link>

      {/* Barra de búsqueda para desktop */}
      <div className="hidden md:block relative w-64">
        <input
          type="text"
          placeholder="Buscar comercio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md pl-3 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Botón hamburguesa y menú móvil */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Botón búsqueda móvil */}
        <button
          className="md:hidden text-white px-2 py-1 border border-gray-600 rounded"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          🔍
        </button>

        {/* Botón admin para desktop */}
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="hidden md:inline-block bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
          >
            Añadir Comercio
          </button>
        )}

        {/* Perfil o Login/Register */}
        {user ? (
          <>
            <div
              onClick={handleProfileClick}
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            >
              {user.email[0]?.toUpperCase()}
            </div>

            {/* Menú usuario desktop */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-4 md:right-6 mt-12 w-40 bg-[#1F2937] border border-gray-600 rounded shadow-lg flex flex-col z-50"
              >
                <button
                  className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                  onClick={handleProfileNavigate}
                >
                  Perfil
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="hidden md:flex gap-2">
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
            >
              Registrar
            </Link>
          </div>
        )}

        {/* Botón menú móvil */}
        <button
          className="md:hidden text-white px-2 py-1 border border-gray-600 rounded"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú y búsqueda móvil */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 right-0 bg-[#1F2937] border-t border-gray-600 flex flex-col p-4 z-50 md:hidden"
        >
          {user && (
            <>
              <button
                className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                onClick={handleProfileNavigate}
              >
                Perfil
              </button>
              <button
                className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
              >
                Registrar
              </Link>
            </>
          )}
        </div>
      )}

      {mobileSearchOpen && (
        <div className="absolute top-full left-0 right-0 p-4 bg-[#1F2937] border-t border-gray-600 md:hidden z-50">
          <input
            type="text"
            placeholder="Buscar comercio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md pl-3 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}
    </header>
  );
}
