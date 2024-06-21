import { Router } from "express";

import {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
  } from '../controller/booking.controller.js'
const bookingRouter = Router();



// 
bookingRouter.post('/', createBooking);

// // Get all bookings
bookingRouter.get('/', getBookings);

// // Get a single booking by ID
// bookingRouter.get('/:id', getBookingById);

// // Update a booking by ID
// bookingRouter.put('/:id', updateBooking);

// // Delete a booking by ID
// bookingRouter.delete('/:id', deleteBooking);


export default bookingRouter;