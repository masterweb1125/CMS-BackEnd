import { Router } from "express";

import { createTour, retireveTours, retrievingSingleTour } from "../controller/tour_record.controllerl.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);
tourRouter.get("/", retireveTours);
tourRouter.get("/:id", retrievingSingleTour)
 

export default tourRouter;
