import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createNote, deleteNote, fetchAllNotes, updateNote } from "../controller/notes.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router =Router();
//secured routes
router.route("/createnote").post(upload.single("image"),verifyJWT,createNote)
router.route("/updatenote/:_id").put(verifyJWT,updateNote)
router.route("/deletenote/:_id").delete(verifyJWT,deleteNote)
router.route("/fetchallnote").get(fetchAllNotes)


export default router;