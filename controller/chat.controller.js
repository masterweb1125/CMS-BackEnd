import ConversationModel from "../model/chatConversation.model.js";
import MessageModel from "../model/message.model.js";

export const hendleLiveChat = async (req, res) => {
  const { sender, booking, lastmsgstatus, lastmsg, lastmsgside } = req.body;
  const ConversationExist = await ConversationModel.find({ sender, booking });
  if (ConversationExist) {
    const Updated = await ConversationModel.find({ sender, booking }).updateOne(
      {
        lastmsg,
        lastmsgside,
        lastmsgstatus,
      }
    );
    const con = await ConversationModel.find({ sender, booking })
      .then(async (item) => {
        const message = await MessageModel.create({
          content: lastmsg,
          conversationId: item[0]._id,
          sender:lastmsgside
        });
        await message.save()
        // .then((item)=>{
          return res.status(200).json({
            msg: "Conversation alrady exist but credential updated",
            conversation: item[0],
            msgData:message,
            status: "updated",
          });
        // }).catch((error)=>{
        //   console.log(error)
        // })

       
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
  const newConversation = await ConversationModel.create(req.body);
  await newConversation.save();
  // const message = await MessageModel.create({
  //   conversationId: con._id,
  //   content: lastmsg,
  // });
  // console.log(newConversation);
  return res.status(200).json({
    msg: "Conversation was created",
    conversation: newConversation,
    status: "created",
  });
};

export const GetConversation = async (req,res)=>{
//  const conversations
}