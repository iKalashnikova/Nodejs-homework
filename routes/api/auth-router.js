import express from "express";
import authConroller from "../../controller/auth-controller.js";

const authRouter = express.Router();

authRouter.post('/users/register', authConroller.signup );

authRouter.post('/signin', authConroller.signin);
export default authRouter;