const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews');

router.post('/', catchAsync(reviews.createReview))
 
router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router;