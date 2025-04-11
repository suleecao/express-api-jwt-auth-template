const express = require('express');
const router = express.Router();

const User = require('../models/user');
const {Cocktail, Ingredient } = require("../models/cocktail");

const verifyToken = require("../middleware/verify-token");
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch(error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
});
router.get('/:userId', async (req, res) => {
    try{       
        if(req.user._id !== req.params.userId) {
            return res.status(403).json({ error: 'not authorized' });
        }

        const user = await User.findById(req.params.userId);

        if(!user) {
            return res.status(404).json({ error: 'user not found'});
        }
        res.json({ user });    
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
});

router.get('/:userId/favorites', verifyToken, async(req, res) => {
    try{ 
        const user = await User.findById(req.params.userId).populate('favorites');
        if (!user) return res.status(404).json({error:"user not found"});

        res.json(user.favorites)
    }catch(error){
        console.error('Error fetching favorites:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/:userId/favorites/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { cocktailId } = req.body;

    if (!cocktailId) {
      return res.status(400).json({ error: 'cocktailId is required in the body' });
    }

    if (!user.favorites.includes(cocktailId)) {
      user.favorites.push(cocktailId);
      await user.save();
    }

    res.json({ message: 'Cocktail added to favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Error adding to favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:userId/favorites', verifyToken, async (req, res) => {
  try {
    const { cocktailId } = req.body;

    if (!cocktailId) {
      return res.status(400).json({ error: 'cocktailId is required in the body' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { favorites: cocktailId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Cocktail removed from favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Error removing from favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/:userId/cocktails', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching cocktails for user ID:", userId);

    const cocktails = await Cocktail.find({ creator: userId }).populate('ingredients.ingredient');

    res.status(200).json({ cocktails });
  } catch (error) {
    console.error("Error fetching user cocktails: ", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Server error while fetching your cocktails." });
  }
});
module.exports = router;