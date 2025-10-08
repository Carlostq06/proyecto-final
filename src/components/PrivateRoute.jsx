import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Si roles está definido, verificar que el usuario tenga el rol correcto
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;

  return children;
}
