import ApiResponse from "../../common/utils/api-response.js";
import ResponseService from "./response.service.js";

const submitResponse = async (req,res)=>{
console.log(" entering response route")

    const {pollId} = req.params
    const {answers} = req. body

    const response = await ResponseService.submitResponse(
        pollId,
        answers,
        req.user||null,

        ApiResponse.ok(res,"response submitted")

    )
}

export {submitResponse}