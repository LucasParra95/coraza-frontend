"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

//import { ProductStoreType } from '../../types/index';



const CheckoutMercadoPago = ({dataEnvio}) => {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cartItems } = useSelector((state) => state.cart);


  useEffect(() => {
      const generateLink = async () => {
          setLoading(true)
        try {
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ products: cartItems })
          };
          
          const data = await fetch('/api/checkout', requestOptions)
              .then(response => response.json())              
          setUrl(data.sandbox_init_point)
              
        } catch (error) {
          console.log(error);    
        }
        setLoading(false);
      };

      generateLink();
  }, [cartItems])

  console.log(dataEnvio);
  

  return (
      <div>
          {
              loading ? (
                  <button className="btn btn--rounded btn--yellow">
                      cargando
                  </button>
              ) : (
                dataEnvio ? (
                  <>
                      <a href={url} className="btn btn--rounded btn--yellow">Pagar ahora</a>
                  </>
                ) : (
                    <>
                      <a className="btn btn--rounded btn--yellow">Ingrese los datos de envío</a>
                    </>
                )
              )
          }
      </div>
  )
};
export default CheckoutMercadoPago;