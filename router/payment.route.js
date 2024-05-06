import { Router } from "express";

import { stripe_checkout } from "../controller/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post("/checkout", stripe_checkout);

export default paymentRouter;
