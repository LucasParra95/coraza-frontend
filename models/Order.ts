//import type { Ref } from "@typegoose/typegoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
//import { Product } from "./Product";
import type { ProductStoreType } from "../types/index"

@modelOptions({ schemaOptions: { collection: 'orders' } })
export class Order {
  @prop({ type: () => String })
  public userId: string;

  @prop({ required: true, type: () => String })
  public userName!: string;

  @prop({ required: true, type: () => String })
  public userEmail!: string;
  
  @prop({ required: true, type: () => String })
  public userPhone!: string;

  @prop({ required: true, type: () => Date, default: Date.now })
  public createdAt!: Date;

  @prop({ required: true, type: () => [Object] })
  public items!: ProductStoreType[];

  @prop({ required: true, type: () => Number })
  public totalAmount!: number;

  @prop({ required: true, type: () => String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" })
  public status!: string;

  @prop({ required: true, type: () => String })
  public shippingAddress!: string;

  @prop({ type: () => String })
  public paymentMethod?: string;
}



const OrderModel = getModelForClass(Order);
export default OrderModel;

