import mongoose,{Schema} from "mongoose";

const noteSchema = new Schema({
    title:{
        type:String,
        required:[true,"title field is required"],
    },
    image:{
        type:String,
        required:[true,"image field is required"],
    },
    description:{
        type:String,
        required:[true,"description field is required"],
    },
    noteOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Note = mongoose.model("Note",noteSchema)