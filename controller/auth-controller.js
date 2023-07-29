import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import userSchemas from "../helpers/user-schema.js";
import bcrypt from "bcryptjs";

console.log(process.env.JWT_SECRET);
const signup = async (req, res) => {

  const { error } = userSchemas.userSignupSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const {email, password} = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({ name: newUser.name, email: newUser.email });

};

const signin = async (req, res) =>{
    const { error } = userSchemas.userSigninSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password );
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const token = "213213"
    res.json({token})

}

export default {signup, signin};
