import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Tour Id is required"],
    },
    paymentType: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
      required: true,
    },
    totalAdult: {
      type: Number,
      required: true,
    },
    totalChild: {
      type: Number,
      required: true,
    },
    totalInfant: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    bookingDate:{
      type:Date,
      required:[true,"Booking Date is required"]
    },
    departTime:{
      type:String,
      required:[true,"Booking departTime is required"]
    },
    duration:{
      type:Number,
      required:[true,"duration is required"]
    },
    totalPrice: {
      type: Number,
      required: [true, "Total Price is required"],
    },
  },
  { timestamps: true }
);

// Create a compound index to enforce uniqueness on user and tour combination
// bookingSchema.index({ user: 1, tour: 1,totalPrice: 1 }, { unique: true });

const BookingModel = mongoose.model("booking", bookingSchema);

export default BookingModel;
