import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateUser, deleteUser, addComercio, getComercios, deleteComercio } from "../services/api";
import { useNavigate } from "react-router-dom";
export default function UserProfile() {
  const { user, logout, login } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddComercioModal, setShowAddComercioModal] = useState(false);
  const [showDeleteComercioModal, setShowDeleteComercioModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    city: user?.city || "",
    edad: user?.edad || "",
    userName: user?.userName || "",
    password: user?.password || "",
  });

  const [newComercio, setNewComercio] = useState({
    name: "",
    email: "",
    city: "",
    category: "",
    password: "",
    cif: "",
    image: "",
    scoring: 0,
    nscore: 0,
  });

  const [comercios, setComercios] = useState([]);
  const [comercioToDelete, setComercioToDelete] = useState(null);

  const isAdmin = user?.rol === "admin";

  useEffect(() => {
    async function fetchComercios() {
      const data = await getComercios();
      setComercios(data);
    }
    fetchComercios();
  }, []);

  if (!user) return <p className="text-white p-4">Debes iniciar sesión</p>;

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleComercioChange = (e) => setNewComercio(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openEditModal = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      city: user.city || "",
      edad: user.edad || "",
      userName: user.userName || "",
      password: user.password || "",
    });
    setSuccessMessage("");
    setShowEditModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedUser = await updateUser(user.id, formData);
      login({ ...user, ...updatedUser });
      setSuccessMessage("Información actualizada correctamente ✅");
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setSuccessMessage("❌ Error al actualizar la información");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar tu cuenta?")) return;
    setDeleting(true);
    try {
      await deleteUser(user.id);
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la cuenta");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddComercio = async () => {
    if (!newComercio.name || !newComercio.email || !newComercio.city || !newComercio.category) {
      alert("Completa todos los campos obligatorios");
      return;
    }
    try {
      await addComercio(newComercio);
      setShowAddComercioModal(false);
      setNewComercio({ name: "", email: "", city: "", category: "", password:"", cif:"", image:"", scoring:0, nscore:0 });
      const data = await getComercios();
      setComercios(data);
    } catch (err) {
      console.error(err);
      alert("Error al añadir comercio ❌");
    }
  };

  const confirmDeleteComercio = (comercio) => {
    setComercioToDelete(comercio);
    setShowDeleteComercioModal(true);
  };

  const handleDeleteComercio = async () => {
    try {
      await deleteComercio(comercioToDelete.id);
      setComercios(comercios.filter(c => c.id !== comercioToDelete.id));
      setShowDeleteComercioModal(false);
      setComercioToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar comercio ❌");
    }
  };

  return (
    <div className="relative bg-[#111827] min-h-screen text-white flex justify-center items-center p-6">
      {/* Botón Volver */}
      <Link to="/home2" className="absolute top-4 left-4 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
        Volver
      </Link>

      <div className="flex flex-col items-center w-full max-w-lg">
        {/* Info Usuario */}
        <div className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md shadow-lg mb-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Tu información</h2>
          <p><span className="font-semibold">Nombre:</span> {user.name}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Usuario:</span> {user.userName}</p>
          <p><span className="font-semibold">Ciudad:</span> {user.city}</p>
          <p><span className="font-semibold">Edad:</span> {user.edad}</p>
        </div>

        {/* Botones */}
        {isAdmin && (
          <button onClick={() => setShowAddComercioModal(true)} className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 mb-3">Añadir Comercio</button>
        )}
        {!isAdmin && (
          <>
            <button onClick={openEditModal} className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 mb-3">Editar información</button>
            <button onClick={handleDelete} disabled={deleting} className="bg-red-500 px-6 py-2 rounded hover:bg-red-600">{deleting ? "Eliminando..." : "Eliminar cuenta"}</button>
          </>
        )}

        {/* Lista de Comercios para admin */}
        {isAdmin && comercios.length > 0 && (
          <div className="bg-[#1F2937] rounded-xl p-4 w-full max-w-md mt-6 shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-center">Comercios</h3>
            <ul className="space-y-2">
              {comercios.map(c => (
                <li key={c.id} className="flex justify-between items-center bg-[#111827] p-2 rounded">
                  <span>{c.name}</span>
                  <button onClick={() => confirmDeleteComercio(c)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-sm">
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modales */}
      {showEditModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Editar información</h2>
            <div className="flex flex-col gap-3">
              <label>Nombre:</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Usuario:</label>
              <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Ciudad:</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Edad:</label>
              <input type="number" name="edad" value={formData.edad} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Contraseña:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
            </div>
            {successMessage && <p className="text-green-400 mt-3 text-center text-sm">{successMessage}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Cancelar</button>
              <button onClick={handleSave} className={`px-4 py-2 rounded bg-green-500 hover:bg-green-600 ${saving ? "opacity-70" : ""}`} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}

      {showAddComercioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Añadir Comercio</h2>
            <div className="flex flex-col gap-3">
              <label>Nombre:</label>
              <input name="name" value={newComercio.name} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Email:</label>
              <input name="email" value={newComercio.email} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Ciudad:</label>
              <input name="city" value={newComercio.city} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Categoría:</label>
              <input name="category" value={newComercio.category} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Contraseña:</label>
              <input name="password" value={newComercio.password} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>CIF:</label>
              <input name="cif" value={newComercio.cif} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
              <label>Imagen URL:</label>
              <input name="image" value={newComercio.image} onChange={handleComercioChange} className="w-full p-2 rounded bg-[#111827] border border-gray-600" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddComercioModal(false)} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">Cancelar</button>
              <button onClick={handleAddComercio} className="px-4 py-2 rounded bg-green-500 hover:bg-green-600">Añadir</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar eliminar Comercio */}
      {showDeleteComercioModal && (
        <div className="fixed inset-0 bg-[#111827] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1F2937] rounded-xl p-6 w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4 text-white">Eliminar Comercio</h2>
            <p className="mb-4 text-white">
              ¿Seguro que deseas eliminar <span className="font-semibold">{comercioToDelete?.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowDeleteComercioModal(false)} 
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteComercio} 
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
