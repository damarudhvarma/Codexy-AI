import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import app from './app.js'
import conn from "./db/connectDB.js";
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';


const server= http.createServer(app);
const PORT= process.env.PORT || 3000
const io = new Server(server,{
    cors: {
        origin: '*',
    }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error("Authentication Error"));
    }
    const decoded = jwt.verify(token, process.env.CODEXY_SECRET);
    if (!decoded) {
      return next(new Error("Authentication Error: token invalid"));
    }
    socket.user = decoded;
    next();
    
  } catch (error) {
    next(error);
  }
});

io.on('connection', (socket) => {
    console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



conn();


server.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});