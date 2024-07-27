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
  
 

  
export const applyDiscountCode = async (req, res) => {
  const { code, orderTotal, userId } = req.body;

  // Validate input
  if (!code || !orderTotal || !userId) {
    return res.status(200).json({ msg: 'Code, order total, and user ID are required',status:false });
  }

  try {
    // Find the discount code
    const discount = await discountModel.findOne({ code: code.toUpperCase() });

    // Check if discount code exists
    if (!discount) {
      return res.status(200).json({ msg: 'Invalid discount code',status:false });
    }

    // Check if discount code is active
    if (!discount.isActive) {
      return res.status(200).json({ msg: 'Discount code is not active',status:false });
    }

    // Check if discount code has expired
    const currentDate = new Date();
    if (new Date(discount.expirationDate) < currentDate) {
      return res.status(200).json({ msg: 'Discount code has expired',status:false });
    }

    // Check if user is eligible for the discount
    if (discount.users.includes(userId)) {
      return res.status(200).json({ msg: 'User not eligible for this discount',status:false});
    }

    // // Check if the order meets the minimum purchase amount
    // if (discount.conditions && discount.conditions.minPurchaseAmount) {
    //   const minPurchaseAmount = parseFloat(discount.conditions.minPurchaseAmount.split(' ')[0]);
    //   if (orderTotal < minPurchaseAmount) {
    //     return res.status(400).json({ message: `Minimum purchase amount is ${discount.conditions.minPurchaseAmount}` });
    //   }
    // }

    // Calculate the discount amount (assuming discount.value is a percentage)
    const discountAmount = (orderTotal * discount.value) / 100;
    const newTotal = orderTotal - discountAmount;

    // Update the discount to add the user ID to the users array
    // discount.users.push(userId);
    // await discount.save();

    // Respond with the new order total and discount amount
    res.status(200).json({
      msg: 'Discount applied successfully',
      discountAmount,
      data:{...discount},
      newTotal,
      status:true
    });
  } catch (error) {
    res.status(500).json({ msg: error.message,status:false });
  }
};
