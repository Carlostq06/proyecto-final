import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />; // Redirige al home en vez de login

  if (roles && !roles.includes(user.rol)) return <Navigate to="/" />; // Redirige al home si rol no coincide

  return children;
}
