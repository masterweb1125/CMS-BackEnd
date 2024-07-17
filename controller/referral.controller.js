import { userModel } from "../model/user.model.js"
import { roleModel } from "../model/role.model.js"
import mongoose from "mongoose";

export const getReferralUsers = async(req,res)=>{
    try {
        const agencyRole = await roleModel.findOne({ rolename: 'agency' });
        const supplierRole = await roleModel.findOne({ rolename: 'supplier' });

        if (!agencyRole || !supplierRole) {
            return res.status(404).json({ msg: 'Roles not found', status: false });
        }
        const referralUsers = await userModel.find({
            role: { $in: [agencyRole._id, supplierRole._id] }
        });
        
        res.status(200).json({status:true,data:referralUsers})
        
    } catch (error) {
        res.status(500).json({msg:error.meessage,status:false})
    }
}


export const UpdateReferral = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if userId is provided and is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID", status: false });
      }
  
      // Update the user
      const user = await userModel.findByIdAndUpdate(userId, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Validate before updating
      });
  
      // Check if user was found and updated
      if (!user) {
        return res.status(404).json({ message: "User not found or not updated", status: false });
      }
  
      // Return the updated user
      res.status(200).json({ status: true, data: user });
    } catch (error) {
      // Catch and return any unexpected errors
      console.error('Error updating user:', error); // Log the error for debugging
      res.status(500).json({ message: error.message, status: false });
    }
  };
  