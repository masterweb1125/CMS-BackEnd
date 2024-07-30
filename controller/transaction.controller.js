import { transactionModel } from "../model/transaction.model.js";
import { userModel } from "../model/user.model.js";
import { roleModel } from "../model/role.model.js";
import discountModel from "../model/discount.model.js";
// Create a new transaction
import {referralModel} from '../model/raferral.model.js'
export const createTransaction = async (req, res) => {
  try {
    const { userId, bookingId, discountId,raferralId} = req.body;

    // Check for existing transaction
    const existingTransaction = await transactionModel.findOne({
      userId,
      bookingId,
    });

    if (existingTransaction) {
      return res.status(200).json({
        status: false,
        message: "Duplicate transaction detected",
      });
    }

    // Handle discount if provided
    if (discountId) {
      const discount = await discountModel.findById(discountId);
      if (discount) {
        discount.users.push(userId);
        await discount.save();
      } else {
        return res.status(404).json({
          status: false,
          message: "Discount not found",
        });
      }
    }
    if (raferralId) {
      const referral = await referralModel.findById(raferralId);
      if (referral) {
        referral.users.push(userId);
        await referral.save();
      } else {
        return res.status(404).json({
          status: false,
          message: "Referral not found",
        });
      }
    }

    // Create and save the new transaction
    const transaction = await transactionModel.create(req.body);
    res.status(201).json({ data: transaction, status: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false });
  }
};

// Get all transactions

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({wallet:true});

    // Fetch user and role information for each transaction
    const transactionsWithUserRole = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await userModel.findById(transaction.userId);
        if (user) {
          const role = await roleModel.findById(user.roleId);
          return {
            ...transaction.toObject(),
            rolename: role ? role.rolename : "Role not found",
          };
        } else {
          return {
            ...transaction,
          };
        }
      })
    );

    res.status(200).json({ data: transactionsWithUserRole, status: true });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionModel.findById(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: false, msg: "Transection Not found" });
    }
    res.status(200).json({ data: transaction, status: true });
  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};

// Update a transaction by ID
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).send();
    }
    res.status(200).send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await transactionModel.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).send();
    }
    res.status(200).send(transaction);
  } catch (error) {
    res.status(500).send(error);
  }
};



export const createTransactionForWallet = async (req, res) => {
  try {
    const { userId} = req.body;

    const transaction = await transactionModel.create({...req.body,wallet:true});
    res.status(201).json({ data: transaction, status: true });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false });
  }
};
