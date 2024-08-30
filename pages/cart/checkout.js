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

  const [errors, setErrors] = useState({
    nombre: "Este campo no puede estar vacio",
    apellido: "Este campo no puede estar vacio",
    email: "Este campo no puede estar vacio",
    provincia: "Seleccione una provincia",
    ciudad: "Este campo no puede estar vacio",
    cp: "Este campo no puede estar vacio",
    direccion: "Este campo no puede estar vacio",
    telefono: "Este campo no puede estar vacio"
  });
  const [cities, setCities] = useState([]);
  const [province, setProvince] = useState(undefined);
  const [cp, setCp] = useState(undefined);

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

  const getCities = async(province) => {
    const cities = await fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${province}&aplanar=true&campos=estandar&max=1000&inicio=0&exacto=true`)
      .then(response =>response.json())
      
    return cities.municipios;
  }
  
  const priceTotal = useSelector((state) => {
    const cartItems = state.cart.cartItems;
    let totalPrice = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalPrice += item.price * item.count));
    }

    return totalPrice;
  });

  const weight = useSelector((state) => {
    const cartItems = state.cart.cartItems;
    let totalWeight = 0;
    if (cartItems.length > 0) {
      cartItems.map((item) => (totalWeight += item.count));
    }

    return totalWeight;
  });

  const [dataEnvio, setDataEnvio] = useState();

  
  useEffect(() => {
    if (cp !== undefined&& province !== undefined) {
      const getDataEnvio = async(province, cp) => {
        const url = `https://correo-argentino1.p.rapidapi.com/calcularPrecio?cpOrigen=1900&cpDestino=${cp}&provinciaOrigen=AR-B&provinciaDestino=${province}&peso=${weight}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '6423d1ed28mshd6feb6fa03bfe6ep1ebf9fjsn255ad6f3d75a',
            'x-rapidapi-host': 'correo-argentino1.p.rapidapi.com'
          }
        };
    
        try {
          const response = await fetch(url, options)
            .then(response =>response.json())
            .then(response => setDataEnvio(response.paqarClasico))
        } catch (error) {
          console.error(error);
        } 
      }
      getDataEnvio(province, cp)
      console.log(dataEnvio);
      
    }else{
      setDataEnvio();
    }
  },[cp, province])
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
              {/* <div className="checkout__btns">
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
              </div> */}

              <div className="block">
                <h3 className="block__title">Informacíon de Envío:</h3>
                <form className="form">
                    <div className="form__input-row form__input-row--two">
                      <div className="form__col">
                        <input
                          onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;

                          if (target === "") {
                            setErrors({...errors, nombre: "Este campo no puede estar vacío" })    
                          }else{
                            setErrors({...errors, nombre: "" })
                          }
                        }}
                          className="form__input form__input--sm"
                          type="text"
                          placeholder="Nombre"
                        />
                        <a>{errors.nombre}</a>
                      </div>
  
                      <div className="form__col">
                        <input
                          onChange={(e) => {
                            e.preventDefault()
                            const target = e.target.value;
  
                            if (target === "") {
                              setErrors({...errors, apellido: "Este campo no puede estar vacío" })    
                            }else{
                              setErrors({...errors, apellido: "" })
                            }
                          }}
                          className="form__input form__input--sm"
                          type="text"
                          placeholder="Apellido"
                        />
                        <a>{errors.apellido}</a>  
                      </div>
                    </div>
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;

                          if (target === "") {
                            setErrors({...errors, email: "Este campo no puede estar vacío" })    
                          }else 
                          if (target.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                            setErrors({...errors, email: "" })
                          }else{
                            setErrors({...errors, email: "Ingrese un mail válido" })
                          }
                          
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Email"
                      />
                      <a>{errors.email}</a>
                    </div>

                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select 
                          onChange={async (e)=>{
                            e.preventDefault()
                            const province = e.target.options[e.target.options.selectedIndex]
                            const cities = await getCities(province.text)
                            setProvince(e.target.value)
                            setErrors({...errors, provincia: ""} )
                            setCities(cities)
                          }}
                        >
                          <option>Provincia</option>
                          <option value="AR-B" title="Buenos Aires">Buenos Aires</option>
                          <option value="AR-C" title="Capital Federal">Capital Federal</option>
                          <option value="AR-K" title="Catamarca">Catamarca</option>
                          <option value="AR-H" title="Chaco">Chaco</option>
                          <option value="AR-U" title="Chubut">Chubut</option>
                          <option value="AR-X" title="Córdoba">Córdoba</option>
                          <option value="AR-W" title="Corrientes">Corrientes</option>
                          <option value="AR-E" title="Entre Ríos">Entre Ríos</option>
                          <option value="AR-P" title="Formosa">Formosa</option>
                          <option value="AR-Y" title="Jujuy">Jujuy</option>
                          <option value="AR-L" title="La Pampa">La Pampa</option>
                          <option value="AR-F" title="La Rioja">La Rioja</option>
                          <option value="AR-M" title="Mendoza">Mendoza</option>
                          <option value="AR-N" title="Misiones">Misiones</option>
                          <option value="AR-Q" title="Neuquén">Neuquén</option>
                          <option value="AR-R" title="Río Negro">Río Negro</option>
                          <option value="AR-A" title="Salta">Salta</option>
                          <option value="AR-J" title="San Juan">San Juan</option>
                          <option value="AR-D" title="San Luis">San Luis</option>
                          <option value="AR-Z" title="Santa Cruz">Santa Cruz</option>
                          <option value="AR-S" title="Santa Fe">Santa Fe</option>
                          <option value="AR-G" title="Santiago del Estero">Santiago del Estero</option>
                          <option value="AR-V" title="Tierra del Fuego">Tierra del Fuego</option>
                          <option value="AR-T" title="Tucumán">Tucumán</option>
                        </select>
                      </div>
                      <a>{errors.provincia}</a>
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <div>
                        <input
                        onChange={(e) => {
                          e.preventDefault();
                          const target = e.target.value;

                          if (target === "") {
                            setErrors({...errors, ciudad: "Este campo no puede estar vacío" })    
                          }else 
                          if (target.length > 3) {
                            setErrors({...errors, ciudad: "" })
                          }else{
                            setErrors({...errors, ciudad: "Ingrese un ciudad" })
                          }                          
                        }}
                        list="ciudad"
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Ciudad"/>
                        <datalist 
                          id="ciudad">
                            { 
                              cities?.map((city) => {
                                return (
                                  <option value={city.nombre}/>
                                )
                              })
                            }
                        </datalist>   
                      </div>
                      <a>{errors.ciudad}</a>
                    </div>

                    <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;

                          if (target === "") {
                            setCp(undefined)
                            setErrors({...errors, cp: "Este campo no puede estar vacío" });
                          }else 
                          if (target.match(/^\d{4}$/)) {
                            setCp(target);
                            setErrors({...errors, cp: "" });
                          }else{
                            setCp(undefined)
                            setErrors({...errors, cp: "Ingrese un código postal válido" });
                          }
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Código postal / ZIP"
                      />
                      <a>{errors.cp}</a>
                    </div>
                  </div>

                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;

                          if (target === "") {
                            setErrors({...errors, direccion: "Este campo no puede estar vacío" })    
                          }else 
                          if (target.length > 10) {
                            setErrors({...errors, direccion: "" })
                          }else{
                            setErrors({...errors, direccion: "La dirección es demasiado corta" })
                          }
                          
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Dirección"
                      />
                      <a>{errors.direccion}</a>
                    </div>
                  <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;

                          if (target === "") {
                            setErrors({...errors, telefono: "Este campo no puede estar vacío" })    
                          }else 
                          if (target.match(/^\d{10}$/)) {
                            setErrors({...errors, telefono: "" })
                          }else{
                            setErrors({...errors, telefono: "Ingrese un número telefónico válido" })
                          }
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Número de teléfono"
                      />
                      <a>{errors.telefono}</a>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Tu carrito</h3>
                <CheckoutItems />

              {
                dataEnvio && (
                  <div className="shipping">
                    <h3>Coste de envio: </h3>
                    <h3>${dataEnvio.aSucursal}</h3>
                  </div>
                )
              }
                <div className="checkout-total">
                  <p>Precio total:</p>
                  <h3>${(priceTotal+dataEnvio?.aSucursal).toFixed(2) }</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back">
              <i className="icon-left"></i> Atrás
            </a>
            <div className="cart-actions__items-wrapper">
              <a href="/products" type="button" className="btn btn--rounded btn--border">
                Continuar comprando
              </a>
              <CheckoutMercadoPago dataEnvio={dataEnvio}/>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
