import { Router } from "express";

import {
    createBooking,
    TotalBookingShadular,
    getBookings,
    getTotalBooking,
    getBookingById,
    updateBooking,
    deleteBooking,
    getTotalRevenue,
    BookingVoucher,
  } from '../controller/booking.controller.js'
const bookingRouter = Router();



bookingRouter.get('/totalRevenue', getTotalRevenue);

bookingRouter.get('/totalBooking', getTotalBooking);

bookingRouter.get('/totalBookingShadular', TotalBookingShadular);
// 
bookingRouter.post('/', createBooking);

// // Get all bookings
bookingRouter.get('/', getBookings);

// Get a single booking by ID
bookingRouter.get('/:id', getBookingById);

// Update a booking by ID
bookingRouter.put('/:id', updateBooking);

// Delete a booking by ID
bookingRouter.delete('/:id', deleteBooking);

bookingRouter.post('/Voucher',BookingVoucher);

export default bookingRouter;