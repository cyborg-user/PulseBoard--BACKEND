import ApiResponse from "../../common/utils/api-response.js";
import AnalyticService from "./analytics.service.js";



const getPollAnalytics= async(req,res)=>{
const {pollId}= req.params

const analytics= await AnalyticService.getPollAnalytics(pollId,req.user.id)
 ApiResponse.ok(res,"analytics here",analytics)

}


const getPublicResults= async(req,res)=>{
    const{pollId}=req.params

    const results = await AnalyticService.getPublicResults(pollId)
    ApiResponse.ok(res,"results declared",results)
}

export {
    getPollAnalytics,
    getPublicResults
}