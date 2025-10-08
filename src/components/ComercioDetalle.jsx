import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getComercioById, updateComercio, deleteComercio } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ComercioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [comercio, setComercio] = useState(null);

  const [reviewText, setReviewText] = useState("");
  const [reviewScore, setReviewScore] = useState("");

  const [pubTitle, setPubTitle] = useState("");
  const [pubDesc, setPubDesc] = useState("");
  const [pubImage, setPubImage] = useState("");

  const [editingPubIndex, setEditingPubIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");

  useEffect(() => {
    async function fetchComercio() {
      try {
        const data = await getComercioById(id);
        setComercio(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchComercio();
  }, [id]);

  if (!comercio) return <p className="text-white p-4">Cargando...</p>;

  const isOwner = user?.id === comercio.id;
  const canReview = user && !isOwner;

  const handleAddReview = async () => {
    if (!reviewText || !reviewScore) return;
    const newScore = parseFloat(reviewScore);
    const updatedReviews = [...comercio.reviews, { text: reviewText, score: newScore }];
    const updatedNscore = comercio.nscore + 1;
    const updatedScoring = (comercio.scoring * comercio.nscore + newScore) / updatedNscore;

    const updatedComercio = {
      ...comercio,
      reviews: updatedReviews,
      nscore: updatedNscore,
      scoring: updatedScoring,
    };

    try {
      await updateComercio(id, updatedComercio);
      setComercio(updatedComercio);
      setReviewText("");
      setReviewScore("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPublication = async () => {
    if (!pubTitle || !pubDesc || !pubImage) return;

    const newPublication = {
      title: pubTitle,
      description: pubDesc,
      image: pubImage,
      date: new Date().toISOString().split("T")[0],
    };
    const updatedComercio = {
      ...comercio,
      publications: [...comercio.publications, newPublication],
    };

    try {
      await updateComercio(id, updatedComercio);
      setComercio(updatedComercio);
      setPubTitle("");
      setPubDesc("");
      setPubImage("");
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (index) => {
    const pub = comercio.publications[index];
    setEditingPubIndex(index);
    setEditTitle(pub.title);
    setEditDesc(pub.description);
    setEditImage(pub.image);
  };

  const handleSaveEdit = async () => {
    if (editingPubIndex === null) return;
    const updatedPublications = [...comercio.publications];
    updatedPublications[editingPubIndex] = {
      ...updatedPublications[editingPubIndex],
      title: editTitle,
      description: editDesc,
      image: editImage,
    };
    const updatedComercio = { ...comercio, publications: updatedPublications };
    try {
      await updateComercio(id, updatedComercio);
      setComercio(updatedComercio);
      setEditingPubIndex(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComercio = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar tu comercio? Esta acción es irreversible.")) return;

    try {
      await deleteComercio(comercio.id);
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el comercio ❌");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-white">
      {/* Botón volver y eliminar */}
      <div className="p-4 flex-shrink-0 flex justify-between items-center">
        <Link
          to={-1} // equivalente a navigate(-1)
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
        >
          ← Volver
        </Link>
        {isOwner && (
          <button
            onClick={handleDeleteComercio}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
          >
            Eliminar mi comercio
          </button>
        )}
      </div>

      {/* Contenedor scrollable */}
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Información comercio y reseña */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 bg-[#1F2937] rounded-xl p-6 shadow-lg flex-1 items-center">
            <img
              src={comercio.image}
              alt={comercio.name}
              className="w-32 h-32 object-cover rounded-full border-2 border-green-500"
            />
            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-green-400">{comercio.name}</h1>
              <p className="text-gray-400">Correo: {comercio.email}</p>
              <p className="text-gray-400">Dirección: {comercio.direction}</p>
              <p className="text-gray-400">Categoría: {comercio.category}</p>
              <p className="text-gray-400">N.Contacto: {comercio.nContact}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-green-400 font-semibold">⭐ {comercio.scoring.toFixed(1)}</span>
                <span className="text-gray-400">{comercio.nscore} reseñas</span>
              </div>
            </div>
          </div>

          {canReview && (
            <div className="w-full md:w-80 bg-[#1F2937] rounded-xl p-4 flex flex-col gap-2 shadow-lg flex-shrink-0">
              <h2 className="font-semibold text-lg">Agregar reseña</h2>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Escribe tu reseña"
                className="w-full p-2 rounded bg-[#111827] border border-gray-600 resize-none h-20"
              />
              <h2 className="font-semibold text-lg">Puntuación</h2>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Puntuación"
                value={reviewScore}
                onChange={(e) => setReviewScore(e.target.value)}
                className="w-24 p-2 rounded bg-[#111827] border border-gray-600"
              />
              <button
                onClick={handleAddReview}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 mt-2"
              >
                Enviar reseña
              </button>
            </div>
          )}
        </div>

        {/* Crear publicación */}
        {isOwner && (
          <div className="flex justify-center">
            <div className="bg-[#1F2937] rounded-xl p-4 flex flex-col gap-2 shadow-lg w-full max-w-md">
              <h2 className="font-semibold text-lg">Crear publicación</h2>
              <input
                type="text"
                placeholder="Título"
                value={pubTitle}
                onChange={(e) => setPubTitle(e.target.value)}
                className="w-full p-2 rounded bg-[#111827] border border-gray-600"
              />
              <textarea
                placeholder="Descripción"
                value={pubDesc}
                onChange={(e) => setPubDesc(e.target.value)}
                className="w-full p-2 rounded bg-[#111827] border border-gray-600"
              />
              <input
                type="text"
                placeholder="URL de imagen"
                value={pubImage}
                onChange={(e) => setPubImage(e.target.value)}
                className="w-full p-2 rounded bg-[#111827] border border-gray-600"
              />
              <button
                onClick={handleAddPublication}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 mt-2"
              >
                Publicar
              </button>
            </div>
          </div>
        )}

        {/* Publicaciones */}
        <h2 className="text-xl font-semibold mt-4 mb-2 text-center">Publicaciones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {comercio.publications.map((pub, index) => (
            <div
              key={index}
              className="bg-[#1F2937] rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition p-4 relative"
            >
              <img src={pub.image} alt={pub.title} className="w-full h-40 object-cover rounded" />
              <div className="p-2 space-y-1">
                <h3 className="font-semibold text-white">{pub.title}</h3>
                <p className="text-gray-400 text-sm">{pub.description}</p>
                <span className="text-gray-400 text-xs">{pub.date}</span>
              </div>
              {isOwner && (
                <button
                  onClick={() => openEditModal(index)}
                  className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-xs"
                >
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal editar publicación */}
      {editingPubIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1F2937] p-6 rounded-xl w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Editar publicación</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título"
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Descripción"
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
            <input
              type="text"
              value={editImage}
              onChange={(e) => setEditImage(e.target.value)}
              placeholder="URL de imagen"
              className="w-full p-2 rounded bg-[#111827] border border-gray-600"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingPubIndex(null)}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
