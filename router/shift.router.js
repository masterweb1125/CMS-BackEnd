import express from 'express';
import { createShift, getAllShifts } from '../controller/shift.controller.js';

const shiftRouter  = express.Router();

shiftRouter.post('/create',createShift)
shiftRouter.get('/',getAllShifts)

export default shiftRouter;