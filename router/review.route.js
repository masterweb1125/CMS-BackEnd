import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewDetailsById,
  getAllReviewsWithDetails,
  MakeReviewPublic,
  Analytics,
  TourReview,
  TourReviewById
} from '../controller/review.controller.js';

const ReviewsRoute = express.Router();

ReviewsRoute.post('/', createReview);
ReviewsRoute.get('/', getAllReviewsWithDetails);
ReviewsRoute.get('/analytics',Analytics)
ReviewsRoute.put('/:id', updateReview);
ReviewsRoute.delete('/:id', deleteReview);
ReviewsRoute.get('/details/:id', getReviewDetailsById);
ReviewsRoute.post('/public/:id', MakeReviewPublic);
ReviewsRoute.get('/tour/:id', TourReview );
ReviewsRoute.get('/tour/reviews/:id', TourReviewById );

export default ReviewsRoute;
