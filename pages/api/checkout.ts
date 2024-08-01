import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from "next";
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';


const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MP_TOKEN!, options: { timeout: 5000, idempotencyKey: 'abc' } });
const preference = new Preference(client);  


const URL = "https://0c54-2800-810-5f6-69-3d3c-552a-812-9e0e.ngrok-free.app";

// En "items" se puede usar directamente el producto, a fines de prueba tambien se puede hardcodear y poner valores
// hasta 5 como minimo.


export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const body: PreferenceRequest = {
        items: [
          {
            id: "prueba",
            title: "prueba",
            unit_price: 1000,
            quantity: 1,
          },
        ],
        auto_return: "approved",
        back_urls: {
          success: `${URL}`,
          failure: `${URL}`,
        },
        notification_url: `${URL}/api/notify`,
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
  console.log(response);
  
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json(error)
    } 
  }else{
    return res.json({message: "Method not allowed"})
  }
}