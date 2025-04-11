const express = require('express');
const { Ingredient }= require('../models/cocktail'); 
const router = express.Router();

// GET all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch ingredients' });
  }
});

// GET ingredient by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findById(id); 
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch ingredient' });
  }
});

module.exports = router;