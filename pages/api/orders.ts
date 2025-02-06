import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import  OrderModel from "../../models/Order";
import  StockModel from "../../models/Stock";

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
        const { cartItems, userName, userEmail, userAddress, userPhone } = req.body;

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
          return res.status(400).json({ success: false, message: "El carrito está vacío" });
        }

        let totalAmount = 0
        const stockUpdates = []; // Array para almacenar actualizaciones de stock

        // Verificar que todos los productos tengan stock suficiente
        for (const item of cartItems) {
          const stockItem = await StockModel.findById(item.stock);
          if (!stockItem) {
            return res.status(400).json({ success: false, message: `Stock no encontrado para el producto ${item.name}` });
          }
          if (stockItem.quantity < item.count) {
            return res.status(400).json({ success: false, message: `Stock insuficiente para el producto ${item.name}` });
          }
          totalAmount += item.price * item.count;
          stockUpdates.push({
            id: stockItem._id,
            newQuantity: stockItem.quantity - item.count,
          });
        }
        
        for (const update of stockUpdates) {
          await StockModel.findByIdAndUpdate(update.id, { quantity: update.newQuantity });
        }


        const newOrder = await OrderModel.create({
          items: cartItems,
          userName,
          userEmail,
          userPhone,
          totalAmount,
          shippingAddress: userAddress,
        });
        if (newOrder) {

        }

        res.status(201).json({ success: true, data: newOrder });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(405).json({ success: false, message: "Método no permitido" });
      break;
  }
}
