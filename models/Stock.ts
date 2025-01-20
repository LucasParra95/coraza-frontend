import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'stocks' } })
export class Stock {
  @prop({  required: true, type: () => String, enum: ["XS", "S", "M", "L", "XL", "Talle único"] })
  public size: string;
  @prop({ required: true, type: Number })
  public quantity: number;
};
const StockModel = getModelForClass(Stock);

export default StockModel;