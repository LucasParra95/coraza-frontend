import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import GiftCardModel from "../../models/GiftCard";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { ownerId } = req.query;
        if (!ownerId) {
          return res.status(400).json({ success: false, error: "ownerId is required" });
        }
        const giftCards = await GiftCardModel.find({ ownerId });
        if (!giftCards || giftCards.length === 0) {
          return res.status(404).json({ success: false, error: "No GiftCards found for the given ownerId" });
        }
        return res.status(200).json(giftCards);
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    case "POST":
      try {
        const giftCard = await GiftCardModel.create(req.body);
        return res.status(201).json({ success: true, data: giftCard });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    case "PUT":
      try {
        const { ownerId, code } = req.query;
        if (!ownerId || !code) {
          return res.status(400).json({ success: false, error: "ownerId and code are required" });
        }
        const giftCard = await GiftCardModel.findOneAndUpdate({ ownerId, code }, req.body, {
          new: true,
          runValidators: true,
        });
        if (!giftCard) {
          return res.status(404).json({ success: false, error: "GiftCard not found" });
        }
        return res.status(200).json({ success: true, data: giftCard });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    case "DELETE":
      try {
        const { ownerId, code } = req.query;
        if (!ownerId || !code) {
          return res.status(400).json({ success: false, error: "ownerId and code are required" });
        }
        const deletedGiftCard = await GiftCardModel.findOneAndDelete({ ownerId, code });
        if (!deletedGiftCard) {
          return res.status(404).json({ success: false, error: "GiftCard not found" });
        }
        return res.status(200).json({ success: true, data: deletedGiftCard });
      } catch (error) {
        return res.status(400).json({ success: false, error });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
  }
}
