import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "../../../lib/dbConnect";
import  ProductModel from "../../../models/Product";

// fake data
//import products from '../../../utils/data/products';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req

  try {
    await dbConnect();

    const product = await ProductModel.findById(pid)
     .populate('category')
     .populate('stock');
    const productsFormated = 
      
      {
        id: product?._id,
        name: product?.title,
        price: product?.price.toString(),
        currentPrice: product?.price,
        quantityAvailable: product?.stock,
        description: product?.description,
        category: product?.category,
        sizes: [product?.price],
        colors: [],
        images: product?.photos ,
        punctuation: {},
        reviews: [{}],
      }    
    return res.status(200).json(productsFormated)
  } catch (error) {
    return res.status(400).json({ error: error });
  }
}
