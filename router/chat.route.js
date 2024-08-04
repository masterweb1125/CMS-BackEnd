import { Router } from "express";
import { GetAllMessages, GetConversation, handleLiveChat } from "../controller/chat.controller.js";

const Chat = Router();



Chat.post('/', handleLiveChat );
Chat.post('/:recipientId/:senderId',GetAllMessages)
Chat.post('/conversation/:recipientId/:senderId',GetConversation)
 export default Chat; 