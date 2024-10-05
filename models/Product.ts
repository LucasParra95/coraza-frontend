import mongoose from "mongoose";
// import  CategoryModel from "./Category";
// import { IStocks } from "./Stock";

// export interface IProducts extends mongoose.Document {
//     title: string;
//     price: number;
//     description: string;
//     photos: string[];
//     category: mongoose.Types.ObjectId | typeof CategoryModel;
//     subcategory: string;
//     stock: mongoose.Types.ObjectId | IStocks;
//     enabled: boolean;
//   }

// const productSchema = new mongoose.Schema<IProducts>({
//     title: {
//       type: String,
//       required: [true, "El nombre es requerido"]
//     },
//     price: {
//       type: Number,
//       required: [true, "El precio es requerido"]
//     },
//     description: {
//       type: String,
//       required: [true, "La descrición es requerida"]
//     },
//     photos: [{
//       type: String
//     }],
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Category',
//       required: [true, "Error al asignar la categoría"]
//     },
//     subcategory: {
//       type:String
//     },
//     stock: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Stock',
//       required: [true, "Ha ocurrido un error con el sistema de stock"]
//     },
//     enabled: {
//       type: Boolean,
//       required: true,
//       default: true
//     }
// });
  
// export default mongoose.models.Product ||  mongoose.model<IProducts>("Product", productSchema);

import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { Category } from "./Category";
import { Stock } from "./Stock";

@modelOptions({ schemaOptions: { collection: 'products' } })
export class Product {
  @prop({  type: String })
  public title!: string;
  @prop({  type: Number })
  public price!: number;
  @prop({  type: String })
  public description!: string;
  @prop({ type: () => mongoose.Schema.Types.Mixed , default: [] })
  public photos!: string[];
  @prop({ ref: () => Category })
  public category!: Ref<Category>;
  @prop({  type: String })
  public subcategory!: string;
  @prop({ ref: () => Stock })
  public stock!: Ref<Stock>;
  @prop({  type: Boolean })
  public enabled!: boolean;
};
const ProductModel = getModelForClass(Product);

export default ProductModel;