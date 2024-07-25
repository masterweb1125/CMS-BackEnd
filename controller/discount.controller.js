import discountModel from "../model/discount.model.js";

// const discountModel = require('../models/discountModel');  // Adjust the path as necessary

const generateDiscountCode = () => {
  // Generate a random alphanumeric discount code, e.g., 8 characters long
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const isDiscountCodeUnique = async (code) => {
  const existingDiscount = await discountModel.findOne({ code });
  return !existingDiscount;
};

const createUniqueDiscountCode = async () => {
  let uniqueCode = generateDiscountCode();
  while (!(await isDiscountCodeUnique(uniqueCode))) {
    uniqueCode = generateDiscountCode();
  }
  return uniqueCode;
};

export const createDiscount = async (req, res) => {
  const discountData = req.body;
  
  try {
    // Generate a unique discount code
    discountData.code = await createUniqueDiscountCode();

    // Create the new discount
    const newDiscount = await discountModel.create(discountData);
    
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


  export const updateDiscount = async (req, res) => {
    const { id } = req.params;
    const discountData = req.body;
    try {
      const updatedDiscount = await discountModel.findByIdAndUpdate(id, discountData);

      
      if (!updatedDiscount) {
        return res.status(404).json({ message: 'Discount not found',status:false });
      }
      // console.log(discountData)
      res.json({data:updatedDiscount,status:true});
    } catch (error) {
      res.status(400).json({ message: error.message,status:false});
    }
  };
  export const deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDiscount = await discountModel.findByIdAndDelete(id);
      if (!deletedDiscount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
      res.json({ message: 'Discount deleted successfully',status:true });
    } catch (error) {
      res.status(500).json({ message: error.message,status:false});
    }
  };

  export const getAllDiscounts = async (req, res) => {
    try {
      const discounts = await discountModel.find({});
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
