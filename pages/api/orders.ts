import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import  OrderModel from "../../models/Order";
// import Category from "../../models/Category";
// import Stock from "../../models/Stock";

// fake data
// import products from '../../utils/data/products';

// export default (req: NextApiRequest, res: NextApiResponse) => {
//   // console.log(req);

//   // fake loading time
//   setTimeout(() => {
//     res.status(200).json(products);
//   }, 800);
// }



export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const orders = await OrderModel.find({})
      
        return res.status(200).json(orders)
      } catch (error) {
        return res.status(400).json({ error: error });
      }
    case "POST":
      try {
        const order = await OrderModel.create(
          req.body,
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
