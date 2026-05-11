import joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js"



class CreatePollDto extends BaseDto{
    static schema = joi.object({
        title: joi.string().required(),
        description : joi.string().allow(""),
        responsemode: joi.
        string()
        .valid("anonymous","authenticated")
        .required(),

        expiresAt: joi.date().required(),

        questions: joi.array().items(
            joi.object({
                question : joi.string.required(),
                required: joi.boolean(),

                options: joi.array()
                .items(joi.string())
                .min(2)
                .required()

            })

        ).min(1)

    })
}

export default CreatePollDto;
