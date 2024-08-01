import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

export default NextAuth({
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
        }),
        // Passwordless / email sign in
        EmailProvider({
          server: process.env.MAIL_SERVER,
          from: 'NextAuth.js <no-reply@example.com>'
        }),
    ],
    adapter: MongoDBAdapter(clientPromise)
})