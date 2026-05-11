import joi from "joi"
import BaseDto from "../../../common/dto/base.dto.js"

class RegisterDto extends BaseDto{
    static schema=joi.object({
        name: joi.string().trim().min(2).max(50).required(),
        email: joi.string().email().lowercase().required(),
        password : joi.string()
        .min(8)
        .pattern(/(?=.*[A-Z])(?=.*\d)/)
        .message(
            "password must contain at least one uppercase"
        )
        .required(),
        role :joi.string().valid("Admin","Student").default("Student")
    })
}

export default RegisterDto