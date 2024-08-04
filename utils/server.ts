const dev = process.env.NODE_ENV !== "production";

export const server = dev ? "https://mint-eagle-sure.ngrok-free.app/" : "https://coraza-frontend.vercel.app/";
