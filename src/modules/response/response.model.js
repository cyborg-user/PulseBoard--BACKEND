// import { required } from "joi";
import mongoose, { mongo } from "mongoose";
import poll from "../poll/poll.model.js";
import User from "../auth/auth.model.js";



const answerSchema= new mongoose.Schema({
    questionId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    selectedOption:{
        type:String,
        required: true,
    },



})


const responseSchema = mongoose.Schema({

    poll:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required:true,
    },
    user:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        deafult:null,
    },
    answers:[answerSchema]
},{Timestamp:true})

export default mongoose.model(
  "Response",
  responseSchema
);