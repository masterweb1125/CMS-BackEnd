// search.controller.js
import { tourModel } from "../model/booking.model.js";
import BookingModel from "../model/tourbooking.model.js";
import {userModel} from "../model/user.model.js";
import { roleModel } from "../model/role.model.js"; // Import Role model

export const Search = async (req, res) => {
  const { query } = req.query;
  const searchRegex = new RegExp(`^${query}`, 'i'); // case-insensitive search, matches the start of the string

  try {
    // Search for tours by name
    const tours = await tourModel.find({ name: searchRegex });

    // Search for bookings by booking date and populate related data
    const bookings = await BookingModel.find({ bookingDate: searchRegex }).populate('tour user');

    // Find roleId matching roleName from Role model
    const role = await roleModel.findOne({ roleName: searchRegex }).select('_id');
    
    // Prepare the search conditions
    const userSearchConditions = [
      { name: searchRegex },
      { email: searchRegex }
    ];

    if (role) {
      userSearchConditions.push({ roleId: role._id });
    }

    // Search for users by name, email, or roleId
    const users = await userModel.find({
      $or: userSearchConditions
    }).populate('roleId', 'roleName'); // Populate roleName from Role model

    res.json({ tours, bookings, users });
  } catch (error) {
    res.status(500).send(error);
  }
};