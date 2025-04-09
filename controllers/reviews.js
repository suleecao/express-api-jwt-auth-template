const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Cocktail = require('../models/Cocktail');


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

router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error while deleting review" });
  }
});

module.exports = router;