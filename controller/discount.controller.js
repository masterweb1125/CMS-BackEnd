import discountModel from "../model/discount.model.js";

export const createDiscount = async (req, res) => {
    const discountData = req.body;
    try {
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
      const updatedDiscount = await discountModel.findByIdAndUpdate(id, discountData, {
        new: true,
        runValidators: true,
      });
      if (!updatedDiscount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
      res.json(updatedDiscount);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  export const deleteDiscount = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDiscount = await discountModel.findByIdAndDelete(id);
      if (!deletedDiscount) {
        return res.status(404).json({ message: 'Discount not found' });
      }
      res.json({ message: 'Discount deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
  
