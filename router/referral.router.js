import express from "express"
import { applyReferralCode, getReferralUsers, getUserReferral, UpdateReferral } from "../controller/referral.controller.js";

const Referral  = express.Router();

Referral.get("/user",getReferralUsers)
Referral.post("/user/:id",UpdateReferral)
Referral.get("/:id",getUserReferral)
Referral.post("/apply",applyReferralCode)




export default Referral;