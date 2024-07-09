import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  tourId: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId:{
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  public:{
    type:Boolean,
    default:false

  }
  
},{timestamps:true});

const Review = model('Review', reviewSchema);

export default Review;
