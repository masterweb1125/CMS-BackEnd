import { Router } from "express";
import upload from "../middleware/multerConfig.js";
import { createTour, retireveTours, retrievingSingleTour, sendQuery } from "../controller/tour_record.controllerl.js";

const tourRouter = Router();

tourRouter.post("/create",upload.array('images', 3), createTour);
tourRouter.get("/", retireveTours);
tourRouter.get("/:id", retrievingSingleTour)
tourRouter.post("/contactUs", sendQuery);
 

export default tourRouter;
