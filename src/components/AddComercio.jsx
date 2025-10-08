import React, { useState } from 'react';

function AddComercioModal() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cif: '',
    country: '',
    city: '',
    direction: '',
    email: '',
    phone: '',
    category: '',
    password: '',
    image: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComercio = {
      ...formData,
      scoring: [],
      review: []
    };

    try {
      const res = await fetch('https://68e2c16e8e14f4523dabb702.mockapi.io/comercios/comercioList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComercio)
      });

      if (res.ok) {
        setMensaje("Comercio agregado correctamente.");
        setFormData({
          name: '',
          cif: '',
          country: '',
          city: '',
          direction: '',
          email: '',
          phone: '',
          category: '',
          password: '',
          image: '',
        });
        setShowModal(false); // Cierra el modal al agregar
      } else {
        setMensaje("Error al agregar el comercio.");
      }
    } catch (error) {
      setMensaje("Error de conexión con la API.");
    }
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setShowModal(true)}
      >
        Agregar nuevo comercio
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">

            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar Modal"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Agregar Comercio</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="cif" placeholder="CIF" value={formData.cif} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="country" placeholder="País" value={formData.country} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="direction" placeholder="Dirección" value={formData.direction} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-3 py-2 border rounded" />
              <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
              <input name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required type="password" className="w-full px-3 py-2 border rounded" />
              <input name="image" placeholder="URL Imagen" value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border rounded" />

              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Agregar Comercio
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>

            {mensaje && <p className="mt-3 text-center text-green-600">{mensaje}</p>}

          </div>
        </div>
      )}
    </>
  );
}

export default AddComercioModal;
