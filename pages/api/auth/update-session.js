import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import UserModel from "models/User";

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Obtén datos actualizados desde la base de datos
  const updatedUser = await UserModel.findOne({ email: session.user.email });
  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Actualiza la sesión
  session.user = {
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    favorites: updatedUser.favorites
  };
  res.status(200).json(session);
};
