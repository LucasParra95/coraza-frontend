//import mercadopago from "mercadopago";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextRequest } from "next/server";
import { NextApiResponse } from "next";

// A fines del tutorial pongo un token de muestra, pero siempre esta información se tiene que manejar
// como variable de entorno en un archivo .env
const client = new MercadoPagoConfig({ accessToken: process.env.NEXT_PUBLIC_MP_TOKEN!, options: { timeout: 5000, idempotencyKey: 'abc' } });
const payment = new Payment(client);  
// mercadopago.configure({
//   access_token: '',
// });

// export async function GET(req: NextRequest) {
//   const searchParams = req.nextUrl.searchParams;
//   const topic = searchParams.get('topic') || searchParams.get('type');

//   console.log({ topic });
//   try {
//     if (topic === "payment") {
//       const paymentId = searchParams.get('id') || searchParams.get('data.id');
//       let paymentData = await payment.get({id:paymentId!});
//       let paymentStatus = paymentData.status;

//       console.log({ payment, paymentStatus });

//       return new Response(JSON.stringify({ payment, paymentStatus }), {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     } else {
//       return new Response(JSON.stringify({ message: "Invalid topic" }), {
//         status: 400,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ message: "Internal Server Error", error: error }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
export default async function (req: NextRequest, res : NextApiResponse) {
  switch (req.method) {
    case "GET":
      
    const searchParams = req.nextUrl.searchParams;
    const topic = searchParams.get('topic') || searchParams.get('type');
  
    console.log({ topic });
    try {
      if (topic === "payment") {
        const paymentId = searchParams.get('id') || searchParams.get('data.id');
        let paymentData = await payment.get({id:paymentId!});
        let paymentStatus = paymentData.status;
  
        console.log("PAYMENT",{ payment, paymentStatus });
  
        // return new Response(JSON.stringify({ payment, paymentStatus }), {
        //   status: 200,
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        return res.status(200).json({payment, paymentStatus})
      } else {
        // return new Response(JSON.stringify({ message: "Invalid topic" }), {
        //   status: 400,
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        return res.status(400).json({message: "Invalid topic"})

      }
    } catch (error) {
      console.error(error);
      // return new Response(JSON.stringify({ message: "Internal Server Error", error: error }), {
      //   status: 500,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      res.status(500).json(error)
    }

      break;
  
    default:
      // return new Response(JSON.stringify({ message: "Method not allowed" }), {
      //   status: 500,
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      console.log(req);
      res.status(200).json({ message: "Method not allowed" })
      break;
  }
}
