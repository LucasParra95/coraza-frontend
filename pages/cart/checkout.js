//import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Layout from "../../layouts/Main";
import { useSelector } from "react-redux";
import CheckoutStatus from "../../components/checkout-status";
import CheckoutItems from "../../components/checkout/items";
import { RootState } from "store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const CheckoutMercadoPago = dynamic(() => import("./../../components/checkout-button/index"), {
  ssr: false,
});


const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [errors, setErrors] = useState({
    nombre: "Este campo no puede estar vacío",
    email: "Este campo no puede estar vacío",
    provincia: "Seleccione una provincia",
    ciudad: "Este campo no puede estar vacío",
    cp: "Este campo no puede estar vacío",
    direccion: "Este campo no puede estar vacío",
    telefono: "Este campo no puede estar vacío",
  });

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [address, setAddress] = useState(session?.user?.addresses[0].street || "");
  const [city, setCity] = useState(session?.user?.addresses[0].city || "");
  const [postalCode, setPostalCode] = useState(session?.user?.addresses[0].postalCode || "");
  const [phoneNumber, setPhoneNumber] = useState("")

  const [cities, setCities] = useState([]);
  const [province, setProvince] = useState(session?.user?.addresses[0].province || "");
  const [provinceCode, setProvinceCode] = useState("");

  const provinceMap = {
    "Buenos Aires": "AR-B",
    "Capital Federal": "AR-C",
    "Catamarca": "AR-K",
    "Chaco": "AR-H",
    "Chubut": "AR-U",
    "Córdoba": "AR-X",
    "Corrientes": "AR-W",
    "Entre Ríos": "AR-E",
    "Formosa": "AR-P",
    "Jujuy": "AR-Y",
    "La Pampa": "AR-L",
    "La Rioja": "AR-F",
    "Mendoza": "AR-M",
    "Misiones": "AR-N",
    "Neuquén": "AR-Q",
    "Río Negro": "AR-R",
    "Salta": "AR-A",
    "San Juan": "AR-J",
    "San Luis": "AR-D",
    "Santa Cruz": "AR-Z",
    "Santa Fe": "AR-S",
    "Santiago del Estero": "AR-G",
    "Tierra del Fuego": "AR-V",
    "Tucumán": "AR-T",
  };

  const [notification, setNotificacion] = useState({
    isOpen: false,
    type: null,
    content: "",
});

  useEffect(() => {
    if (session) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setAddress(session.user.addresses[0].street || "");
      setCity(session.user.addresses[0].city || "");
      setPostalCode(session.user.addresses[0].postalCode || "");

      const provinceName = session.user.addresses[0].province
      setProvince(provinceName || "");
      setProvinceCode(provinceMap[provinceName] || "");

      setErrors((prevErrors) => ({
        ...prevErrors,
        nombre: session.user.name ? "" : "Este campo no puede estar vacío",
        email: session.user.email ? "" : "Este campo no puede estar vacío",
        provincia: session.user.addresses[0].province ? "" : "Este campo no puede estar vacío",
        ciudad: session.user.addresses[0].city ? "" : "Este campo no puede estar vacío",
        cp: session.user.addresses[0].postalCode ? "" : "Este campo no puede estar vacío",
        direccion: session.user.addresses[0].street ? "" : "Este campo no puede estar vacío",
        telefono: session.user.phoneNumber ? "" : "Este campo no puede estar vacío",
      }));
    }
  }, [session]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status) {
      setNotificacion({
        content: status === "approved" ? "Pago aprobado" : "Pago fallido",
        isOpen: true,
        type: status,
      });

      setTimeout(() => {
        setNotificacion({ isOpen: false, type: null, content: "" });
      }, 5000);
    }
  }, []);

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
  const keyCorreo = process.env.NEXT_PUBLIC_CORREO_API_KEY
  
  useEffect(() => {
    if (postalCode !== "" && provinceCode !== "") {
      const getDataEnvio = async(provinceCode, postalCode) => {
        const url = `https://correo-argentino1.p.rapidapi.com/calcularPrecio?cpOrigen=1900&cpDestino=${postalCode}&provinciaOrigen=AR-B&provinciaDestino=${provinceCode}&peso=${weight}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': keyCorreo,
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
      getDataEnvio(provinceCode, postalCode)
      
    }else{
      setDataEnvio();
    }
  },[postalCode, provinceCode])
    
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

            {!session &&
              <div className="checkout__btns">
                <h3>Ingresa para completar tus datos automaticamente:</h3>
                <button
                  className="btn btn--rounded btn--yellow"
                  onClick={() => router.push("/login")}
                >
                  Ingresar
                </button>
              </div>
            }

              <div className="block">
                <h3 className="block__title">Informacíon de Envío:</h3>
                <form className="form">
                    <div className="form__input-row form__input-row--two">
                      <div className="form__col-wd">
                      <input
                        onChange={(e) => {
                          const value = e.target.value;
                          setErrors((prevErrors) => ({ ...prevErrors, nombre: value ? "" : "Este campo no puede estar vacío" }));
                          setName(value);
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Nombre completo"
                        value={name}
                      />
                      {errors.nombre && <a className="error">{errors.nombre}</a>}
                      </div>
                    </div>
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const value = e.target.value;

                          if (value === "") {
                            setErrors({...errors, email: "Este campo no puede estar vacío" })    
                          }else 
                          if (value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                            setErrors({...errors, email: "" })
                          }else{
                            setErrors({...errors, email: "Ingrese un mail válido" })
                          }
                          setEmail(value)
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        placeholder="Email"
                        value={email}
                      />
                      <a>{errors.email}</a>
                    </div>

                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select 
                          onChange={async (e)=>{
                            e.preventDefault()
                            
                            const selectedOption = e.target.options[e.target.selectedIndex];
                            const selectedProvince = selectedOption.title;
                            const selectedProvinceCode = e.target.value;
                            
                            const cities = await getCities(selectedProvince)
                            setProvince(selectedProvince);
                            setProvinceCode(selectedProvinceCode);
                            setErrors((prevErrors) => ({ ...prevErrors, provincia: "" }));
                            setCities(cities);
                          }}
                          value={provinceCode || ""}
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
                          const value = e.target.value;

                          if (value === "") {
                            setErrors({...errors, ciudad: "Este campo no puede estar vacío" })    
                          }else 
                          if (value.length > 3) {
                            setErrors({...errors, ciudad: "" })
                          }else{
                            setErrors({...errors, ciudad: "Ingrese un ciudad" })
                          }   
                          setCity(value)
                        }}
                        list="ciudad"
                        className="form__input form__input--sm"
                        type="text"
                        value={city}
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
                            setPostalCode("")
                            setErrors({...errors, cp: "Este campo no puede estar vacío" });
                          }else 
                          if (target.match(/^\d{4}$/)) {
                            setPostalCode(target);
                            setErrors({...errors, cp: "" });
                          }else{
                            setPostalCode(target)
                            setErrors({...errors, cp: "Ingrese un código postal válido" });
                          }
                        }}
                        className="form__input form__input--sm"
                        type="text"
                        value={postalCode}
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
                        value={address}
                        placeholder="Dirección"
                      />
                      <a>{errors.direccion}</a>
                    </div>
                  <div className="form__col">
                      <input
                        onChange={(e) => {
                          e.preventDefault()
                          const target = e.target.value;
                          setPhoneNumber(target)
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
                        value={phoneNumber}
                      />
                      <a>{errors.telefono}</a>
                    </div>
                  </div>
                </form>
                <p className="block__title">(*Verifica que los datos ingresados sean correctos)</p>
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
                  {dataEnvio ? (
                    <h3>${(priceTotal+dataEnvio?.aSucursal).toFixed(2) }</h3>
                  ):(
                    <h3>Calculando envío...</h3>
                  )}
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
              <CheckoutMercadoPago errors={errors} dataEnvio={dataEnvio} userName={name} userEmail={email} userAddress={`${address}, ${city}, ${province}, ${postalCode}`} userPhone={phoneNumber}/>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
