import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    last_name: {
      type: String,
    },

    password: { type: String, required: [true, "Password is required"] },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
    },

    phone: {
      type: String,
    },
    role: { 
      type: String,
      enum: ['user', 'admin', 'agency','supplier'],
      default: 'user'
    },
  },
  { timestamps: true }
);

export const adminModel = mongoose.model("admin", adminSchema);
