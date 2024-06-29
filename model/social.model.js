import mongoose from "mongoose";

const socialSchema = new mongoose.Schema({
  provider_id: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},{timestamps:true});
export const socialModel = mongoose.model('Social', socialSchema);
