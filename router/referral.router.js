import express from "express"
import { getReferralUsers, UpdateReferral } from "../controller/referral.controller.js";

const Referral  = express.Router();

Referral.get("/user",getReferralUsers)
Referral.post("/user/:id",UpdateReferral)



export default Referral;