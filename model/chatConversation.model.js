import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
  admin:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: [true, "Admin Id is required"],
  }
  },
  { timestamps: true }
);

// Create a compound index to enforce uniqueness on user, tour, and bookingDate combination
bookingSchema.index({ user: 1, tour: 1, bookingDate: 1 }, { unique: true });

const BookingModel = mongoose.model("booking", bookingSchema);

export default BookingModel;
