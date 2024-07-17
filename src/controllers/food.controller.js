import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import {Food} from "../models/food.model.js"
import dotenv from "dotenv"
import { ApiResponse } from "../utils/apiResponse.js";

dotenv.config()



const searchFood=asyncHandler(async(req,res)=>{


    let food;
    try {
        const foodName=req.params.name
        food=await Food.find({
            name:{
                $regex:foodName,
                $options:'i',
            },
        }).select("-_id -createdAt -updatedAt -__v")
        
        console.log(food)
    } catch (error) {
        throw new ApiError(404,error?.message)
    }

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
export {searchFood,registerFoodJson}