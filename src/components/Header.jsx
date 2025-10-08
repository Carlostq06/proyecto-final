import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header({ search, setSearch, setShowAddModal }) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleProfileClick = () => setShowMenu(!showMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileNavigate = () => {
    setShowMenu(false);
    if (user?.role === "comercio") navigate(`/comercio/${user.id}`);
    else navigate("/profile");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-[#1F2937] relative">
      <h1 className="text-3xl font-bold text-green-400 cursor-pointer" onClick={() => navigate("/")}>
        LinkComercs
      </h1>

      <div className="relative w-64">
        <input
          type="text"
          placeholder="Buscar comercio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md pl-3 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Botón admin */}
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
          >
            Añadir Comercio
          </button>
        )}

        {user ? (
          <>
            <div
              onClick={handleProfileClick}
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
            >
              {user.email[0]?.toUpperCase()}
            </div>
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-12 w-40 bg-[#1F2937] border border-gray-600 rounded shadow-lg flex flex-col z-50"
              >
                <button
                  className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                  onClick={handleProfileNavigate}
                >
                  Profile
                </button>
                <button
                  className="px-4 py-2 text-left hover:bg-green-500 hover:text-white"
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                    navigate("/home2");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
            >
              Registrar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
