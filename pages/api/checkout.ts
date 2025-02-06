import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from "next";
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';

const accessToken = process.env.NEXT_PUBLIC_MP_TOKEN!;
const client = new MercadoPagoConfig({ accessToken: accessToken, options: { idempotencyKey: 'abc' } });
const preference = new Preference(client);  


const URL = "https://mint-eagle-sure.ngrok-free.app";

// En "items" se puede usar directamente el producto, a fines de prueba tambien se puede hardcodear y poner valores
// hasta 5 como minimo.


export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const products = req.body.products;
    
    try {
      const body: PreferenceRequest = {
        items: products.map( (item: any) => {
          if (item.aSucursal) {
            return {
              id: "envio",
              title: "Costo de envío",
              unit_price: item.aSucursal,
              quantity: 1
            }
          }
          return {
            id: item.id,
            title: item.name,
            unit_price: item.price,
            quantity: item.count
          }
        } ) ,
        auto_return: "approved",
        back_urls: {
          success: `${URL}/cart/`,
          failure: `${URL}/cart/`,
        },
        notification_url: `${URL}/api/payments`,
        payment_methods: {
          excluded_payment_types: [
              {
                id: "ticket"
              }
          ],
          installments: 3
        },
      };
  
      const response = await preference.create({body}).catch(console.log);
  
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error)
    } 
  }else{
    return res.json({message: "Method not allowed"})
  }
}