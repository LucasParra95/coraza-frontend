import type { Ref } from "@typegoose/typegoose";
import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Product } from "./Product";

@modelOptions({ schemaOptions: { collection: 'orders' } })
export class Order {
  @prop({ required: true, type: () => String })
  public userId!: string;

  @prop({ required: true, type: () => Date, default: Date.now })
  public createdAt!: Date;

  @prop({ required: true, type: () => [OrderItem] })
  public items!: OrderItem[];

  @prop({ required: true, type: () => Number })
  public totalAmount!: number;

  @prop({ required: true, type: () => String, enum: ["pending", "paid", "shipped", "delivered", "cancelled"], default: "pending" })
  public status!: string;

  @prop({ type: () => String })
  public shippingAddress?: string;

  @prop({ type: () => String })
  public paymentMethod?: string;
}

export class OrderItem {
  @prop({ required: true, ref: () => Product })
  public productId!: Ref<Product>;

  @prop({ required: true, type: () => Number })
  public quantity!: number;

}

const OrderModel = getModelForClass(Order);
export default OrderModel;

