import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({

    origin: process.env.CORS_ORIGIN || "https://notepet.netlify.app", 
   // origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


app.options("*", cors({

    origin: process.env.CORS_ORIGIN || "https://notepet.netlify.app",
    //origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use(express.json({limit:"16kb"}))
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))


app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import noteRouter from "./routes/notes.routes.js"
//Routing
app.use("/api/v1/users",userRouter)
app.use("/api/v1/notes",noteRouter)

export default app