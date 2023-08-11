import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import createVerifyEmail from "../helpers/createVerifyEmail.js";
import userSchemas from "../helpers/user-schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  const { error } = userSchemas.userSignupSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }

  const { email, password } = req.body;
  const avatarURL = gravatar.url(email, { s: '200' });
  const user = await User.findOne({ email });
  if (user) {
    return next(HttpError(409, "Email in use"));
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });

  const verifyEmail = createVerifyEmail({email, verificationCode});

  await sendEmail(verifyEmail);


  res.status(201).json({
    user: {
      avatarURL: newUser.avatarURL,
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res, next) => {
  const { error } = userSchemas.userSigninSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
    
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(HttpError(401, "Email or password invalid"));
  }

  if (!user.verify) {
   return next(HttpError(401, "Email not verify"));
}

  const passwordCompare = await bcrypt.compare(password, user.password);
  
  if (!passwordCompare) {
    return next(HttpError(401, "Email or password invalid"));
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
     return next(HttpError(404, "User not found"));
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

  res.json({
      message: "Verify successful"
  })
};

const resendVerifyEmail = async(req, res, next)=> {

  const { error } = userSchemas.userEmailSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }

  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) {
     return next(HttpError(404, "Email not found"));
  }

  if(user.verify) {
      return next(HttpError(400, "Email already verify"))
  }

  const verifyEmail = createVerifyEmail({email, verificationToken: user.verificationToken});

  await sendEmail(verifyEmail);

  res.json({
      message: "Resend email success"
  })
}

const getCurrent = (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    email,
    subscription
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {   

    const {path: oldPath, filename} = req.file;
    const avatarPath = path.resolve("public", "avatars");
    const newPath = path.join(avatarPath, filename);

    console.log("Old Path:", oldPath);
console.log("New Path:", newPath);

 

  const avatarURL = path.join("avatars", filename);
 
  const tempPath = path.join("temp", filename);
  console.log("Reading image from:", tempPath);

  const image = await Jimp.read(tempPath);
  image.resize(250, 250);
  image.write(tempPath);

  await fs.rename(oldPath, newPath);
 
  const { _id} = req.user;
  await User.findByIdAndUpdate(_id, { avatarURL: avatarURL }, { new: true });
  
  res.json({avatarURL: avatarURL});
}


export default { signup, signin, verify, resendVerifyEmail, getCurrent, logout, updateAvatar };
