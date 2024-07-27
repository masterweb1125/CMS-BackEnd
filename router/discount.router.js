import express from 'express'
import { applyDiscountCode, createDiscount, deleteDiscount, getAllDiscounts, updateDiscount } from '../controller/discount.controller.js';

const DiscountRouter = express.Router();

DiscountRouter.post('/create',createDiscount)
DiscountRouter.put('/update/:id',updateDiscount)
DiscountRouter.delete('/delete/:id',deleteDiscount)
DiscountRouter.get('/',getAllDiscounts)
DiscountRouter.post('/apply',applyDiscountCode)


export default DiscountRouter;
