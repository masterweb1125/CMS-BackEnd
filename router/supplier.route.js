import { Router } from "express";
import {
  SignIn,
  SignUp,
  emailVerification,
} from "../controller/auth.controller.js";

const supplierRouter = Router();

supplierRouter.post("/signup", SignUp);
supplierRouter.post("/signin", SignIn);
supplierRouter.post("/verifyemail", emailVerification);

export default supplierRouter;
