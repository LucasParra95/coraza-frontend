import Link from 'next/link';
import { some } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavProduct } from 'store/reducers/user';
import { RootState } from 'store';
import { ProductTypeList } from 'types';

const ProductItem = ({ discount, images, id, name, price, currentPrice }: ProductTypeList) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.user)

  const isFavourite = some(favProducts, productId => productId === id);

  const handleFavorites = async() => {
    dispatch(toggleFavProduct({ id }))
    try {
      // Realizar la solicitud PUT para actualizar las direcciones en la base de datos
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.user!.id, // ID del usuario para identificarlo en la base de datos
          favorites: id, // Las direcciones actualizadas
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Actualizar la sesión localmente
        dispatch(toggleFavProduct({ id }))
        console.error("Error actualizando los favoritos:", data);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  return (
    <div className="product-item">
      <div className="product__image">
        <button type="button" onClick={handleFavorites} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button>

        <Link href={`/product/${id}`}>

          <img src={images ? images[0] : ''} alt="product" />
          {discount && 
            <span className="product__discount">{discount}%</span>
          }

        </Link>
      </div>
      
      <div className="product__description">
        <h3>{name}</h3>
        <div className={"product__price " + (discount ? 'product__price--discount' : '')} >
          <h4>${ currentPrice }</h4>

          {discount &&  
            <span>${ price }</span>
          }
        </div>
      </div>
    </div>
  );
};


export default ProductItem