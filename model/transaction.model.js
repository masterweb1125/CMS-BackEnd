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
  discountId: { type: String, default: null },
  referralId: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  referralAmount: { type: Number, default: 0 },
  wallet:{
    type:Boolean,
    default:false
  },
  type: { 
    type: String, 
    enum: ['stripe', 'paypal'], // Restricting to specific values
    required:true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 // Ensuring the amount is non-negative
  },
  actualAmount:{
    type:Number,
    default:0
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

transactionSchema.index({ userId: 1, bookingId: 1 }, { unique: true });
 
export const transactionModel = mongoose.model('Transaction', transactionSchema);

