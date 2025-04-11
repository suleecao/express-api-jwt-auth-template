const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const verifyToken = require("../middleware/verify-token");


router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('req.user:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { cocktail, comment, rating } = req.body;
    const author = req.user._id;
    const parsedRating = Number(rating);

    if (!cocktail || isNaN(parsedRating)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReview = await Review.create({
      cocktail,
      author,
      comment,
      rating: parsedRating,
    });

    res.status(201).json({ message: "Review created", review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error while creating review" });
  }
});
router.get('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error while fetching review" });
  }
});

router.put('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    if (!comment || typeof rating !== 'number') {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Forbidden: You are not the father" });
    }

    review.comment = comment;
    review.rating = rating;

    await review.save();

    res.status(200).json({ message: "Review updated", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error while updating review" });
  }
});

router.delete('/:reviewId', verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "Forbidden: You are not the father" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error while deleting review" });
  }
});

module.exports = router;
