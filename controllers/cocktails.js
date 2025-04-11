const express = require('express');
const router = express.Router();
const {Cocktail, Ingredient } = require('../models/cocktail')
const mongoose = require("mongoose")
const formatIngredients = require("../utils/format-ingredients");
const verifyToken = require("../middleware/verify-token");
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.API_KEY;

router.get("/", async (req, res) => {
  res.json({ message: "hi" });
});

router.get("/random", async (req, res) => {
  try {
    const randomCocktails = await Cocktail.aggregate([{ $sample: { size: 10 } }]);
    res.json(randomCocktails);
  } catch (error) {
    console.error("Error fetching random cocktails:", error.message);
    res.status(500).json({ error: "Failed to fetch random cocktails" });
  }
});

router.get("/api/random", async(req,res) =>{
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

router.get("/api/:cocktailId", async(req,res) =>{
  try{
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${req.params.cocktailId}`)
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
  }catch(error){
    console.error(error);
  }
});


router.get("/api/popular", async (req, res) => {
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

router.get("/api/latest", async (req, res) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/latest.php`);
    const text = await response.json;
    console.log("Raw Response Text:", text); 

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    let data;
    try {
      data = JSON.parse(text);  
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse JSON" });
    }


    if (!data.drinks) {
      console.error("No drinks found in the response");
      return res.status(404).json({ message: "No drinks found" });
    }

    console.log("First Drink:", data.drinks[0]);

    const drinks = data.drinks.map((drink) => {
     
      console.log("Drink Object:", drink);

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

router.get("/api/search/:searchQuery", async(req,res) =>{
  try{
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${req.params.searchQuery}`)
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
  }catch(error){
    console.error(error);
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { drinkName, instructions, ingredients, glass } = req.body;
    if (!drinkName || !instructions || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newCocktail = new Cocktail({
      drinkName,
      instructions,
      ingredients, 
      glass,
      creator: req.user.id
    });

    await newCocktail.save();

    res.status(201).json({ message: "Cocktail added successfully", cocktail: newCocktail });
  } catch (error) {
    console.error("Error adding cocktail:", error);
    res.status(500).json({ message: "Server error while adding cocktail" });
  }
});
router.get("/:cocktailId", async (req, res) => {
  try {
    const { cocktailId } = req.params;

    const cocktail = await Cocktail.findById(cocktailId)
      .populate('ingredients') 
      .populate('creator', 'username');

    if (!cocktail) {
      return res.status(404).json({ message: "Cocktail not found" });
    }

    res.status(200).json(cocktail);
  } catch (error) {
    console.error("Error fetching cocktail:", error);
    res.status(500).json({ message: "Server error while fetching cocktail" });
  }
});
router.put("/:cocktailId", verifyToken, async (req, res) => {
  try {
    const { cocktailId } = req.params;
    const { drinkName, directions, ingredients, glass } = req.body;

    if (!drinkName || !directions || !Array.isArray(ingredients) || !glass) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cocktail = await Cocktail.findById(cocktailId);
    if (!cocktail) return res.status(404).json({ message: "Cocktail not found" });

    if (cocktail.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not the father" });
    }

    cocktail.drinkName = drinkName;
    cocktail.instructions = directions;
    cocktail.ingredients = ingredients;
    cocktail.glass = glass;

    await cocktail.save();

    res.json({ message: "Cocktail updated successfully", cocktail });
  } catch (error) {
    console.error("Error updating cocktail:", error);
    res.status(500).json({ message: "Server error while updating cocktail" });
  }
});

router.delete("/:cocktailId", verifyToken, async (req, res) => {
  try {
    const { cocktailId } = req.params;

    const cocktail = await Cocktail.findById(cocktailId);
    if (!cocktail) return res.status(404).json({ message: "Cocktail not found" });

    if (cocktail.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You are not the father" });
    }

    await Cocktail.findByIdAndDelete(cocktailId);
    res.json({ message: "Cocktail deleted successfully" });
  } catch (error) {
    console.error("Error deleting cocktail:", error);
    res.status(500).json({ message: "Server error while deleting cocktail" });
  }
});


module.exports = router;