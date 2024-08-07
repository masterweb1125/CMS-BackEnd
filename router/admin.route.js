import { Router } from "express";
import { SignIn, SignUp, emailVerification, getAdmins } from "../controller/admin.controller.js";


const adminRouter = Router();

adminRouter.post("/signup", SignUp);
adminRouter.post("/signin", SignIn);
adminRouter.post("/verifyemail", emailVerification);
adminRouter.get('/',getAdmins)
export default adminRouter;
