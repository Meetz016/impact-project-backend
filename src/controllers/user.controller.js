import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import dotenv from "dotenv"
import {uploader} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken';
dotenv.config()

// mongoDb provides user._id
const generateAccessAndRefreshTokens=async (userId)=>{

    try{
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false}) //this to ignore password save each time
        return {accessToken,refreshToken};

    }catch(error){
        throw new ApiError(500,"Something went wrong while generating tokens.")
    }
}
const registerUser=asyncHandler( async(req,res)=>{
  const {username,email,fullname,password}=req.body
  if ([username, email, fullname, password].some((data) => data?.trim() === "")) {
    throw new ApiError(400, "All fields must not be empty");
  }
    const isExist=await User.findOne({
        $or:[{username},{email}]
    })

    if(isExist)
        {
        throw new ApiError(409,"user already exists")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required local")
    }

    const avatar=await uploader(avatarLocalPath)
    
    if(!avatar){
        throw new ApiError(400,"avatar is required")
    }

    const user=await User.create({
        fullname,
        username:username.toLowerCase(),
        avatar: avatar?.url ||"",
        email,
        password
    })

    //used when you dont wanna send any private info in the response just use -field_name 
    const createdUser=await User.find(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(400,"something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

} )

const loginUser=asyncHandler(async(req,res)=>{

    //username and password take and input
    //with user try to find username
    //if username found means user exists try to match the password
    //if password gets matched success and generate access and refresh token ------- else wrong password
    //send cookie
    const {username,password,email}=req.body;
    console.log(req.body);
    if(!username && !email){
        throw new ApiError(400,"please provide email or username")
    }
    const user=await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist !")
    }
    //user found
    const isPassValid=await user.isPasswordCorrect(password);
     
    if(!isPassValid){
        throw new ApiError(401,"Password is Wrong.")
    }
    //pass is also correct and user is also valid.
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    const loggedUser=await User.findById(user._id).select("-password -refreshToken")


    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedUser,accessToken,refreshToken
            },
            "user logged in sucessfully",
        )
    )

})
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined,
            }
        },
        {
            new:true,
        },
    )
    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User is now logged Out...")
    )
})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized Request.")
    }


    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const user=await User.findById(decodedToken._id);
    if(!user){
        throw new ApiError(401,"Invalid refresh Token.")
    }

    
})
export {registerUser,loginUser,logoutUser}
