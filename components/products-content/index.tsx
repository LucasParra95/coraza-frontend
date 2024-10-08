import { useState } from 'react';
import List from './list';

const ProductsContent = () => {
  const [orderProductsOpen, setOrderProductsOpen] = useState(false);
  
  return (
    <section className="products-content">
      <div className="products-content__intro">
        <h2>Todos los productos 
          {/* <span>(133)</span> */}
        </h2>
        <button type="button" onClick={() => setOrderProductsOpen(!orderProductsOpen)} className="products-filter-btn"><i className="icon-filters"></i></button>
        <form className={`products-content__filter ${orderProductsOpen ? 'products-order-open' : ''}`}>
          <div className="products__filter__select">
            <h4>Filtrar por: </h4>
            <div className="select-wrapper">
              <select>
                <option>Popular</option>
              </select>
            </div>
          </div>
          <div className="products__filter__select">
            <h4>Ordenar por: </h4>
            <div className="select-wrapper">
              <select>
                <option>Popular</option>
                <option>Nombre</option>
                <option>Recientes</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <List />
    </section>
  );
};
  
export default ProductsContent
  