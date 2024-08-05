// import mongoose from "mongoose";

// export interface ICategories extends mongoose.Document {
//     title: string;
//     oneSize: boolean;
//     subcategories: string[];
//   }

// const categorySchema = new mongoose.Schema<ICategories>({
//     title: {
//       type: String,
//       required: [true, "El nombre es requerido"]
//     },
//     oneSize: {
//       type: Boolean,
//       required: [true, "Debe indicar si es talle único"]
//     },
//     subcategories: [{
//       type: String
//     }],
// });
  
// export default mongoose.models.Category ||  mongoose.model<ICategories>("Category", categorySchema);

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