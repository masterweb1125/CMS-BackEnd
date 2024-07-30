import { Router } from "express";
import { handleLiveChat } from "../controller/chat.controller.js";

const Chat = Router();



Chat.post('/', handleLiveChat );
 export default Chat; 