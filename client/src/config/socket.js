import { io } from 'socket.io-client';

let socketInstance;

export const initializeSocket = (projectId) => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_SERVER_URL, {
      auth: {
        token: JSON.parse(localStorage.getItem('Token')),
      },
      query: {
        projectId,
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



export const receiveMessage=(eventName,cb)=>{
    socketInstance.on(eventName,cb);
}

export const sendMessage=(eventName,data)=>{
    socketInstance.emit(eventName,data);
}


