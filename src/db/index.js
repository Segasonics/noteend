import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB =async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Connected to mongoDB !! DB HOST :${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("There was an error while connection go the DB", error)
        process.exit(1)
    }
}

export default connectToDB