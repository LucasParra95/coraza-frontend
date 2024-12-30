import NextAuth from 'next-auth';
import dbConnect from "../../../lib/dbConnect";
//import GoogleProvider from 'next-auth/providers/google';
//import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import UserModel from "../../../models/User";
import bcrypt from "bcryptjs";


export default NextAuth({
    providers: [
        // GoogleProvider({
        // clientId: process.env.GOOGLE_ID,
        // clientSecret: process.env.GOOGLE_SECRET
        // }),
        // Passwordless / email sign in
        // EmailProvider({
        //   server: process.env.MAIL_SERVER,
        //   from: 'NextAuth.js <no-reply@example.com>'
        // }),
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            await dbConnect(); // Conectar a la base de datos
    
            // Buscar el usuario en la base de datos
            const user = await UserModel.findOne({ email: credentials?.email })
              .populate('favorites');
            if (!user) {
              throw new Error("Usuario no encontrado.");
            }
    
            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (!isPasswordValid) {
              throw new Error("Contraseña incorrecta.");
            }
    
            // Si el usuario y la contraseña son correctos, retornar los datos del usuario
            return { id: user._id, name: user.name, email: user.email, addresses: user.addresses, orderHistory: user.orderHistory, favorites: user.favorites };
          },
        }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        // Agrega los datos adicionales del usuario al token
        if (user) {
          token.id = user.id;
          token.addresses = user.addresses; // Agregar direcciones
          token.orderHistory = user.orderHistory; // Agregar historial de órdenes
          token.favorites = user.favorites; // Agregar favoritos
        }
        return token;
      },
      async session({ session, token }) {
        // Pasa los datos adicionales del token a la sesión
        if (token) {
          session.user.id = token.id;
          session.user.addresses = token.addresses; // Agregar direcciones a la sesión
          session.user.orderHistory = token.orderHistory; // Agregar historial de órdenes a la sesión
          session.user.favorites = token.favorites;
        }
        return session;
      },
    },
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt", // Asegura que estás utilizando JWT en las sesiones
    }
})