import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import {Food} from "../models/food.model.js"
import {Track} from "../models/track.model.js"
import dotenv from "dotenv"
import { ApiResponse } from "../utils/apiResponse.js";

dotenv.config()



const searchFood=asyncHandler(async(req,res)=>{


    try {
        const foodName=req.params.name
        const food=await Food.find({
            name:{
                $regex:foodName,
                $options:'i',
            },
        }).select("-createdAt -updatedAt -__v")
        if (food.length>0) {
            res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    food,
                    "Search Successful"
                )
            )
        }else{
            res
            .status(400)
            .json(
                new ApiResponse(401,"Food Item is either Not available or not a valid search.","Enter a valid food item.")
            )
        }
    } catch (error) {
        throw new ApiError(404,error?.message)
    }

})
const registerFoodJson=asyncHandler(async(req,res)=>{

    try{
        const {foodItems}=req.body;
        Food.insertMany(foodItems);

        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Uploaded Bulk JSON Data sucessfully."
            )
        )
    }catch(error){
        throw new ApiError(402,"Something went wrong while uploading json Data.")
    }
})


const trackFood=asyncHandler(async(req,res)=>{


    const {userId,foodId,quantity}=req.body;
    console.log(userId);
    try{

        const data=await Track.create({userId,foodId,quantity});
        res
        .status(201)
        .json(
            new ApiResponse(
                201,
                data._id,
                "Food Tracked Successfully."
            )
        )
    }catch(error){
        throw new ApiError(402,"Error while Tracking User Food")
    }
})
export {searchFood,registerFoodJson,trackFood}