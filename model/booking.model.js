import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    agencyId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:[true,"tour agency Id is required"]
    },
    location: {
      type: String,
    },

    language: [{
      type: String,
    },],

    tourPrice: {
      type: String,
      required: [true, "Price is required"],
    },

    priceAdult: {
      type: String,
    },

    priceChild: {
      type: String,
    },
    priceInfant: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    singleDayTour: {
      type: String,
    },
    tourClosingDate: {
      type: String,
    },
    description: {
      type: String,
    },
    instruction: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    whatIncludes: [
      {
        type: Object,
      },
    ],
    whatNotIncludes: [
      {
        type: Object,
      },
    ],
    viewers: {
      type: Number,
    },
    favorite: {
      type: Boolean,
    },
     status: {
      type: Number,
      enum: [0,1,2,3],
      default:0,
    },
  },
  { timestamps: true }
);

export const tourModel = mongoose.model("tour", tourSchema);
