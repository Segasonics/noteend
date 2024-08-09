import { User } from "../model/user.model.js";
import { requestHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"


export const verifyJWT=requestHandler(async(req,_,next)=>{
    console.log("Cookies",req.cookies)
    try {
        const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ","");
         console.log("token",token)
        if(!token){
            throw new ApiError(401,"Unauthorised request")
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
        req.user = user;
    
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }

})