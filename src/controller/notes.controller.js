import { ApiError } from "../utils/ApiError.js";
import { requestHandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Note } from "../model/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//createnote
const createNote=requestHandler(async(req,res)=>{
    const {title,description}=req.body;

    if([title,description].some((field)=>field?.trim()==="")){
       throw new ApiError(400," All fields are required")
    }
    const imageLocalePath = req.file?.path
    if(!imageLocalePath){
        throw new ApiError(401,"Image is required")
    }
    console.log("imagelocalpath",imageLocalePath)
    const image = await uploadOnCloudinary(imageLocalePath);

    if(!image){
        throw new ApiError(400,"Image file is required")
    }
    console.log(image)
    const newNote= await Note.create({
        title,
        description,
        image:image?.url,
        noteOwner:req.user._id

    })

    const note = await Note.findById(newNote._id)

    res.status(201)
    .json( new ApiResponse(200,note,"note is create successfully"))
})

//updatenote
const updateNote=requestHandler(async(req,res)=>{
    const{title,description}=req.body;
    const noteId=req.params._id
    if(!title && !description){
        throw new ApiError(400,"All fields are required")
    }

    const newNote={}
    if(title){newNote.title = title}
    if(description){newNote.description = description}

    let note=await Note.findById(noteId)

    if(!note){
        throw new ApiError(400,"Note cannot be found")
    }

// field to ensure that the current user (identified by req.user.id) is the owner of the note.
      if(note.noteOwner?.toString() !== req.user._id.toString()){
          throw new ApiError(401,"You dont have the permission to edit this note")
      }
    
     const updatedNote = await Note.findByIdAndUpdate(req.params._id,
        {
            $set:
                newNote
            
        },
        {
            new:true
        }
    )
    
   console.log("noteOwner",note.noteOwner)
    return res.status(200)
    .json(new ApiResponse(200,updatedNote,"Note updated successfully"))
})


//deletenote
const deleteNote=requestHandler(async(req,res)=>{
  let note = await Note.findById(req.params._id)
  if(!note){
    throw new ApiError(400,"note not found")
  }
  
  note = await Note.findByIdAndDelete(req.params._id);

   if(note.noteOwner?.toString() !== req.user._id.toString()){
     throw new ApiError(401,"You dont have the permission to delete this note")
 }
console.log(note.noteOwner,req.user._id)
  return res.status(200)
  .json(200,"Note deleted successfully")
})

//fetchallnotes
const fetchAllNotes=requestHandler(async(req,res)=>{
    console.log("request received")
    const notes=await Note.find({noteOwner:req.user._id});

    if(!notes || notes.length===0){
        throw new ApiError(400,"Note not found")
    }
    return res.status(200)
    .json(new ApiResponse(200,notes,"All notes fetched successfully"))
})
export {createNote,updateNote,deleteNote,fetchAllNotes}