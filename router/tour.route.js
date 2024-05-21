import { Router } from "express";

import { createTour } from "../controller/tour_record.controllerl.js";

const tourRouter = Router();

tourRouter.post("/create", createTour);


export default tourRouter;
