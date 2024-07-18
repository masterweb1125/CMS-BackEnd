import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true
  },
  value: {
    type: Number,
    // required: true
  },
  expirationDate: {
    type: String,
    // required: true
  },
  conditions: {
    type: Map,
    of: String,
    default: {}
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  timesUsed: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    // default: true
  }
}, {
  timestamps: true
});

const discountModel = mongoose.model('Discount', discountSchema);

export default discountModel;
