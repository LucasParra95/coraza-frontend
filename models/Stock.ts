import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'stocks' } })
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
const StockModel = getModelForClass(Stock);

export default StockModel;