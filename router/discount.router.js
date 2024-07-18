import express from 'express'
import { createDiscount, deleteDiscount, getAllDiscounts, updateDiscount } from '../controller/discount.controller.js';

const DiscountRouter = express.Router();

DiscountRouter.post('/create',createDiscount)
DiscountRouter.put('/update/:id',updateDiscount)
DiscountRouter.delete('/delete/:id',deleteDiscount)
DiscountRouter.get('/',getAllDiscounts)


export default DiscountRouter;
