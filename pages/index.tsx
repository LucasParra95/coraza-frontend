import Layout from "../layouts/Main";
import PageIntro from "../components/page-intro";
import ProductsFeatured from "../components/products-featured";
import InstagramFeed from "../components/instagram-feed";
import Footer from "../components/footer";
import Subscribe from "../components/subscribe";

const IndexPage = () => {
  return (
    <Layout>
      <PageIntro />

      <section className="featured">
        <div className="container">
          <article
            style={{ backgroundImage: "url(/images/featured-1.jpg)" }}
            className="featured-item featured-item-large"
          >
            <div className="featured-item__content">
              <h3>Ya llegaron los nuevos productos</h3>
              <a href="#" className="btn btn--rounded">
                Mostrar Colección
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-2.jpg)" }}
            className="featured-item featured-item-small-first"
          >
            <div className="featured-item__content">
              <h3>Remeras estampadas $3999</h3>
              <a href="#" className="btn btn--rounded">
                Ver más
              </a>
            </div>
          </article>

          <article
            style={{ backgroundImage: "url(/images/featured-3.jpg)" }}
            className="featured-item featured-item-small"
          >
            <div className="featured-item__content">
              <h3>Ofertas de temporada</h3>
              <a href="#" className="btn btn--rounded">
                Ver Todas
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section__intro">
            <h4>¿Porque elegirnos?</h4>
          </header>

          <ul className="shop-data-items">
            <li>
              <i className="icon-shipping"></i>
              <div className="data-item__content">
                <h4>Envíos a todo el país</h4>
                <p>
                  Hacemos envios a toda la Argentina a traves de Correo Argentino
                </p>
              </div>
            </li>

            <li>
              <i className="icon-payment"></i>
              <div className="data-item__content">
                <h4>Compras faciles y seguras</h4>
                <p>
                  Los pagos son procesados a traves de MercadoPago, garantizando la seguridad y transparencia de tus compras
                </p>
              </div>
            </li>

            {/* <li>
              <i className="icon-cash"></i>
              <div className="data-item__content">
                <h4>Money-Back Guarantee</h4>
                <p>
                  If an item arrived damaged or you've changed your mind, you
                  can send it back for a full refund.
                </p>
              </div>
            </li> */}

            <li>
              <i className="icon-materials"></i>
              <div className="data-item__content">
                <h4>La mejor calidad</h4>
                <p>
                  Diseñado para durar, cada uno de nuestros productos ha sido elaborado con
                  los mejores materiales.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <ProductsFeatured />

      <InstagramFeed />
      <Subscribe />
      <Footer />
    </Layout>
  );
};

export default IndexPage;
