import mongoose from "mongoose";


const trackSchema=new mongoose.Schema({
    //userid
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    //foodid
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Food",
        required:true
    },
    //quantity
    quantity:{
        type:Number,
        required:true,
        min:1
    }
},{timestamps:true})


export const Track=mongoose.model("Track",trackSchema)