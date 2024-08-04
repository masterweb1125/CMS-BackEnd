import { io } from "../index.js";
import ConversationModel from "../model/chatConversation.model.js";
import MessageModel from "../model/message.model.js";

export const handleLiveChat = async (req, res) => {
  try {
    
    const { sender, recipient, lastmsgstatus, lastmsg, lastmsgside,} = req.body;

    // Check if the conversation already exists
    const conversation = await ConversationModel.findOne({
      $or: [
          { sender: sender, recipient: recipient },
          { sender: recipient, recipient: sender }
      ]
  });
  

    if (conversation) {
      // Update the existing conversation
      conversation.lastmsg = lastmsg;
      conversation.lastmsgside = lastmsgside;
      conversation.lastmsgstatus = lastmsgstatus;
      conversation.sender = sender;
      conversation.recipient = recipient;

      await conversation.save();

      // Create a new message for the existing conversation
      const message = await MessageModel.create({
        content: lastmsg,
        conversationId: conversation._id, 
        status: lastmsgstatus,
        sender:sender,
        recipient:recipient,
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
try {
  const sender = req.params.senderId;
  const recipient = req.params.recipientId;
  const conversation = await ConversationModel.findOne({
    $or: [
        { sender: sender, recipient: recipient },
        { sender: recipient, recipient: sender }
    ]
});

if(!conversation){
  return res.status(200).json({msg:'conversation not found',status:true,frontStatus:false})
}

io.emit('conversation',conversation)

res.status(200).json({status:true,data:conversation,frontStatus:true})
} catch (error) {
  res.status(500).json({msg:error.message,status:false,frontStatus:false});
}
}

export const GetAllMessages = async (req, res) => {
  try {
    const recipient = req.params.recipientId;
    const sender = req.params.senderId;

    const messages = await MessageModel.find({
      $or: [
        { sender: sender, recipient: recipient },
        { sender: recipient, recipient: sender }
      ]
    });

    res.status(200).json({ messages, status: true });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
