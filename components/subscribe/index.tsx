const Subscribe = () => {
  return (
    <section className="subscribe">
      <div className="container">
        <div style={{backgroundImage: 'url(/images/subscribe.jpg)'}} className="subscribe__content">
          <h4>Suscribete a nuestro newsletter para recibir todas las novedades</h4>

          <form className="subscribe__form">
            <input id="mail" type="email" placeholder="Dirección de email" />
            <button type="submit" className="btn btn--rounded btn--yellow">Suscribirse</button>
          </form>
        </div>
      </div>
    </section>
  )
};


export default Subscribe