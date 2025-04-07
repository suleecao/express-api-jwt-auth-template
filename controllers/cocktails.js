const express = require('express');
const router = express.Router();
const formatIngredients = require("../utils/format-ingredients");
router.get("/random", async(req,res) =>{
	try{
		const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
		const data = await response.json();
		const drink = data.drinks[0];
		const ingredients = formatIngredients(drink)
		res.json({
			name: drink.strDrink,
			instructions: drink.strInstructions,
      image: drink.strDrinkThumb,
      ingredients: ingredients,
		});
	}catch(error){
		console.error("error fetching cocktail data: ", error.message);
		res.status(500).json({error:error.message})
	}

})
router.get("/glasses", async(req, res) =>{
	const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list");
	const data = await response.json();
	let glassesArr = []
	data.drinks.forEach((glass) => glassesArr.push(glass.strGlass))
	console.log(glassesArr)
})
const getIngredients = async() =>{
	
}

router.get('/:cocktailName', async (req, res) => {
  try {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+req.params.cocktailName);
    const data = await response.json();
    const drinks = data.drinks;
    const firstDrink = drinks[0];

    const ingredients = formatIngredients(firstDrink);
    console.log(ingredients);

    res.json({
      name: firstDrink.strDrink,
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