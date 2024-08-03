import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    contactInfo: {
      address: { type: String },
      email: { type: String },
      phoneNo: { type: String },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      pinterest: { type: String },
    },
    FAQsCartPage: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    serviceCharges: {
        isAdditionalIncentiveFixedAmount:{type:Boolean,default:true},
      agency_selas_targat: { type: Number },
      agency_selas_targat_bounes: { type: Number },
      agency_additional_selas_amount: { type: Number },
      admin_fee: { type: Number, default: 5 },
      agency_percentage: { type: Number, default: 90 },
      supplier_percentage: { type: Number, default: 5 },
    },
    // New fields added below
    siteSettings: {
      siteHomeTitle: { type: String },
      siteName: { type: String, required: true },
      siteLogo: { type: String },
      siteDescription: { type: String },
    },
  },
  { timestemp: true }
);

export const settingModel = mongoose.model("Setting", settingSchema);
