import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    rolename:{type:String}
})

export const roleModel = mongoose.model("roles", roleSchema);