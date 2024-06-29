import { Router } from "express";
import { hendleLiveChat } from "../controller/chat.controller.js";

const Chat = Router();



Chat.post('/', hendleLiveChat );
 export default Chat; 