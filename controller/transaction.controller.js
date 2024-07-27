import { transactionModel } from "../model/transaction.model.js";
import { userModel } from "../model/user.model.js";
import { roleModel } from "../model/role.model.js";
// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const existingTransaction = await transactionModel.findOne({
      userId: req.body.userId,
      bookingId: req.body.bookingId
    });

    if (existingTransaction) {
      res.status(200).json({
        status: false,
        message: 'Duplicate transaction detected'
      })
    }
    const transaction = new transactionModel(req.body);
    await transaction.save();
    res.status(201).json({ data: transaction, status: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, status: false });
  }
};

// Get all transactions

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find();

    // Fetch user and role information for each transaction
    const transactionsWithUserRole = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await userModel.findById(transaction.userId);
        if (user) {
          const role = await roleModel.findById(user.roleId);
          return {
            ...transaction.toObject(),rolename: role ? role.rolename : "Role not found",
          };
        } else {
          return {
            ...transaction
        
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
