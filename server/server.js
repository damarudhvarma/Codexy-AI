import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import app from './app.js'
import conn from "./db/connectDB.js";




const server= http.createServer(app);
const PORT= process.env.PORT || 3000


conn();





server.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
});