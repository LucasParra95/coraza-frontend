// import mongoose from "mongoose";

// export interface IStocks extends mongoose.Document {
//     unico: number;
//     s: number;
//     m: number;
//     l: number;
//     xl: number;
//   }

// const stockSchema = new mongoose.Schema<IStocks>({
//     unico: {
//         type: Number,
//         default: 0
//     },
//     s: {
//         type: Number,
//         default: 0
//     },
//     m: {
//         type: Number,
//         default: 0
//     },
//     l: {
//         type: Number,
//         default: 0
//     },
//     xl: {
//         type: Number,
//         default: 0
//     }
// });
  
// export default mongoose.models.Stock ||  mongoose.model<IStocks>("Stock", stockSchema);
import { prop, getModelForClass } from "@typegoose/typegoose";
import { assertion, getName } from "@typegoose/typegoose/lib/internal/utils";

export class Stock {
  @prop({  type: Number })
  public unico: number;
  @prop({  type: Number })
  public s: number;
  @prop({  type: Number })
  public m: number;
  @prop({  type: Number })
  public l: number;
  @prop({  type: Number })
  public xl: number;

};
assertion(getName(Stock)=== "Stock")
const StockModel = getModelForClass(Stock);

export default StockModel;