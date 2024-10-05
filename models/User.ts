import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { Product } from "./Product";

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User {
  @prop({ required: true, type: () => String })
  public name!: string; // Nombre del usuario

  @prop({ required: true, unique: true, type: () => String })
  public email!: string; // Correo electrónico del usuario

  @prop({
    required: function(this: User) {
      // Hacer que la contraseña sea requerida solo si no es un usuario de OAuth
      return !this.isOAuthUser;
    },
    type: () => String,
    // set: (password: string) => hashSync(password, 10), // Encriptar la contraseña si se proporciona
  })
  public password!: string; // Contraseña encriptada (no requerida para OAuth)

  @prop({ type: () => Boolean, default: false })
  public isOAuthUser!: boolean; // Indica si el usuario fue autenticado mediante OAuth

  @prop({ type: () => Boolean, default: false })
  public isAdmin!: boolean; // Rol de administrador (true para admins)

  @prop({ type: () => [Address] })
  public addresses?: Address[]; // Direcciones de envío del usuario

  @prop({ type: () => [String], default: [] })
  public orderHistory?: string[]; // Historial de IDs de órdenes del usuario

  @prop({ ref: () => Product, default: [] })
  public favorites!: Ref<Product>[]; // Historial de IDs de órdenes del usuario
}

// Clase para representar las direcciones de envío
export class Address {
  @prop({ required: true, type: () => String })
  public street!: string;

  @prop({ required: true, type: () => String })
  public city!: string;

  @prop({ required: true, type: () => String })
  public postalCode!: string;

  @prop({ required: true, type: () => String })
  public country!: string;
}

const UserModel = getModelForClass(User);
export default UserModel;
