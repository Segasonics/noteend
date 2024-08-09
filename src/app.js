import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'http://https://66b6667b6801ee5e1c44e25e--harmonious-haupia-5d56d3.netlify.app/:5173', // Replace with the origin of your frontend app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the headers you want to allow
    credentials: true // Allow cookies and authorization headers
}))

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