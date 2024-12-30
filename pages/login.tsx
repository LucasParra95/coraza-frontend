import Layout from "../layouts/Main";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
//import { useDispatch } from "react-redux";
//import { setUserLogged } from "../store/reducers/user"; // Importar la acción
type FormValues = {
  email: string;
  password: string;
  keepSigned?: boolean;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  //const dispatch = useDispatch();
  //const { data: session, status } = useSession(); // Obtener la sesión

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setErrorMessage(""); // Resetear el mensaje de error
    
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setErrorMessage("Correo o contraseña incorrectos.");
    } else {
      // Redirigir al usuario a la página principal o cualquier otra después de iniciar sesión
      router.push("/account");
    }
  };
  // useEffect(() => {
  //   if (session && status === "authenticated") {
  //     dispatch(setUserLogged( session.user )); // Despachar la sesión a Redux
  //   }
  // }, [session, status, dispatch]);
  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/products">
              <i className="icon-left"></i>Volver a la Tienda
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Iniciar sesión:</h2>

            {errorMessage && (
              <p className="message message--error">{errorMessage}</p>
            )}

            {/* <div className="form__info">
              <p>Ingresar con:</p>
              <div className="signIn__btns">
                <button onClick={() => signIn('facebook')} type="button" className="btn-social fb-btn">
                  <i className="icon-facebook"></i>Facebook
                </button> 
                <button onClick={() => signIn('google')} type="button" className="btn-social google-btn">
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </button>
              </div>
            </div> */}
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="email"
                  type="text"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Ingresa un email válido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="message message--error">{errors.email.message}</p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="password"
                  placeholder="Contraseña"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                />
                {errors.password && (
                  <p className="message message--error">{errors.password.message}</p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label htmlFor="check-signed-in" className={`checkbox checkbox--sm`}>
                    <input
                      type="checkbox"
                      id="check-signed-in"
                      {...register("keepSigned")}
                    />
                    <span className="checkbox__check"></span>
                    <p>Recordarme</p>
                  </label>
                </div>
                <a href="/forgot-password" className="form__info__forgot-password">
                  ¿Olvidaste la contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Ingresar
              </button>

              <p className="form__signup-link">
                ¿No eres miembro? <Link href="/register">Registrarse</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;