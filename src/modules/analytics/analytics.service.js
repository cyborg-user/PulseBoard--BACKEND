import ApiError from "../../common/utils/api-error.js";

import Poll from "../poll/poll.model.js";

import Response from "../response/response.model.js";


class AnalyticService {

    
  static async getPollAnalytics(
    pollId,
    userId
  ) {

    // FIND POLL
    const poll =
      await Poll.findById(pollId);

    if (!poll) {

      throw ApiError.notFound(
        "Poll not found"
      );

    }

    // ONLY CREATOR CAN VIEW
    if (
      poll.createdBy.toString() !==
      userId.toString()
    ) {

      throw ApiError.unauthorized(
        "Unauthorized access"
      );

    }

    // GET RESPONSES
    const responses =
      await Response.find({
        poll: pollId,
      });

    // TOTAL RESPONSES
    const totalResponses =
      responses.length;

    // QUESTION ANALYTICS
    const questionAnalytics = [];



    // LOOP THROUGH QUESTIONS
    for (const question of poll.questions) {

      const optionCounts = {};



      // INITIALIZE COUNTS
      for (const option of question.options) {

        optionCounts[option] = 0;

      }



      // COUNT RESPONSES
      for (const response of responses) {

        const answer =
          response.answers.find(
            ans =>
              ans.questionId.toString() ===
              question._id.toString()
          );

        if (answer) {

          optionCounts[
            answer.selectedOption
          ]++;

        }

      }



      // FORMAT OPTIONS
      const formattedOptions =
        Object.entries(optionCounts)
          .map(([option, count]) => ({
            option,
            count,
          }));



      questionAnalytics.push({

        questionId:
          question._id,

        question:
          question.question,

        options:
          formattedOptions,

      });

    }



    // FINAL RETURN
    return {

      totalResponses,

      questions:
        questionAnalytics,

    };

  }
  static async getPublicResults(
  pollId
) {

  const poll =
    await Poll.findById(pollId);

  if (!poll) {

    throw new Error(
      "Poll not found"
    );

  }

  if (!poll.isPublished) {

    throw new Error(
      "Results not published yet"
    );

  }

  const responses =
    await Response.find({
      poll: pollId,
    });

  const questionAnalytics = [];

  for (const question of poll.questions) {

    const optionCounts = {};

    for (const option of question.options) {

      optionCounts[option] = 0;

    }

    for (const response of responses) {

      const answer =
        response.answers.find(
          ans =>
            ans.questionId.toString() ===
            question._id.toString()
        );

      if (answer) {

        optionCounts[
          answer.selectedOption
        ]++;

      }

    }

    const formattedOptions =
      Object.entries(optionCounts)
        .map(([option, count]) => ({
          option,
          count,
        }));

    questionAnalytics.push({

      question:
        question.question,

      options:
        formattedOptions,

    });

  }

  return {

    title: poll.title,

    totalResponses:
      responses.length,

    questions:
      questionAnalytics,

  };

}
  

}


export default AnalyticService;