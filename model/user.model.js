
import mongoose from "mongoose";
const isPasswordRequired = function() {
  return !this.provider_id; // If provider_id is not set, require password
};
const userSchema = new mongoose.Schema(
  {
    name: {type: String,required: [true, "Your name is required"],},
    last_name: {type: String,},
    profile_image:{type:String,default:"https://res.cloudinary.com/dtupoan8j/image/upload/v1719479311/download_kfx7si.jpg"},
    company_name: { type: String,default:null},
    raferral_code:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    raferral_status:{type:Boolean},
    raferral_amount:{type:Number},
    client_id:{type:String,default:null},
    provider_id:{type:String,default:null},
    password: { type: String, required: [isPasswordRequired, "Password is required"] },
    email: {type: String,required: [true, "Please provide your email address"],},
    country: { type: String,default:null},
    office_no: { type: String,default:null },
    email_verified :{type:Boolean,default:null},
    cell_phone: { type: String,default:null },
    facial_Number: { type: String,default:null},
    Register_As: { type: String ,default:null},
    occupation: { type: String,default:null },
    wallet:{type:Number,default:0,},
    roleId:{type:mongoose.Schema.Types.ObjectId,required:[true,'role id is required']}
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
