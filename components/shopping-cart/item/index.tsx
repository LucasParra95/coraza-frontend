import { useDispatch } from 'react-redux';
import { removeProduct, setCount } from 'store/reducers/cart';
import { ProductStoreType } from 'types';

const ShoppingCart = ({ thumb, name, id, size, count, available, price }: ProductStoreType) => {
  const dispatch = useDispatch();

  const removeFromCart = () => {
    dispatch(removeProduct(
      { 
        thumb, 
        name, 
        id, 
        available, 
        size, 
        count, 
        price
      }
    ))
  }

  const setProductCount = (count: number) => {
    if(count <= 0) {
      return;
    }

    const payload = {
      product: { 
        thumb, 
        name, 
        id, 
        available, 
        size, 
        count, 
        price
      },
      count,
    }

    dispatch(setCount(payload))
  }

  return (
    <tr>
      <td>
        <div className="cart-product">
          <div className="cart-product__img">
            <img src={thumb} alt="" />
          </div>

          <div className="cart-product__content">
            <h3>{name}</h3>
            <p>#{id}</p>
          </div>
        </div>
      </td>
      {/* <td className="cart-item-before" data-label="Color">{color}</td> */}
      <td className="cart-item-before" data-label="Size">
        <span className='quantity-button'>
          {size}
        </span>
      </td>
      <td>
        <div className="quantity-button">
          <button type="button" onClick={() => setProductCount(count - 1)} className="quantity-button__btn">
            -
          </button>
          <span>{ count }</span>
          <button type="button" onClick={() => setProductCount(count + 1)} className="quantity-button__btn">
            +
          </button>
        </div>
      </td>
      <td>${price}</td>
      <td>{available}</td>
      <td className="cart-item-cancel"><i className="icon-cancel" onClick={() => removeFromCart()}></i></td>
    </tr>
  )
};

  
export default ShoppingCart