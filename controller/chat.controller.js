import ConversationModel from "../model/chatConversation.model.js";
import MessageModel from "../model/message.model.js";

export const handleLiveChat = async (req, res) => {
  try {
    const { sender, recipient, lastmsgstatus, lastmsg, lastmsgside } = req.body;

    // Check if the conversation already exists
    let conversation = await ConversationModel.findOne({ sender, recipient });

    if (conversation) {
      // Update the existing conversation
      conversation.lastmsg = lastmsg;
      conversation.lastmsgside = lastmsgside;
      conversation.lastmsgstatus = lastmsgstatus;
      await conversation.save();

      // Create a new message for the existing conversation
      const message = await MessageModel.create({
        content: lastmsg,
        conversationId: conversation._id,
        sender: lastmsgside,
      });

      return res.status(200).json({
        msg: "Conversation already exists but credentials updated",
        conversation,
        msgData: message,
        status: true,
      });
    } else {
      // Create a new conversation
      conversation = new ConversationModel(req.body);
      await conversation.save();

      // Create a new message for the new conversation
      const message = await MessageModel.create({
        content: lastmsg,
        conversationId: conversation._id,
      });

      return res.status(200).json({
        msg: "Conversation was created",
        conversation,
        msgData: message,
        status: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ msg: error.message,status:false});
  }
};


export const GetConversation = async (req,res)=>{
//  const conversations
}

export const  GetAllMessages = async ()=>{
try {
  
} catch (error) {
  res.status(500).json({msg:error.message})
}
}