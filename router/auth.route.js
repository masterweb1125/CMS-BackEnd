import { Router } from "express";
import { SignIn, SignUp, SocialAuth, emailVerification, handleUpdateProfileImage, handleUploadProfileImage, roleFind, roleFindById } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post('/social',SocialAuth)
authRouter.post("/signup", SignUp);
authRouter.post("/signin", SignIn);
authRouter.post("/verifyemail", emailVerification);
authRouter.post('/role',roleFind)
authRouter.post('/roleId',roleFindById)
authRouter.post('/Upload-Profile-Image',handleUploadProfileImage)
authRouter.post('/Update-Profile-image',handleUpdateProfileImage)


export default authRouter;
 