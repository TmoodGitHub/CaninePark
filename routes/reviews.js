const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controller/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

const Dogpark = require('../models/dogpark');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
