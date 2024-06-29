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
    status: {
        type: String,
        enum: ['send', 'delivered', 'read'],
        default: 'sent'
    },
    sender:{
      type: String,
      enum: ['client', 'admin'],

    }
 
  },
  { timestamps: true }
);



const MessageModel = mongoose.model("Message", Message);

export default MessageModel;