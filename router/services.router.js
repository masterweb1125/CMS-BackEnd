import express from "express"
import { CreateServicesCategory, GetAllServicesCategory, GetServicesCategoryWithName, UpdateServicesCategory } from "../controller/services.controller.js";

const ServicesRouter = express.Router();

ServicesRouter.post('/category',CreateServicesCategory);
ServicesRouter.get('/category',GetAllServicesCategory);
ServicesRouter.put('/category/:id',UpdateServicesCategory);
ServicesRouter.get('/category/:name',GetServicesCategoryWithName);



export default ServicesRouter;