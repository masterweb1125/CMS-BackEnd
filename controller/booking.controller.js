import BookingModel from '../model/tourbooking.model.js'; // Adjust the path as needed
import mongoose from 'mongoose';
import {userModel} from '../model/user.model.js'
import { tourModel } from "../model/booking.model.js";
import {format,parse,getHours, getMinutes} from 'date-fns'
import {shiftModel} from '../model/shift.model.js'
// Create a new booking
import moment from 'moment';
export const createBooking = async (req, res) => {
  // console.log('create booking is working', req.body);
  const {user,tour,bookingDate} = req.body;
  try {
    // Check if the booking already exists
    const existingBooking = await BookingModel.findOne({user:user,tour:tour,bookingDate:bookingDate});
    if (existingBooking) {
      // console.log('create booking api backend')
      return res.status(200).json({ msg: 'Booking already exists', booking: existingBooking,status:false});
    }
    
    // // Create the new booking
    const newBooking =await  BookingModel.create(req.body);

     res.status(201).json({status:true,data:newBooking});
  } catch (error) {
    console.log('create booking error', error);
    res.status(400).json({ message: error.message });
  }
};


// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getBookingsWithTourData = async (req, res) => {
  try {
    // Fetch all bookings
    const bookings = await BookingModel.find();

    // Fetch all tour IDs from the bookings
    const tourIds = bookings.map(item => item.tour);

    // Fetch all tours in a single query
    const tours = await tourModel.find({ _id: { $in: tourIds } });

    // Create a map of tour IDs to tour data for quick lookup
    const tourMap = new Map();
    tours.forEach(tour => {
      tourMap.set(tour._id.toString(), tour);
    });

    // Attach tour data to each booking
    const bookingsWithTourData = bookings.map(item => {
      const tour = tourMap.get(item.tour.toString());
      return {
        ...item.toObject(),
        tour,
      };
    });

    res.status(200).json({status:true,data:bookingsWithTourData});
  } catch (error) {
    res.status(500).json({ msg: error.message,status:false });
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
  // console.log('working voucher api' ,req.body)
  try {
    const { user, tour, bookingDate } = req.body;
    // console.log('Voucher Api is Working')
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
const calculateRevenue = async () => {
  try {
    const allBookings = await BookingModel.find({});

    // Calculate total revenue
    const totalRevenue = allBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    // Calculate the first day of the current and previous month
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filter bookings for the current month and the previous month
    const currentMonthBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= firstDayOfCurrentMonth;
    });

    const lastMonthBookings = allBookings.filter(booking => {
      const bookingDate = new Date(booking.bookingDate);
      return bookingDate >= firstDayOfLastMonth && bookingDate <= lastDayOfLastMonth;
    });

    const currentMonthRevenue = currentMonthBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
    const lastMonthRevenue = lastMonthBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    // Calculate the percentage change
    const percentageChange = lastMonthRevenue === 0 ? 0 : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    return { totalRevenue, currentMonthRevenue, lastMonthRevenue, percentageChange };
  } catch (err) {
    console.error('Error calculating revenue:', err);
    throw err;
  }
};

export const getTotalRevenue = async (req, res, next) => {
  try {
    // console.log('getTotalRevenue called');
    const { totalRevenue, currentMonthRevenue, lastMonthRevenue, percentageChange } = await calculateRevenue();
    res.json({ totalRevenue, currentMonthRevenue, lastMonthRevenue, percentageChange });
  } catch (err) {
    console.error('Error getting total revenue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getTotalBooking =  async (req, res) => {
  try {
    // Calculate dates for the current month and last month
    const currentDateStart = moment().startOf('month');
    const lastMonthStart = moment().subtract(1, 'months').startOf('month');

    // Query to find bookings between last month and current month
    const bookingsCurrentMonth = await BookingModel.countDocuments({
      createdAt: { $gte: currentDateStart.toDate(), $lt: moment().toDate() }
    });

    const bookingsLastMonth = await BookingModel.countDocuments({
      createdAt: { $gte: lastMonthStart.toDate(), $lt: currentDateStart.toDate() }
    });

    // Query to find total bookings
    const totalBookings = await BookingModel.countDocuments();

    // Calculate percentage change
    let percentageChange = 0;
    if (bookingsLastMonth !== 0) {
      percentageChange = ((bookingsCurrentMonth - bookingsLastMonth) / bookingsLastMonth) * 100;
    } else if (bookingsCurrentMonth !== 0) {
      percentageChange = 100; // Infinite change if last month had no bookings
    }

    // Prepare response
    const response = {
      totalBookings,
      bookingsCurrentMonth,
      bookingsLastMonth,
      percentageChange
    };

    res.json(response);
  } catch (err) {
    console.error('Error calculating booking vs. last month:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const dateFormater = (dateString)=>{
  // Parse the input date string
  const parsedDate = parse(dateString, 'MMMM dd, yyyy', new Date());
  
  // Format the parsed date into the desired format
  const formattedDate = format(parsedDate, 'yyyy-MM-dd');
  
  return formattedDate;
}
function convertDateFormat(dateString) {
  // Parse the date string into a Date object
  const parsedDate = parse(dateString, 'yyyy-MM-dd hh:mm a', new Date());

  // Extract hours and minutes from the parsed date
  const hours = getHours(parsedDate);
  const minutes = getMinutes(parsedDate);

  // Create a new Date object with the year, month, day, hours, and minutes
  const convertedDate = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      hours,
      minutes
  );

  return convertedDate;
}
function convertISOToDate(isoDateString) {
  return new Date(isoDateString);
}
export const TotalBookingShadular = async (req, res) => {
  try {
    // Find all bookings
    const bookings = await BookingModel.find();

    // Map each booking to a promise that resolves with the desired output format
    const bookingPromises = bookings.map(async (booking) => {
      const tour = await tourModel.findOne({ _id: booking.tour });
      // console.log()
      return {
        title: tour.name,
        startDate: convertISOToDate(convertDateFormat(dateFormater(booking?.bookingDate)+" "+ booking?.departTime)),
        endDate:  convertISOToDate(convertDateFormat(tour.endDate+" "+ booking?.departTime)),
        id: booking._id,
        location: tour.location,
      };
    });

    // Wait for all promises to resolve
    Promise.all(bookingPromises).then((formattedBookings) => {
      res.json(formattedBookings);
    }).catch((error) => {
      console.error('Error retrieving bookings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const checkBooking = async (req,res)=>{
  try {

    const existingBooking = await BookingModel.findOne({user:req.body.user,tour:req.body.tour,bookingDate:req.body.bookingDate});
    if (existingBooking) {
      // console.log('create booking api backend')
      return res.status(200).json({ msg: 'Booking already exists', booking: existingBooking,status:false});
    }
    res.status(200).json({status:true});
  } catch (error) {
    res.status(500).json({msg:error.message,status:false});
  }
}

