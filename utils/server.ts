const dev = process.env.NODE_ENV !== "production";

export const server = dev ? "http://localhost:3000" : "https://coraza-frontend.vercel.app/";
