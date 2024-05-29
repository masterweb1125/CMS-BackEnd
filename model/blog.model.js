import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogTitle: { type: String },
    blogDesc: { type: String },
    cardPic: { type: String },
    blogPagePic: { type: String },
    publisherName: { type: String },
    publisherPic: { type: String },
    publishDate: { type: String },
  },
  { timestamps: true }
);

export const blogModel = mongoose.model("blog", blogSchema);
