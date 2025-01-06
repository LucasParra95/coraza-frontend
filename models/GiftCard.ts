import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'giftcards' } })
export class GiftCard {
  @prop({ required: true, unique: true, type: () => String })
  public code!: string;

  @prop({ required: true, type: () => Number })
  public initialValue!: number;

  @prop({ required: true, type: () => Number })
  public remainingValue!: number;

  @prop({ required: true, type: () => Date })
  public expirationDate!: Date;

  @prop({ required: true, type: () => String, enum: ["active", "used", "expired"], default: "active" })
  public status!: string;

  @prop({ required: true, type: () => String })
  public ownerId!: string;

  @prop({ type: () => [Transaction] })
  public transactions?: Transaction[];
}

export class Transaction {
  @prop({ required: true, type: () => Date })
  public date!: Date;

  @prop({ required: true, type: () => Number })
  public amount!: number;

  @prop({ required: true, type: () => String })
  public description!: string;
}

const GiftCardModel = getModelForClass(GiftCard);
export default GiftCardModel;
