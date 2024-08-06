
import mongoose from "mongoose";


const chatUser = new mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
},
isActive:{
    type:Boolean,
    default:false
},
lastSeen:{
    type:String
}
})

export const chatUserModel = mongoose.model('chatUser',chatUser)