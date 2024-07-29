import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import  ProductModel from "../../models/Product";
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
        const products = await ProductModel.find({})
         .populate('category')
         .populate('stock');
        const productsFormated = products.map( (prod) => {
          
          return {
            id: prod._id,
            name: prod.title,
            price: prod.price.toString(),
            currentPrice: prod.price,
            quantityAvailable: prod.stock,
            description: prod.description,
            category: prod.category,
            sizes: [prod.price],
            colors: [],
            images: prod.photos,
            punctuation: {},
            reviews: [{}],
          }
        } )        
        return res.status(201).json(productsFormated)
      } catch (error) {
        return res.status(400).json({ error: error });
      }
      break;
    // case "POST":
    //   try {
    //     const product = await Product.create(
    //       req.body,
    //     ); /* create a new model in the database */
    //     res.status(201).json({ success: true, data: product });
    //   } catch (error) {
    //     res.status(400).json({ success: false });
    //   }
    //   break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
