import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, MapPin, Calendar } from "lucide-react";
import { registerUser } from "../services/api";

// 🧠 Esquema de validación con Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  edad: Yup.number()
    .min(18, "Debes tener al menos 18 años")
    .required("La edad es obligatoria"),
  city: Yup.string().required("La ciudad es obligatoria"),
  userName: Yup.string()
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
    .required("El nombre de usuario es obligatorio"),
  email: Yup.string()
    .email("Formato de correo no válido")
    .required("El correo electrónico es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  terminos: Yup.boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones"),
});

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      // 🧩 Convertimos los nombres al formato que espera la API
      const userData = {
        name: values.name,
        edad: values.edad,
        city: values.city,
        userName: values.userName,
        email: values.email,
        password: values.password,
        rol: "user", // por defecto
      };

      await registerUser(userData);
      resetForm();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#111827] text-white">
      <div className="bg-[#1F2937] rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Crear cuenta</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Completa los siguientes campos para registrarte
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            edad: "",
            city: "",
            userName: "",
            email: "",
            password: "",
            terminos: false,
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm mb-1">Nombre completo</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {/* Edad */}
              <div>
                <label className="block text-sm mb-1">Edad</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="number"
                    name="edad"
                    placeholder="Tu edad"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="edad" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm mb-1">Ciudad</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="text"
                    name="city"
                    placeholder="Ejemplo: Madrid"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="city" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {/* Usuario */}
              <div>
                <label className="block text-sm mb-1">Nombre de usuario</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="text"
                    name="userName"
                    placeholder="Ejemplo: usuario123"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="userName" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm mb-1">Correo electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full bg-[#111827] border border-gray-600 text-gray-200 rounded-md py-2 pl-9 pr-3 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-400 text-xs mt-1" />
              </div>

              {/* Contraseña */}
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

              {/* Términos */}
              <div className="flex items-center text-sm text-gray-400">
                <label className="flex items-center space-x-2">
                  <Field type="checkbox" name="terminos" className="accent-green-500" />
                  <span>Acepto los términos y condiciones</span>
                </label>
              </div>
              <ErrorMessage name="terminos" component="div" className="text-red-400 text-xs mt-1" />

              {/* Botón */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded-lg transition-all disabled:opacity-70"
              >
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
