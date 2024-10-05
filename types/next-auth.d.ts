import NextAuth from 'next-auth';

// Extendiendo los tipos de User y Session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      addresses?: { street: string; city: string; country: string }[]; // Cambia según la estructura de tus direcciones
      orderHistory?: { orderId: string; total: number; status: string }[]; // Cambia según la estructura de tus órdenes
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    addresses?: { street: string; city: string; country: string }[]; // Define según tu estructura
    orderHistory?: { orderId: string; total: number; status: string }[]; // Define según tu estructura
  }
}
