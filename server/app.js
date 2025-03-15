
import express from "express";
import morgan from "morgan";
import userRouter from "./routes/userRoutes.js";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(cookieParser());

app.use('/users',userRouter);

app.get("/",(req,res)=>{
    res.send("Hello World");
});




export default app;