
import express from "express";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";

import cookieParser from "cookie-parser";
import projectRouter from "./routes/projectRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cookieParser());
app.use(cors());
app.use('/users',userRouter);
app.use('/projects',projectRouter)

app.get("/",(req,res)=>{
    res.send("Hello World");
});




export default app;