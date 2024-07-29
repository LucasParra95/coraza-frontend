"use client";

import React, { useState, useEffect } from 'react';
import { ProductStoreType } from '../../types/index';

interface CartTypes {
  cartItems: ProductStoreType[]
}

const CheckoutMercadoPago = ({ cartItems }: CartTypes) => {
  const [url, setUrl] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

              console.log(data);
              
          setUrl(data!.sandbox_init_point)
              
        } catch (error) {
          console.log(error);    
        }
        setLoading(false);
      };

      generateLink();
  }, [cartItems])

  return (
      <div>
          {
              loading ? (
                  <button className="btn btn--rounded btn--yellow">
                      cargando
                  </button>
              ) : (
                  <>
                      <a href={url!} className="btn btn--rounded btn--yellow">Comprar ahora</a>
                  </>
              )
          }
      </div>
  )
};
export default CheckoutMercadoPago;