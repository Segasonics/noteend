import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
    'https://harmonious-haupia-5d56d3.netlify.app', // Your main Netlify URL
    'https://66b6667b6801ee5e1c44e25e--harmonious-haupia-5d56d3.netlify.app' // Specific deploy URL
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
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