//import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Layout from "../../layouts/Main";
import { useSelector } from "react-redux";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items";
import { RootState } from "store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CheckoutMercadoPago = dynamic(() => import("./../../components/checkout-button/index"), {
  ssr: false,
});


const CheckoutPage = () => {
  const router = useRouter();

  
  const [notification, setNotificacion] = useState({
    isOpen: false,
    type: null,
    content: "",
});
  
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get("status")

  if (status === "approved") {
      setNotificacion({
          content: "Pago aprobado",
          isOpen: true,
          type: "approved"
      });
  } else if (status === "failure") {
      setNotificacion({
          content: "Pago fallido",
          isOpen: true,
          type: "failure"
      })
  }

  setTimeout(() =>{
      setNotificacion({
          isOpen: false,
          type: null,
          content: ""
      });
  }, 5000)
}, [])

  
  const priceTotal = useSelector((state) => {
    const cartItems = state.cart.cartItems;
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  });

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Completar datos de envío:</h3>
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">
              <div className="checkout__btns">
                <button
                  className="btn btn--rounded btn--yellow"
                  onClick={() => router.push("/login")}
                >
                  Ingresar
                </button>
                <button
                  className="btn btn--rounded btn--border"
                  onClick={() => router.push("/register")}
                >
                  Registrarse
                </button>
              </div>

              <div className="block">
                <h3 className="block__title">Informacíon de Envío:</h3>
                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Email"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Dirección"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Nombre"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Ciudad"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Apellido"
                      />
                    </div>

                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Código postal / ZIP"
                      />
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Número de teléfono"
                      />
                    </div>

                    {/* <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select>
                          <option>Country</option>
                          <option value="USA">United States of America</option>
                          <option value="Canada">Canada</option>
                          <option value="Brazil">Brazil</option>
                          <option value="Argentina">Argentina</option>
                          <option value="France">France</option>
                          <option value="Germany">Germany</option>
                          <option value="England">England</option>
                          <option value="England">China</option>
                          <option value="England">Russia</option>
                          <option value="England">Japan</option>
                        </select>
                      </div>
                    </div> */}
                  </div>
                </form>
              </div>
            </div>

            {/* <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment method</h3>
                <ul className="round-options round-options--three">
                  <li className="round-item">
                    <img src="/images/logos/paypal.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/visa.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/mastercard.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/discover.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/ideal-logo.svg" alt="Paypal" />
                  </li>
                </ul>
              </div>

              <div className="block">
                <h3 className="block__title">Delivery method</h3>
                <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/inpost.svg" alt="Paypal" />
                    <p>$20.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dpd.svg" alt="Paypal" />
                    <p>$12.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dhl.svg" alt="Paypal" />
                    <p>$15.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                    <p>$10.00</p>
                  </li>
                </ul>
              </div>
            </div> */}

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Tu carrito</h3>
                <CheckoutItems />

                <div className="checkout-total">
                  <p>Precio total:</p>
                  <h3>${priceTotal.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Back
            </a>
            <div className="cart-actions__items-wrapper">
              <button type="button" className="btn btn--rounded btn--border">
                Continue shopping
              </button>
              {/* <button type="button" className="btn btn--rounded btn--yellow">
                Proceed to payment
              </button> */}
              <CheckoutMercadoPago/>
{/* <Wallet initialization={{ preferenceId: 'prueba' }} customization={{ texts:{ valueProp: 'smart_option'}}} /> */}

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
