import connectToDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js"

dotenv.config({path:"./.env"})

connectToDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Mongodb connected to port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("There was an error while connecting",error)
})