import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
 
},{timestamps:true});


export const ServicesCaregoryModel = mongoose.model('ServicesCategory', categorySchema);


