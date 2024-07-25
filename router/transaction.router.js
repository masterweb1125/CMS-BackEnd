import express from 'express';
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionById, updateTransaction } from '../controller/transaction.controller.js';

const transactionRouter = express.Router();
 
// Create a new transaction
transactionRouter.post('/', createTransaction);

// Get all transactions
transactionRouter.get('/', getAllTransactions);

// Get a single transaction by ID
transactionRouter.get('/:id', getTransactionById);

// Update a transaction by ID
transactionRouter.put('/:id', updateTransaction);

// Delete a transaction by ID
transactionRouter.delete('/:id', deleteTransaction);



export default transactionRouter;

