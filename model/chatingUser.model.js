import mongoose from "mongoose";

const chatUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, // Ensure userId is unique
    index: true,  // Create an index for faster queries
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date, // Use Date type for timestamps
    default: Date.now,
  },
  socketId: {
    type: String,
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields
chatUserSchema.index({ userId: 1 });
export const chatUserModel = mongoose.model('chatUser', chatUserSchema);
