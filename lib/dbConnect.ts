import mongoose from "mongoose";
declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be defined");
  }
  
  export default async function dbConnect() {
    try {
      const { connection } = await mongoose.connect(MONGODB_URI);
      if (connection.readyState === 1) {
        console.log("MongoDB Connected");
        return Promise.resolve(true);
      }else{
        return Promise.resolve(false);
      }
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }