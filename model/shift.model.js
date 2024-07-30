// models/Shift.js
import mongoose from 'mongoose'

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shiftDate: {
    type: String,
    required: true
  }
});

// Export the Shift model
export const shiftModel = mongoose.model('Shift', shiftSchema);
