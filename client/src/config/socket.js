import { io } from 'socket.io-client';

let socketInstance;

export const initializeSocket = () => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SERVER_URL, {
      auth: {
        token: JSON.parse(localStorage.getItem('Token')),
      },
    
    });

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("WebSocket Connection Error:", error);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  return socketInstance;
};
