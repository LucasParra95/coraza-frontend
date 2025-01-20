

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
  @prop({ type: () => [String] , default: [] })
  public photos!: string[];
  @prop({ ref: () => Category })
  public category!: Ref<Category>;
  @prop({  type: String })
  public subcategory!: string;
  @prop({ ref: () => Stock, type: () => [Stock], default: [] })
  public stock!: Ref<Stock>[];
  @prop({  type: Boolean })
  public enabled!: boolean;
};
const ProductModel = getModelForClass(Product);

export default ProductModel;