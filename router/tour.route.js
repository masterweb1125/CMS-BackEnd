import { Router } from "express";

import { createTour, retireveTours } from "../controller/tour_record.controllerl.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);
tourRouter.get("/", retireveTours);
 

export default tourRouter;
