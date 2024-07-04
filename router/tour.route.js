import { Router } from "express";

import { createTour, retireveTours, retrievingSingleTour, sendQuery } from "../controller/tour_record.controllerl.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);
tourRouter.get("/", retireveTours);
tourRouter.post("/:id", retrievingSingleTour)
tourRouter.post("/contactUs", sendQuery);
 

export default tourRouter;
