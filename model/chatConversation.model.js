import mongoose from "mongoose";

const Conversation = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true,'sender Id is required']
  },
  recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true,'recipient Id is required']
  },
  lastmsgside:{
    type:Boolean,
  },
  lastmsg:{
    type:String,
  },
  // 1 = send 2 deliver 3 = seen 4 panding
  lastmsgstatus:{
    type: Number,
    enum: [1,2,3,4],

  }
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", Conversation);

export default ConversationModel;