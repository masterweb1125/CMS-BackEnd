import mongoose from "mongoose";

const Conversation = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true,'sender Id is required']
  },
  // recipient: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: [true,'recipient Id is required']
  // },
  booking:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'booking',
    required:[true,'Booking Id is required']
  },
  lastmsgside:{
    type:String,
  },
  lastmsg:{
    type:String,
  },
  lastmsgstatus:{
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", Conversation);

export default ConversationModel;