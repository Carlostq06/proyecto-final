const API_URL = 'https://68dc054e7cd1948060a93310.mockapi.io/users/users';
const COMERCIO_API_URL = "https://68dc054e7cd1948060a93310.mockapi.io/users/comercio";

// 🔐 Función para iniciar sesión de usuario
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los usuarios');

    const users = await response.json();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) throw new Error('Correo o contraseña incorrectos');

    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    throw error;
  }
};

// Registrar usuario
export async function registerUser(userData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Error al registrar usuario');
    return await response.json();
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
}
// Eliminar comercio
export async function deleteComercio(id) {
  try {
    const res = await fetch(`${COMERCIO_API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar comercio");
    return await res.json();
  } catch (err) {
    console.error("❌ Error en deleteComercio:", err);
    throw err;
  }
}

// Obtener todos los comercios
export async function getComercios() {
  try {
    const response = await fetch(COMERCIO_API_URL);
    if (!response.ok) throw new Error("Error al obtener los comercios");
    return await response.json();
  } catch (error) {
    console.error("Error en getComercios:", error);
    throw error;
  }
}

// Obtener comercio por ID
export async function getComercioById(id) {
  const res = await fetch(`${COMERCIO_API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener el comercio");
  return await res.json();
}

// Añadir comercio nuevo
export async function addComercio(comercio) {
  try {
    const res = await fetch(COMERCIO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comercio),
    });
    if (!res.ok) throw new Error("Error al añadir comercio");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Actualizar comercio
export async function updateComercio(id, data) {
  const res = await fetch(`${COMERCIO_API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

// Login de comercio
export async function loginComercio(email, password) {
  try {
    const response = await fetch(COMERCIO_API_URL);
    if (!response.ok) throw new Error("Error al obtener comercios");

    const comercios = await response.json();
    const comercio = comercios.find(c => c.email === email && c.password === password);

    if (!comercio) throw new Error("Correo o contraseña incorrectos");

    return comercio;
  } catch (error) {
    console.error("❌ Error en loginComercio:", error);
    throw error;
  }
}

// Usuario por ID
export async function getUserById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error al obtener usuario");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Actualizar usuario
export async function updateUser(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Eliminar usuario
export async function deleteUser(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar usuario");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export { API_URL, COMERCIO_API_URL };
