const express = require('express');
const router = express.Router();
const {Cocktail, Ingredient } = require('../models/cocktail')
const mongoose = require("mongoose")
const formatIngredients = require("../utils/format-ingredients");
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY;

router.get("/", async (req, res) => {
  res.json({ message: "hi" });
});

router.get("/random", async(req,res) =>{
  try{
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/random.php`);
    const data = await response.json();
    const drink = data.drinks[0];
    const ingredients = formatIngredients(drink)
    res.json({
      name: drink.strDrink,
      id: drink.idDrink,
      instructions: drink.strInstructions,
      image: drink.strDrinkThumb,
      ingredients: ingredients,
    });
  }catch(error){
    console.error("error fetching cocktail data: ", error.message);
    res.status(500).json({error:error.message})
  }

});

router.get("/popular", async (req, res) => {
  try {
    const url = `https://www.thecocktaildb.com/api/json/v2/${API_KEY}/popular.php`;

    console.log("Fetching URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const drinks = data.drinks.map((drink) => {
      return {
        name: drink.strDrink,
        id: drink.idDrink,
        instructions: drink.strInstructions,
        image: drink.strDrinkThumb,
        ingredients: formatIngredients(drink.ingredients),
      };
    });

    res.json(drinks);

  } catch (error) {
    console.error("Error fetching cocktail data:", error.message);
    res.status(500).json({ error: "Failed to fetch cocktail data" });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const url = `https://www.thecocktaildb.com/api/json/v2/${API_KEY}/latest.php`;

    console.log("Fetching URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    const drinks = data.drinks.map((drink) => {
      return {
        name: drink.strDrink,
        id: drink.idDrink,
        instructions: drink.strInstructions,
        image: drink.strDrinkThumb,
        ingredients: formatIngredients(drink),
      };
    });

    res.json(drinks);

  } catch (error) {
    console.error("Error fetching cocktail data:", error.message);
    res.status(500).json({ error: "Failed to fetch cocktail data" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, directions, ingredients } = req.body;

    if (!name || !directions || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCocktail = new Cocktail({
      name,
      instructions,
      ingredients, 
    });

    await newCocktail.save();

    res.status(201).json({ message: "Cocktail added successfully", cocktail: newCocktail });
  } catch (error) {
    console.error("Error adding cocktail:", error);
    res.status(500).json({ message: "Server error while adding cocktail" });
  }
});
router.put("/:cocktailId", async (req, res) => {
  try {
    const { cocktailId } = req.params;
    const { name, directions, ingredients, glass } = req.body;

    if (!name || !directions || !Array.isArray(ingredients) || !glass) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedCocktail = await Cocktail.findByIdAndUpdate(
      cocktailId,
      { drinkName: name, instructions: directions, ingredients, glass },
      { new: true }
    );

    if (!updatedCocktail) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.json({ message: "Cocktail updated successfully", cocktail: updatedCocktail });
  } catch (error) {
    console.error("Error updating cocktail:", error);
    res.status(500).json({ message: "Server error while updating cocktail" });
  }
});
router.delete("/:cocktailId", async (req, res) => {
  try {
    const { cocktailId } = req.params;

    const deletedCocktail = await Cocktail.findByIdAndDelete(cocktailId);

    if (!deletedCocktail) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.json({ message: "Cocktail deleted successfully" });
  } catch (error) {
    console.error("Error deleting cocktail:", error);
    res.status(500).json({ message: "Server error while deleting cocktail" });
  }
});

module.exports = router;