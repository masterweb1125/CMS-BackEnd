import { Router } from "express";

import { createTour, retireveTours, retrievingSingleTour, sendQuery } from "../controller/tour_record.controllerl.js";
import { getTourByAgencyId } from "../controller/agency.controller.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);
tourRouter.get("/", retireveTours);
tourRouter.get("/:id", retrievingSingleTour)
tourRouter.post("/contactUs", sendQuery);
tourRouter.get("/agency/:id", getTourByAgencyId)
 

export default tourRouter;
