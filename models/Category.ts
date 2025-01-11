import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: 'categories' } })
export class Category {
  @prop({  type: String })
  public title!: string;
  @prop({ type: String })
  public oneSize!: boolean;
  @prop({ type: () => [String] })
  public subcategories: string[];
};
const CategoryModel = getModelForClass(Category);

export default CategoryModel;