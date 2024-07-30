
import {shiftModel} from '../model/shift.model.js'
export const createShift = async (req, res) => {
    try {
      const { name, shiftDate } = req.body;
      const newShift =await shiftModel.create({ name, shiftDate });
      res.status(201).json({ msg: 'Shift added successfully',status:true });
    } catch (error) {
      res.status(500).json({ msg: 'Server error',status:false });
    }
  };

export const getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftModel.find();
    res.status(200).json({ data: shifts, status: true });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', status: false });
  }
};