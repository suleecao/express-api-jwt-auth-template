const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Cocktail = require("../models/cocktail");

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

    if (!user.favorites.includes(req.params.cocktailId)) {
      user.favorites.push(req.params.cocktailId);
      await user.save();
    }

    res.json({ message: 'Cocktail added to favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Error adding to favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:userId/favorites/:cocktailId',verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { favorites: req.params.cocktailId } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Cocktail removed from favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Error removing from favorites:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;