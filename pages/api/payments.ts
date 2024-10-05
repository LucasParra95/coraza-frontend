//import { MercadoPagoConfig } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from "next";

const accessToken = process.env.NEXT_PUBLIC_MP_TOKEN!;
//const client = new MercadoPagoConfig({ accessToken: accessToken, options: { timeout: 5000, idempotencyKey: 'abc' } });
//const payment = new Payment(client);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const paymentId = req.query['data.id'];
    console.log("BODY", req.body);
console.log("id", paymentId);

    try {
        if (paymentId) {   
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                
            }
            //console.log(response);
            
        }else if(req.body.topic === 'merchant_order') {
          const response = await fetch(`${req.body.resource}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
          }
        )
        console.log(response);
        }
        return res.status(200).json({success: true});
    } catch (error) {
      console.error(error);
      return res.status(500).json(error)
    } 
  }else{
    return res.json({message: "Method not allowed"})
  }
}