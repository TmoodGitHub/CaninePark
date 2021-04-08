const Dogpark = require('../models/dogpark');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const dogpark = await Dogpark.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  dogpark.reviews.push(review);
  await review.save();
  await dogpark.save();
  req.flash('success', 'You have created a new review!');
  res.redirect(`/dogparks/${dogpark._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Dogpark.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/dogparks/${id}`);
};
