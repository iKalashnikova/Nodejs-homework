import User from '../models/user.js';
import HttpError from "../helpers/HttpError.js";
import userSchemas from "../helpers/user-schema.js";

const signup = async(req, res) => {
    // try {
    //     const { error } = userSchemas.userSignupSchema.validate(req.body);
    //     if (error) {
    //       throw HttpError(400, error.message);
    //     }
    //     // const result = await Contact.create(req.body);
    //     // res.status(201).json(result);
    //   } catch (error) {
    //     next(error);
    //   }
};

export default signup;