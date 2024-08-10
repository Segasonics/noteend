import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN || 8000, // Replace with the origin of your frontend app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the headers you want to allow
    credentials: true // Allow cookies and authorization headers
}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://notepet.netlify.app");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.options("*", cors());

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