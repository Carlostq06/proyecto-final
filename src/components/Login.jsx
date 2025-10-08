import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Validación con Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Formato de correo no válido").required("Correo obligatorio"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setLoginError("");
    try {
      const userData = await loginUser(values.email, values.password);

      // Guardar en Context y localStorage
      login({ ...userData, role: "user" }); // rol usuario

      resetForm();
      navigate("/"); // redirige a Home
    } catch (error) {
      setLoginError(error.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white relative">
      {/* Botón Entrar como anónimo */}
      <button
        onClick={() => navigate("/home2")}
        className="absolute top-6 right-6 bg-green-400 hover:bg-gray-600 text-black font-semibold px-4 py-2 rounded-lg transition-all"
      >
        Entrar como anónimo
      </button>

      <div className="bg-[#1F2937] rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Bienvenido</h1>
          <p className="text-gray-400 mt-2 text-sm">Inicia sesión para continuar</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {loginError && (
                <div className="text-red-400 text-sm text-center mt-2">{loginError}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿No tienes cuenta? <a href="/register" className="text-green-400 hover:underline">Regístrate</a>
        </p>

        <p className="text-center text-gray-400 text-sm mt-4">
          <a href="/comercioLogin" className="text-green-400 hover:underline">
            Iniciar sesión como comercio
          </a>
        </p>
      </div>
    </div>
  );
}
