import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";
import {Food} from "../models/food.model.js"
import dotenv from "dotenv"

dotenv.config()



const searchFood=asyncHandler(async(req,res)=>{

    console.log("control is reaching here.")
    res
    .json({
        message:"API handling is Sucessful."
    })
})


const registerFoodJson=asyncHandler(async(req,res)=>{
    const filePath='./public/temp/main_food_data.json';
    try{
        const data=fs.readFileSync(filePath,'utf-8')
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

        //if this done means upload is sucessful now we want to remove the file
        fs.unlink(jsonData)
        console.log("JSON data uploaded into database sucessfully.")
    }
    catch(eror){
        throw new ApiError(410,"Not able to locate the json file")
    }
})
export {searchFood,registerFoodJson}