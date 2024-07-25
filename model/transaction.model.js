import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true,"User Id is requires"],
    index: true // Adding an index for faster queries
  },
  bookingId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Booking',
    default:null
  },
  wallet:{
    type:Boolean,
    default:false
  },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], // Restricting to specific values
    required:true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 // Ensuring the amount is non-negative
  },
  currency: { 
    type: String, 
    required: true ,
    default:'USD'
  },
  comment: { 
    type: String, 
    trim: true // Trimming whitespace from the comment
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

export const transactionModel = mongoose.model('Transaction', transactionSchema);

