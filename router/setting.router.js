import express from 'express';
import { GetSettings } from '../controller/setting.controller.js';

const settingRouter = express.Router();
settingRouter.get('/:id',GetSettings);



export default settingRouter;