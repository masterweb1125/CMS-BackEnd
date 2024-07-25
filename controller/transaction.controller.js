
import { transactionModel } from '../model/transaction.model.js';
// Create a new transaction
export const createTransaction = async (req, res) => {
    try {
        const transaction = new transactionModel(req.body);
        await transaction.save();
        res.status(201).send(transaction);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find();
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await transactionModel.findById(req.params.id);
        if (!transaction) {
            return res.status(404).send();
        }
        res.status(200).send(transaction);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a transaction by ID
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await transactionModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
