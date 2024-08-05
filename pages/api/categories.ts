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
          console.log("WORKING");
          
          const categories = await CategoryModel.find()
          console.log(categories);
          return res.status(200).json(categories)
        } catch (error) {
          return res.status(400).json({ error: error });
        }
      case "POST":
        try {
          const category = await CategoryModel.create(
            req.body,
          ); /* create a new model in the database */
          res.status(201).json({ success: true, data: category });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
      default:
        return res.status(400).json({ success: false });
    }
  }
  