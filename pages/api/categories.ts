import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import  CategoryModel from "../../models/Category";

export default async function (
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { method } = req;
  
    await dbConnect();
  
    switch (method) {
      case "GET":
        try {
          const categories = await CategoryModel.find()
          return res.status(201).json(categories)
          //return res.status(201).json({msg:"Esto funca Bien"})
        } catch (error) {
          return res.status(400).json({ error: error });
        }
        break;
    //   case "POST":
    //     try {
    //       const product = await Product.create(
    //         req.body,
    //       ); /* create a new model in the database */
    //       res.status(201).json({ success: true, data: product });
    //     } catch (error) {
    //       res.status(400).json({ success: false });
    //     }
    //     break;
      default:
        res.status(400).json({ success: false });
        break;
    }
  }
  