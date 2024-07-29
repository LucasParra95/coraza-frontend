type ProductDescriptionType = {
  show: boolean;
  description: string;
}

const Description = ({ show, description }: ProductDescriptionType) => {
  const style = {
    display: show ? 'flex' : 'none',
  }

  return (
    <section style={style} className="product-single__description">
      <div className="product-description-block">
        <i className="icon-cart"></i>
        <h4>Detalles y descripción del producto</h4>
        <p>{description}</p>
      </div>
      {/* <div className="product-description-block">
        <i className="icon-cart"></i>
        <h4>Details and product description</h4>
        <p>White Summer Vibes T-shirt in the uiKit line with a colorful print. <br></br>Made of jersey cotton. T-shirt fits perfectly with jeans, pants or shorts.</p>
      </div> */}
    </section>
  );
};
  
export default Description;
    