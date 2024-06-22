import BookingModel from '../model/tourbooking.model.js'; // Adjust the path as needed
import mongoose from 'mongoose';
import {userModel} from '../model/user.model.js'
import { tourModel } from "../model/booking.model.js";
// Create a new booking
export const createBooking = async (req, res) => {
  // console.log('create booking is working', req.body);
  const {user,tour,bookingDate} = req.body;
  try {
    // Check if the booking already exists
    const existingBooking = await BookingModel.findOne({user:user,tour:tour,bookingDate:bookingDate});
    if (existingBooking) {
      // console.log('create booking api backend')
      return res.status(200).json({ msg: 'Booking already exists', booking: existingBooking });
    }
    
    // // Create the new booking
    const newBooking =await new BookingModel(req.body);
    await newBooking.save();
    return res.status(201).json(newBooking);
  } catch (error) {
    console.log('create booking error', error);
    res.status(400).json({ message: error.message });
  }
};


// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find().populate('user').populate('tour');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id).populate('user').populate('tour');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await BookingModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user').populate('tour');
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const verifyBooking = async (req, res) => {
  try {
    const { tour, user,bookingData } = req.query; // Assuming these are the parameters to uniquely identify a booking

    // Query the database to find a booking that matches the criteria
    const existingBooking = await BookingModel.findOne({
      tour: tour,
      user: user,
      bookingDate:bookingDate
      // Add more fields as necessary to uniquely identify a booking
    });

    if (existingBooking) {
      return res.status(200).json({ exists: true, booking: existingBooking });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error verifying booking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const BookingVoucher = async (req, res) => {
  console.log('working voucher api' ,req.body)
  try {
    const { user, tour, bookingDate } = req.body;
    console.log('Voucher Api is Working')
    // Validate the query parameters
    if (!user || !tour || !bookingDate) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    // Find booking based on user ID, tour ID, and booking date
    const booking = await BookingModel.findOne({
      user: user,
      tour: tour,
      bookingDate: bookingDate,
    })
    const userData = await userModel.findById(user);
    const tourData= await tourModel.findById(tour);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({booking:booking,user:userData,tour:tourData});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};