import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import {Food} from "../models/food.model.js"
import dotenv from "dotenv"
import { ApiResponse } from "../utils/apiResponse.js";

dotenv.config()



const searchFood=asyncHandler(async(req,res)=>{

    console.log("control is reaching here.")
    res
    .json({
        message:"API handling is Sucessful."
    })
})


const registerFoodJson=asyncHandler(async(req,res)=>{

    const jsonLocalPath=req.files?.foodFile[0]?.path;

    if(!jsonLocalPath){
        throw new ApiError(400,"JSON file is required.")
    }
    try{
        const data=fs.readFileSync(jsonLocalPath,'utf-8')
        const jsonData=JSON.parse(data)
        for(const food of jsonData){
            const {name,carbs,fiber,fat,calories,protein}=food;
            await Food.create({
                name,
                carbs,
                fiber,
                fat,
                calories,
                protein
            })
        }
        fs.unlink(jsonLocalPath)
        console.log("JSON data uploaded into database sucessfully.")


    }
    catch(eror){
        throw new ApiError(410,"Not able to locate the json file")
    }
})
export {searchFood,registerFoodJson}