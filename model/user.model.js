import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    password: { type: String, required: [true, "Password is required"] },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
    },
    country: { type: String },
    cell_phone: {
      type: String
    },
    occupation: { type: String }
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
