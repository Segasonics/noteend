import { Router } from "express";
import { loginUser, registerUser,logOutUser, generateToken } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(verifyJWT,loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/refreshtoken").get(verifyJWT,generateToken)
export default router