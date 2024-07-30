import { userModel } from "../model/user.model.js"
import { roleModel } from "../model/role.model.js"
import mongoose from "mongoose";
import { referralModel } from "../model/raferral.model.js";
import crypto from 'crypto'
export const getReferralUsers = async (req, res) => {
  try {
      const agencyRole = await roleModel.findOne({ rolename: 'agency' });
      const supplierRole = await roleModel.findOne({ rolename: 'supplier' });

      if (!agencyRole || !supplierRole) {
          return res.status(404).json({ msg: 'Roles not found', status: false });
      }

      // Find users with the roles 'agency' and 'supplier'
      const referralUsers = await userModel.find({
          roleId: { $in: [agencyRole._id, supplierRole._id] }
      }).lean(); // Using lean() to get plain JavaScript objects

      // Fetch all roles to map role IDs to role names
      const roles = await roleModel.find({ _id: { $in: [agencyRole._id, supplierRole._id] } }).lean();

      // Create a role ID to role name map
      const roleMap = roles.reduce((acc, role) => {
          acc[role._id] = role.rolename;
          return acc;
      }, {});

      // Add the role name to each user object
      const usersWithRoleNames = referralUsers.map(user => ({
          ...user,
          rolename: roleMap[user.roleId]
      }));

      res.status(200).json({ status: true, data: usersWithRoleNames });

  } catch (error) {
      res.status(500).json({ msg: error.message, status: false });
  }
}


// Helper function to generate a unique referral code

const generateReferralCode = () => {
  // Generate a random alphanumeric discount code, e.g., 8 characters long
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

const isReferralCodeUnique = async (code) => {
  const existingDiscount = await referralModel.findOne({ code: code });
  return !existingDiscount;
};

const createUniqueReferralCode = async () => {
  let uniqueCode = generateReferralCode();
  while (!(await isReferralCodeUnique(uniqueCode))) {
    uniqueCode = generateReferralCode();
  }
  return uniqueCode;
};

export const UpdateReferral = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId is provided and is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(404).json({ status: false, msg: "Invalid user ID" });
    }

    // Generate a unique referral code
    const referral_code = await createUniqueReferralCode();

    // Check if the referral already exists
    const existReferral = await referralModel.findOne({ userId: userId });
    if (existReferral) {
      // Update the existing referral
      const referral = await referralModel.findByIdAndUpdate(
        existReferral._id,
        { ...req.body }, // Update with new referral code
        { new: true, runValidators: true } // Return the updated document and validate before updating
      );
      return res.status(200).json({ status: true, msg: "User referral updated", data: referral });
    }

    // Create a new referral
    console.log(req.body);

    const newReferral = await referralModel.create({ ...req.body,code: referral_code });
    res.status(201).json({ status: true, msg: 'New referral created', data: newReferral });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};



export const getUserReferral = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if userId is provided and is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({ message: "Invalid user ID", status: false });
    }

    // Fetch the referral information based on the user ID
    const referral = await referralModel.findOne({ userId });

    // Check if referral information was found
    if (!referral) {
      return res.status(200).json({ message: "Referral information not found", status: false });
    }

    // Return the referral information
    res.status(200).json({ status: true, data: referral });
  } catch (error) {
    // Catch and return any unexpected errors
    console.error('Error fetching referral information:', error); // Log the error for debugging
    res.status(500).json({ message: error.message, status: false });
  }
};
export const applyReferralCode = async (req, res) => {
  const { code, orderTotal, userId } = req.body;

  // Validate input
  if (!code || !orderTotal || !userId) {
    return res.status(200).json({ msg: 'Code, order total, and user ID are required', status: false });
  }

  try {
    // Find the referral code
    const referral = await referralModel.findOne({ code: code.toUpperCase() });

    // Check if referral code exists
    if (!referral) {
      return res.status(200).json({ msg: 'Invalid referral code', status: false });
    }

    // Check if referral code is active
    if (!referral.isActive) {
      return res.status(200).json({ msg: 'Referral code is not active', status: false });
    }

    // Check if referral code has expired
    const currentDate = new Date();
    if (new Date(referral.expirationDate) < currentDate) {
      return res.status(200).json({ msg: 'Referral code has expired', status: false });
    }

    // Check if user is eligible for the referral
    if (referral.users.includes(userId)) {
      return res.status(200).json({ msg: 'User not eligible for this referral', status: false });
    }

    // Calculate the referral benefit (assuming referral.value is a percentage)
    const referralBenefit = (orderTotal * referral.referral_amount) / 100;
    const newTotal = orderTotal - referralBenefit;

    // Update the referral to add the user ID to the users array
   

    // Respond with the new order total and referral benefit
    res.status(200).json({
      msg: 'Referral applied successfully',
      referralBenefit,
      data: { ...referral },
      newTotal,
      status: true
    });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false });
  }
};
