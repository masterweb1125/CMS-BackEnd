import { boolean } from "joi";
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    coverPic: {
      type: String,
    },
    desc: {
      type: String,
    },
    agent: [{ name: String, locationCity: String }],
    location: {
      type: String,
    },
    viewers: {
      type: Number,
    },
    favorite: {
      type: boolean,
    },
  },
  { timestamps: true }
);

export const bookingModel = mongoose.model("tour_place", bookingSchema);
