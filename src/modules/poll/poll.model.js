// import { required } from "joi"
import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    question: String,
    required: Boolean,
    options : [String]

})


const pollSchema = new mongoose.Schema({
    title: String,
    descriptions: String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    questions:[questionSchema],

    responseMode:{
        type: String,
        enum:["anonymous","authenticated"]
    },

    expiresAt: Date,

    isPublished:{
        type: Boolean,
        default:false
    }
},{timestamps:true}
)

export default mongoose.model("Poll",pollSchema)