import Poll from "./poll.model.js";
import ApiError from"../../common/utils/api-error.js";
// import { date } from "joi";

class PollService{
    //CREATE POLL

    static async createPoll(data,userId){
        const poll = await Poll.create({
            ...data,
            createdBy: userId,
        })
        return poll
    }

// GET LOGGED IN USER POLLS

static async getMyPolls(userId){
    const polls= await Poll.find({
        createdBy:userId,
    }).sort({createdAt: -1})
    return polls
}

// GET PUBLIC POLL


static async getPublicPoll(pollId){
    const poll= await Poll.findById(pollId)

    if(!poll){
        throw ApiError.notfound("poll not found")
    }

    if(new date()> poll.expiresAt){
        throw ApiError.expires("expired poll")

    }

    return poll
}
 static async publishPoll(
    pollId,
    userId
 ){
    const poll = await Poll.findById(pollId)

    if(!poll){
        throw ApiError.notfound("poll not found")
    }

    //ONLY CREATOR 
    if(
        poll.createdBy.toString()!==userId.toString()
    ){
       throw ApiError.unauthorized("only created one can publish poll")
    }

    Poll.isPublished = true

    await Poll.save()

    return poll



 }




}

export default PollService;