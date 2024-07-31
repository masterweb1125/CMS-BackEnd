import mongoose from "mongoose";

const Message = new mongoose.Schema(
  {
    conversationId:{
        type:mongoose.Schema.ObjectId,
        ref:'Conversation',
        required:[true,'conversation Id is required']
    },
    content: {
        type: String,
        required: true
    },
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
    status:{
      type: Number,
      enum: [1,2,3,4],
  
    }
   
  },
  { timestamps: true }
);



const MessageModel = mongoose.model("Message", Message);

export default MessageModel;