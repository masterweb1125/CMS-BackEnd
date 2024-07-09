// import Review from '../models/re.js';
import mongoose from "mongoose";
import Review from "../model/review.model.js";
import { userModel } from "../model/user.model.js";
import {roleModel} from "../model/role.model.js";
import { tourModel } from "../model/booking.model.js";
import BookingModel from "../model/tourbooking.model.js";

export const createReview = async (req, res) => {
  try {
    const { tourId, userId, rating, review, bookingId } = req.body;

    const ReviewExsit = await Review.findOne({
      tourId: tourId,
      userId: userId,
      bookingId: bookingId,
    });
    const booking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { reviewStatus: true },
      { new: true } // This option returns the updated document
    );
    if (ReviewExsit) {
      return res.status(200).json({
        msg: "User review already exists",
        review: ReviewExsit,
        status: true,
      });
    }

    const newReview = new Review({
      tourId,
      userId,
      rating,
      review,
      bookingId,
    });

    await newReview.save();

    res.status(201).json({
      msg: "User Review is Created",
      status: true,
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: false,
    });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// Get a single review by ID
export const getAllReviewsWithDetails = async (req, res) => {
  try {
    // Fetch all reviews
    const reviews = await Review.find();

    // Array to store structured review data with user and tour details
    const reviewsWithData = [];

    // Iterate through each review and fetch user and tour details
    for (const review of reviews) {
      // Fetch tour details for the review
      const tour = await tourModel.findById(review.tourId);
      if (!tour) {
        // Skip this review if tour details not found (optional: handle error or log)
        continue;
      }

      // Fetch user details for the review
      const user = await userModel.findById(review.userId);
      if (!user) {
        // Skip this review if user details not found (optional: handle error or log)
        continue;
      }

      // Construct the review object with user and tour data
      const reviewWithData = {
        review: review,
        tour: tour,
        user: user,
      };

      reviewsWithData.push(reviewWithData);
    }

    // Return the structured reviews with user and tour data
    res.status(200).json(reviewsWithData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true, runValidators: true }
    )
      .populate("tourId")
      .populate("userId");

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewDetailsById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).then(
      async (reviewResponce) => {
        if (!reviewResponce) {
          return res.status(404).json({ message: "Review not found" });
        }
        const tour = await tourModel.findById(reviewResponce.tourId);
        const user = await userModel.findById(reviewResponce.userId);
        
        if (user._id && tour._id && reviewResponce._id) {
          return res.status(200).json({
            review: reviewResponce,
            user: user,
            tour: tour,
          });
        }
      }
    );
    // Populate user details with specific fields
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Analytics = async (req, res) => {
  try {
    const year = new Date().getFullYear(); // Current year
    const currentMonth = new Date().getMonth(); // Current month (0-11)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Last month (0-11)

    // Define the start and end dates for the current month
    const currentMonthStartDate = new Date(year, currentMonth, 1);
    const currentMonthEndDate = new Date(year, currentMonth + 1, 1);

    // Define the start and end dates for the last month
    const lastMonthStartDate = new Date(year, lastMonth, 1);
    const lastMonthEndDate = new Date(year, lastMonth + 1, 1);

    // Define the start and end dates for the year
    const startDate = new Date(year, 0, 1); // January 1st of the given year
    const endDate = new Date(year + 1, 0, 1); // January 1st of the following year

    // Query to find all reviews within the year
    const reviews = await Review.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for the specified year" });
    }

    // Calculate the average rating for the year
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1); // Format to one decimal place
    const totalReviews = reviews.length;
    const ReviewWith5Rating = await Review.find({ rating: 5 });
    const ReviewWith4Rating = await Review.find({ rating: 4 });
    const ReviewWith3Rating = await Review.find({ rating: 3 });
    const ReviewWith2Rating = await Review.find({ rating: 2 });
    const ReviewWith1Rating = await Review.find({ rating: 1 });

    // if (agencyRoleId._id) {
    //   const totalAgency = await userModel.find({ roleId: agencyRoleId});
      
    // }

    // Query to find reviews for the last month
    const lastMonthReviews = await Review.find({
      createdAt: {
        $gte: lastMonthStartDate,
        $lt: lastMonthEndDate,
      },
    });
    const totalReviewsLastMonth = lastMonthReviews.length;

    // Query to find reviews for the current month
    const currentMonthReviews = await Review.find({
      createdAt: {
        $gte: currentMonthStartDate,
        $lt: currentMonthEndDate,
      },
    });
    const totalReviewsCurrentMonth = currentMonthReviews.length;

    // Calculate the percentage of reviews in the current month versus the last month
    let percentageCurrentVsLastMonth = 0;
    if (totalReviewsLastMonth > 0) {
      percentageCurrentVsLastMonth = (
        (totalReviewsCurrentMonth / totalReviewsLastMonth) *
        100
      ).toFixed(1);
    }
    const BarChartData = {
      rating5: ReviewWith5Rating.length,
      rating4: ReviewWith4Rating.length,
      rating3: ReviewWith3Rating.length,
      rating2: ReviewWith2Rating.length,
      rating1: ReviewWith1Rating.length,
    };
    console.log(BarChartData);

    res.status(200).json({
      averageRating: averageRating,
      totalReviews: totalReviews,
      totalReviewsLastMonth: totalReviewsLastMonth,
      totalReviewsCurrentMonth: totalReviewsCurrentMonth,
      percentageCurrentVsLastMonth: `${percentageCurrentVsLastMonth}%`,
      barsChart: BarChartData, // Placeholder for future functionality
    });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "Server Error in Average rating",
        error: error.message,
        status: false,
      });
  }
};

export const GetAuthCreateReview = async (req, res) => {
  try {
    if (req.body.userSatus) {
      const userBooking = await BookingModel.find({ user: req.body.userId });
      if (userBooking) {
      }
    }
    res.status(201).json({ msg: "User Unauthenticated" });
  } catch (error) {
    console.log(error);
  }
};

export const MakeReviewPublic = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { public: true },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ msg: "Review not found", status: false });
    }

    res
      .status(200)
      .json({ msg: "Review is updated", status: true, updatedReview });
  } catch (error) {
    res.status(500).json({ msg: error.message, status: false });
  }
};


export const TourReview = async (req, res) => {
  try {
    const tourId = req.params.id;

    const reviews = await Review.find({ tourId: tourId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this tour' });
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({ averageRating: averageRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};