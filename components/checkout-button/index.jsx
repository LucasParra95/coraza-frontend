"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";


const CheckoutMercadoPago = ({errors,  dataEnvio, userName, userEmail, userAddress, userPhone}) => {
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
              body: JSON.stringify({ products: [...cartItems, dataEnvio] })
          };
          
          const data = await fetch('/api/checkout', requestOptions)
              .then(response => response.json())              
          setUrl(data.sandbox_init_point)
              
        } catch (error) {
          console.log(error);    
        }
        setLoading(false);
      };
      if (dataEnvio) {
        generateLink();
      }
  }, [dataEnvio])

  const handleClick = async () => {
    try {
      const orderData = {
        cartItems, // Array de productos en el carrito
        userName,
        userEmail,
        userAddress,
        userPhone,
      };
  
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la orden");
      }
  
      alert("Orden creada con éxito");
      // Aquí puedes limpiar el carrito o redirigir al usuario
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      alert(error.message);
    }
  }
  
  return (
      <div>
          {
              loading ? (
                  <button className="btn btn--rounded btn--yellow">
                      cargando
                  </button>
              ) : (
                ( errors.nombre === "" & 
                  errors.email === "" &
                  errors.provincia === "" &
                  errors.ciudad === "" &
                  errors.cp === "" &
                  errors.direccion === "" &
                  errors.telefono === "") ? (
                  <>
                      <a 
                      // href={url} 
                      className="btn btn--rounded btn--yellow"
                        onClick={()=>handleClick()}
                      >Pagar ahora</a>
                  </>
                ) : (
                    <>
                      <a className="btn btn--rounded btn--yellow">Ingrese los datos faltantes</a>
                    </>
                )
              )
          }
      </div>
  )
};
export default CheckoutMercadoPago;