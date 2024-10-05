import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layouts/Main";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Manejar el cambio en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() }); // Eliminar espacios en blanco
  };

  // Validar los campos (por ejemplo, que no estén vacíos y el email sea válido)
  const validateForm = () => {
    const { firstName, lastName, email, password, street, city, postalCode } = formData;

    // Verificar que los campos no estén vacíos
    if (!firstName || !lastName || !email || !password || !street || !city || !postalCode) {
      setErrorMessage("Todos los campos son obligatorios.");
      return false;
    }

    // Validar que el email tenga un formato correcto
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("El formato del correo electrónico es inválido.");
      return false;
    }
    
    // Validar que el codigo postal tenga un formato correcto
    const postalCodePattern = /^\d{4}$/;
    if(!postalCodePattern.test(postalCode)) {
      setErrorMessage("El código postal deben ser 4 números.");
      return false;
    }

    // Validación exitosa
    setErrorMessage("");
    return true;
  };

  // Validar y enviar los datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar que el formulario recargue la página

    // Validar el formulario
    if (!validateForm()) {
      return;
    }

    try {
      // Petición al backend
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Registro exitoso. Redirigiendo...");
        setErrorMessage("");
        // Aquí puedes redirigir al usuario o limpiar el formulario
        setTimeout(()=> {
          router.push("/login")}, 3000);
      } else {
        setErrorMessage(data.message || "Error al registrar.");
      }
    } catch (error) {
      setErrorMessage("Hubo un problema con el servidor.");
    }
  };
return (
  <Layout>
    <section className="form-page">
      <div className="container">
        <div className="back-button-section">
          <Link href="/products">
            <i className="icon-left"></i>Volver a la tienda
          </Link>
        </div>

        <div className="form-block">
          <h2 className="form-block__title">
            Crea una cuenta
          </h2>
          <p className="form-block__description">
            Regístrate en nuestra tienda de para acceder a descuentos exclusivos, recibir novedades
            de nuestras colecciones antes que nadie y agilizar 
            tu proceso de compra.<br/> 
            Además, podrás seguir tus pedidos y revisar tu historial de compras fácilmente. <br/>
            ¡Únete y disfruta de una mejor experiencia de compra!
          </p>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <form className="form" onSubmit={(e)=>handleSubmit(e)}>
            <div className="form__input-row">
              <input
                className="form__input"
                placeholder="Nombre"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={(e)=>{handleInputChange(e)}}
              />
            </div>

            <div className="form__input-row">
              <input
                className="form__input"
                placeholder="Apellido"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={(e)=>{handleInputChange(e)}}
              />
            </div>

            <div className="form__input-row">
              <input
                className="form__input" 
                placeholder="Email"
                type="text"
                name="email"
                value={formData.email}
                onChange={(e)=>{handleInputChange(e)}}
              />
            </div>

            <div className="form__input-row">
              <input
                className="form__input"
                type="Password"
                placeholder="Contraseña"
                name="password"
                value={formData.password}
                onChange={(e)=>{handleInputChange(e)}}
              />
            </div>

            <div className="form__input-row">
              <input
                className="form__input form__input--sm" 
                placeholder="Dirección"
                type="text"
                name="street"
                value={formData.street}
                onChange={(e)=>{handleInputChange(e)}}
              />
            </div>
            <div className="form__input-row form__input-row--two">
              <div className="form__col">
                <input
                  className="form__input form__input--sm" 
                  placeholder="Ciudad"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e)=>{handleInputChange(e)}}
                />
              </div>
              <div className="form__col">
                <input
                  className="form__input form__input--sm" 
                  placeholder="Código Postal"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e)=>{handleInputChange(e)}}
                />
              </div>
            </div>
            <div className="form__input-row">
            </div>

            {/* <div className="form__info">
              <div className="checkbox-wrapper">
                <label
                  htmlFor="check-signed-in"
                  className={`checkbox checkbox--sm`}
                >
                  <input
                    name="signed-in"
                    type="checkbox"
                    id="check-signed-in"
                  />
                  <span className="checkbox__check"></span>
                  <p>
                    Acepto
                  </p>
                </label>
              </div>
            </div> */}

            <button
              type="submit"
              className="btn btn--rounded btn--yellow btn-submit"
            >
              Registrarse
            </button>

            <p className="form__signup-link">
              <Link href="/login">¿Ya eres miembro?</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  </Layout>
)
}

export default RegisterPage;
