import { Router } from "express";
import { SignIn, SignUp, emailVerification } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", SignUp);
authRouter.post("/signin", SignIn);
authRouter.post("/verifyemail", emailVerification);

export default authRouter;
 