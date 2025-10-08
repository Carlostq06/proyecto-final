import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { loginComercio } from "../services/api";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginComercioSchema = Yup.object().shape({
  email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

export default function LoginComercio() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError("");
    try {
      const comercio = await loginComercio(values.email, values.password);

      // Guardar en Context y localStorage
      login({ ...comercio, role: "comercio" });

      navigate(`/home2`); // perfil del comercio
    } catch (error) {
      setLoginError(error.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white">
      <div className="bg-[#1F2937] rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Bienvenido</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Inicia sesión como comercio para continuar
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginComercioSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label className="block text-sm mb-1">Correo</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="correo@comercio.com"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              <div>
                <label className="block text-sm mb-1">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
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
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <p className="text-center text-gray-400 text-sm mt-6">
                <Link to="/login" className="text-green-400 hover:underline">
                  Volver
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
