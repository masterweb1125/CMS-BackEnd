import { Router } from "express";
import { GetAllMessages, handleLiveChat } from "../controller/chat.controller.js";

const Chat = Router();



Chat.post('/', handleLiveChat );
Chat.post('/:recipientId/:senderId',GetAllMessages)
 export default Chat; 