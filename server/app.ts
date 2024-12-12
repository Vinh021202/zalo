require("dotenv").config();

import express, { NextFunction, Request, Response } from "express"
export const app = express();

import cors from "cors"

import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import questionRouter from "./routes/question.route";
// body parser
app.use(express.json({limit:"500mb"}))

const origin = process.env.ORIGIN;

// cookie parser
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:3000', // Cho phép frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
    credentials: true, // Gửi cookie hoặc thông tin xác thực
}));

// routes

app.use("/api/v1",userRouter,orderRouter,courseRouter,notificationRouter,analyticsRouter,layoutRouter,questionRouter);
app.options('*', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(204).send(); // Không có nội dung
});


// socketio
const io = require("socket.io")(8080, {
    cors: {
      origin: "http://localhost:3000", // Địa chỉ front-end
      methods: ["GET", "POST","PUT","DELETE","OPTIONS"],
    },
  });

// testing api
app.get("/KHTT",(req:Request,res:Response,next:NextFunction)=> {
    res.status(200).json({
        success:true,
        mesage:"API is working"
    })
})

app.all("*",(req:Request,res:Response,next:NextFunction)=>{
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404
    next(err);
})

app.use(ErrorMiddleware);