import express from "express";
import authConroller from "../../controller/auth-controller.js";
import authenticate from "../../middlewars/authenticate.js";

const authRouter = express.Router();

authRouter.post('/users/register', authConroller.signup );

authRouter.post('/users/login', authConroller.signin);

authRouter.get('/current', authenticate, authConroller.getCurrent );

export default authRouter;