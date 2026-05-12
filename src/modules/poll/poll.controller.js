import PollService from "./poll.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const createPoll = async (req,res)=>{
    console.log("BODY:", req.body);
    console.log(req.user);
  const poll =await PollService.createPoll(
    req.body,
     req.user.id
  )

  ApiResponse.ok(res, "poll created",poll)

}

const getMyPolls = async (req,res)=>{
    const poll = await PollService.getMyPolls(req.user.id)
    ApiResponse.ok(res,"fetched success",poll)
}

const getPublicPoll=async(req,res)=>{
    const {id}=req.params
    const poll = await PollService.getPublicPoll(id)
    ApiResponse.ok(res,"public polls",poll)
}

const publishPoll= async(req,res)=>{
    const{pollId}= req.params

    const poll = await PollService.publishPoll(
        pollId,
        req.user.id
    )
    ApiResponse.ok(res,"poll published succesfully",poll)
}

export {

    createPoll,
    getMyPolls,
    getPublicPoll,
    publishPoll

}