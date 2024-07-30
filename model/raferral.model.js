import mongoose, { Schema } from "mongoose";


const referralSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    users:[{
      type:mongoose.Schema.Types.ObjectId
    }],
    referral_amount:{type:Number,default:0},
    isActive: { type: Boolean, default: false },
  },{timestamps:true});

export const referralModel = mongoose.model('referral',referralSchema)