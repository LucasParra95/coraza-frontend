import LayoutError from "../layouts/404";

const ErrorPage = () => (
  <LayoutError>
    <section className="error-page">
      <div className="container">
        <h1>Error 404</h1>
        <p>Oops. Parece que esta página no existe</p>
        <a href="/" className="btn btn--rounded btn--yellow">
          Volver al inicio
        </a>
      </div>
    </section>
  </LayoutError>
);

export default ErrorPage;
