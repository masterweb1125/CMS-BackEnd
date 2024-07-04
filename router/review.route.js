import express from 'express';
import {
  createReview,
  // getAllReviews,
  // getReviewById,
  updateReview,
  deleteReview,
  getReviewDetailsById,
  getAllReviewsWithDetails,
  MakeReviewPublic,
  Analytics
} from '../controller/review.controller.js';

const ReviewsRoute = express.Router();

ReviewsRoute.post('/', createReview);
ReviewsRoute.get('/', getAllReviewsWithDetails);
ReviewsRoute.get('/analytics',Analytics)
ReviewsRoute.put('/:id', updateReview);
ReviewsRoute.delete('/:id', deleteReview);
ReviewsRoute.get('/details/:id', getReviewDetailsById);
ReviewsRoute.post('/public/:id', MakeReviewPublic);

export default ReviewsRoute;
