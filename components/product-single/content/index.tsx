import { useState, useEffect } from 'react';
//import productsColors from './../../../utils/data/products-colors';
//import productsSizes from './../../../utils/data/products-sizes';
//import CheckboxColor from './../../products-filter/form-builder/checkbox-color';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { some } from 'lodash';
import { addProduct } from 'store/reducers/cart';
import { toggleFavProduct } from 'store/reducers/user';
import { ProductType, ProductStoreType } from 'types';
import { RootState } from 'store';

type ProductContent = {
  product: ProductType;
}

const Content = ({ product }: ProductContent) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [count, setCount] = useState<number>(1);
  //const [color, setColor] = useState<string>('');
  const [itemSize, setItemSize] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [sizeError, setSizeError] = useState<boolean>(false)
  const [quantityError, setQuantityError] = useState<boolean>(false)

  //const onColorSet = (e: string) => setColor(e);
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSizeError(false)
    setItemSize(e.target.value)
  };

  const user = useSelector((state: RootState) => state.user)
  const { favProducts } = useSelector((state: RootState) => state.user);
  const isFavourite = some(favProducts, productId => productId === product.id);
  const id = product._id;

  const productsSizes = product.size.filter(stock => stock.quantity > 0).map(stock => stock.size);

  const handleClose = () => {
    setShowAlert(false)
  }

  const handleFavorites = async() => {
    if( user.user ) {
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
    } else {
      setShowAlert(true)
    }
  }

  const addToCart = () => {
    // Buscar si existe un stock para el tamaño seleccionado
    const matchingSize = product.size?.find((item) => item.size === itemSize);
    console.log("matchingSize", matchingSize);
  
    // Validar si se ha seleccionado un tamaño
    if (!itemSize) {
      setSizeError(true);
      return;
    }
  
    // Validar si el stock existe y si la cantidad es válida
    if (!matchingSize) {
      console.error(`No se encontró stock para el tamaño: ${itemSize}`);
      setQuantityError(true);
      setTimeout(() => setQuantityError(false), 2000);
      return;
    }
  
    // Validar si la cantidad solicitada excede la disponible
    if (count > matchingSize.quantity) {
      console.warn("La cantidad a guardar excede el stock disponible.");
      setQuantityError(true);
      setTimeout(() => setQuantityError(false), 2000);
      return;
    }
  
    // Crear el objeto de producto a guardar en el carrito
    const productToSave: ProductStoreType = {
      id: product.id,
      name: product.name,
      thumb: product.images?.[0] || '',
      price: product.currentPrice,
      count: count,
      stock: matchingSize._id, // Solo se accede si `matchingSize` existe
      size: itemSize,
    };
  
    const productStore = {
      count,
      product: productToSave,
    };
  
    // Agregar el producto al carrito
    dispatch(addProduct(productStore));
  };
  
  useEffect(() => {
    if (product.size?.some((item) => item.size === "Talle único")) {
      setItemSize("Talle único");
    }
  }, [product.size]);
  
  return (
    <section className="product-content">

{showAlert && (
        <div className="overlay">
          <div className="alert-wrapper">
            <div className="alert">
              <h2 className="alert-title">Importante:</h2>
              <p className="alert-description">
                Debes iniciar sesión para guardar tus productos favoritos
              </p>
            </div>
            <div className='btn-container'>
              <button className="close-button" onClick={handleClose}>Cerrar</button>
              <button className='login-button' onClick={()=>router.push("/login")}>Iniciar sesión</button>
            </div>
          </div>
        </div>
      )}

      <div className="product-content__intro">
        {/* <h5 className="product__id">Product ID:<br></br>{product.id}</h5> */}
        {/* <span className="product-on-sale">Sale</span> */}
        <h2 className="product__name">{product.name}</h2>

        <div className="product__prices">
          <h4>${ product.currentPrice }</h4>
          {product.discount &&
            <span>${ product.price }</span>
          }
        </div>
      </div>

      <div className="product-content__filters">
        {/* <div className="product-filter-item">
          <h5>Color:</h5>
          <div className="checkbox-color-wrapper">
            {productsColors.map(type => (
              <CheckboxColor 
                key={type.id} 
                type={'radio'} 
                name="product-color" 
                color={type.color}
                valueName={type.label}
                onChange={onColorSet} 
              />
            ))}
          </div>
        </div> */}
        <div className="product-filter-item">
          {/* <h5>Size: <strong>See size table</strong></h5>
          <div className="checkbox-color-wrapper">
            <div className="select-wrapper">
              <select onChange={onSelectChange}>
                <option>Choose size</option>
                {productsSizes.map(type => (
                  <option value={type.label}>{type.label}</option>
                ))}
              </select>
            </div>
          </div> */}
          {product.size?.some((item) => item.size === "Talle único") ? (
            <div>
              <h5>Talle: <strong>Talle único</strong></h5>
            </div>
          ) : (
            <div>
              <h5>Talle: <strong>Selecciona el talle</strong></h5>
              <div className="checkbox-color-wrapper">
                <div className="select-wrapper">
                  <select defaultValue={"talle"} onChange={onSelectChange}>
                    <option disabled value={"talle"}>Talle</option>
                    {productsSizes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div> 
            </div>
          )}
          {sizeError && (
            <div>
              <a className="message message--error">Debe seleccionar el talle</a>
            </div>
          )}
        </div>
        <div className="product-filter-item">
          <h5>Cantidad:</h5>
          <div className="quantity-buttons">
            <div>
              <div className="quantity-button">
                <button type="button" onClick={() => count > 1 ? setCount(count - 1) : ""} className="quantity-button__btn">
                  -
                </button>
                <span>{count}</span>
                <button type="button" onClick={() => setCount(count + 1)} className="quantity-button__btn">
                  +
                </button>
              </div>
            </div>
            
            <button type="submit" onClick={() => addToCart()} className="btn btn--rounded btn--yellow">Añadir al carrito</button>
            <button type="button" onClick={handleFavorites} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}><i className="icon-heart"></i></button>
          </div>
          {quantityError && (
            <div className='quantity-error'>
              Cantidad no disponible
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
  
export default Content;
    