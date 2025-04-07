const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
	
const cocktailSchema = new mongoose.Schema({
	drinkName: {type: String, required: true},
	
	instructions: String,
	image: String,
	ingredients: [
		{
		  ingredient: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
		  amount: String 
		}
	],
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

