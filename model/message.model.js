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
    status:{
      type: Number,
      enum: [1,2,3,4],
  
    }
   
  },
  { timestamps: true }
);



const MessageModel = mongoose.model("Message", Message);

export default MessageModel;