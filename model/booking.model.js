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

    location: {
      type: String,
    },

    languge: {
      type: String,
    },

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
        type: String,
      },
    ],
    whatNotIncludes: [
      {
        type: String,
      },
    ],
    viewers: {
      type: Number,
    },
    favorite: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const tourModel = mongoose.model("tour", tourSchema);
