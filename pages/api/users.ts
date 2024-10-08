import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import UserModel from "../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { email } = req.body;
        const users = await UserModel.findOne({email})
          .populate('favorites'); // Obtener usuario por email
        return res.status(200).json(users);
      } catch (error) {
        return res.status(400).json({ error });
      }
    case "POST":
      try {
        const { firstName, lastName, email, password, street, city, postalCode } = req.body;

        // Verifica si ya existe un usuario con el email proporcionado
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ success: false, message: "El usuario ya existe." });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario en la base de datos
        const newUser = await UserModel.create({
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword, // Guardamos la contraseña encriptada
          addresses: [{
            street,
            city,
            postalCode,
            country: "Argentina"
          }]
        });

        return res.status(201).json({ success: true, data: newUser });
      } catch (error) {
        return res.status(500).json({ success: false, message: "Error en el servidor", error });
      }

      case "PUT":        
        try {
          const { userId, firstName, lastName, email, password, addresses, favorites } = req.body;
  
          // Verificar si el usuario existe
          const user = await UserModel.findById(userId)
          if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
          }
  
          // Actualizar los campos del usuario
          if (firstName || lastName) {
            user.name = `${firstName || user.name.split(" ")[0]} ${lastName || user.name.split(" ")[1]}`;
          }
          if (email) {
            user.email = email;
          }
  
          if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
          }
  
          if (addresses) {
            user.addresses = addresses; // Añadir nueva dirección
          }

          if(favorites) {
            user.favorites.includes(favorites) ?
            user.favorites = user.favorites.filter((prod) => prod._id.toString() !== favorites) :
            user.favorites = [...user.favorites, favorites];

          }
  
          // Guardar los cambios en la base de datos
          const updatedUser = await user.save();          
  console.log(updatedUser);
  
          return res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
          return res.status(500).json({ success: false, message: "Error en el servidor", error });
        }
    default:
      return res.status(400).json({ success: false });
  }
}
