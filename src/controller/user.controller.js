
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { requestHandler } from "../utils/asynchandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        let user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh Token")
    }
}

//Register user
const registerUser = requestHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exist")
    }

    const user = await User.create({
        username: username?.toLowerCase(),
        email,
        password
    })

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

    const findUser = await User.findById(user._id).select("-password -refreshToken");

    if (!findUser) {
        throw new ApiError(500, "Sorry! something went wrong while registering")
    }

    const options = {
        httpOnly: true,
        secure: true,
         sameSite: 'None'
    }
    return res.status(201)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, findUser, "User registered succcessfully"))
})

//Loginuser
const loginUser = requestHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username || email)) {
        throw new ApiError(500, "all fields are required")
    }
     
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isValidPassword = await user.isCorrectPassword(password);
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
         sameSite: 'None'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User logged In successfully")
        )

}
)

//logout user
const logOutUser=requestHandler(async(req,res)=>{
    
    await User.findByIdAndDelete(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true,
         sameSite: 'None'
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out succeffuly"))
})

const generateToken=requestHandler(async(req,res)=>{
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
        throw new ApiError(401,"Unauthorised")
    }

    const options={
        httpOnly:true,
        secure:true,
         sameSite: 'None'
    }
    return res.status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201,"Access granted"))
})
export { registerUser, loginUser,logOutUser ,generateToken}