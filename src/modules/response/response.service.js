import Poll from "../poll/poll.model.js"
import Response from "../response/response.model.js"
import ApiError from "../../common/utils/api-error.js";


class ResponseService{

static async submitResponse(
    pollId,
    answers,
    user
){
    //FIND POLL

    const poll= await Poll.findById(pollId);

    if(!poll){
throw ApiError.notfound("poll not found")
    }

    //CHECK EXPIRY 

    if(new Date()>Poll.expiresAt){
        throw ApiError.expires("expired poll")
    }

    // CHECK AUTH MODE

    if(poll.responseMode==="authenticated"
        && !user)
        {
            throw ApiError.unauthorized("login required")
        }
        //PREVENT DUPLICATE RESPONSES
        if(user){
            const existingResponse =
            await Response.findOne({
                poll:pollId,
                user: user._id,
            })

            if (existingResponse){
                throw ApiError.duplicate("user already submitted this poll")
            }
        }
        
         for (const question of poll.questions) {

      if (question.required) {

        const answered = answers.find(
          a =>
            a.questionId ===
            question._id.toString()
        );

        if (!answered) {
          throw new Error(
            `${question.question} is required`
          );
        }

      }

    }

    // SAVE RESPONSE
    const response =
      await Response.create({

        poll: pollId,

        user: user ? user._id : null,

        answers,

      });

    return response;

  }

}

export default ResponseService;




