import Joi from 'joi';
import { emailRegexp } from "../constants/user-constant.js";

const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
})

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        'any.required': 'Missing required field: email',
    }),
})

export default {
    userSignupSchema,
    userSigninSchema,
    userEmailSchema
}
