const express = require('express');
const router = express.Router();
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

})

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
router.get("/:cocktailId", async(req,res) => {
  try{
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/lookup.php?i=${req.params.cocktailId}`);
    const data = await response.json();
    const drink = data.drinks[0];
    ingredients = formatIngredients(drink);
    res.json({
    name: drink.strDrink,
    id: drink.idDrink,
    instructions: drink.strInstructions,
    image: drink.strDrinkThumb,
    ingredients: ingredients,
    });
  }catch(error){
    console.error("error fetching cocktail data: ", error.message);
    res.status(500).json({error: "Failed to fetch cocktail data."})
  }
})
router.get('/:cocktailName', async (req, res) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v2/${API_KEY}/search.php?s=+${req.params.cocktailName}`);
    const data = await response.json();
    const drinks = data.drinks;
    const firstDrink = drinks[0];

    const ingredients = formatIngredients(firstDrink);
    console.log(ingredients);

    res.json({
      name: firstDrink.strDrink,
      id: firstDrink.idDrink,
      instructions: firstDrink.strInstructions,
      image: firstDrink.strDrinkThumb,
      ingredients: ingredients,
    });

  } catch (error) {
    console.error('Error fetching cocktail data:', error.message);
    res.status(500).json({ error: 'Failed to fetch cocktail data' });
  }
});


module.exports = router;