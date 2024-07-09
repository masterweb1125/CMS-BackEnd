import { Router } from "express";

import { createTour, retireveTours, retrievingSingleTour, retrievingSingleTourAgencyDahboard, sendQuery } from "../controller/tour_record.controllerl.js";
import { getTourByAgencyId } from "../controller/agency.controller.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);
tourRouter.get("/", retireveTours);
tourRouter.post("/:id", retrievingSingleTour)
tourRouter.get("/:id", retrievingSingleTourAgencyDahboard)
tourRouter.get("/agency/:id", getTourByAgencyId)
tourRouter.post("/contactUs", sendQuery);
 

export default tourRouter;
