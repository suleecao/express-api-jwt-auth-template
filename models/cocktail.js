const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});
const Ingredient = mongoose.model("Ingredient", ingredientSchema);

const glassesArr = ['Highball glass', 'Old-fashioned glass', 'Cocktail glass', 'Copper Mug', 'Whiskey Glass', 'Collins glass', 'Pousse cafe glass', 'Champagne flute', 'Whiskey sour glass', 'Brandy snifter', 'White wine glass', 'Nick and Nora Glass', 'Hurricane glass', 'Coffee mug', 'Shot glass', 'Jar', 'Irish coffee cup', 'Punch bowl', 'Pitcher', 'Pint glass', 'Cordial glass', 'Beer mug', 'Margarita/Coupette glass', 'Beer pilsner', 'Beer Glass', 'Parfait glass', 'Wine Glass', 'Mason jar', 'Margarita glass', 'Martini Glass', 'Balloon Glass', 'Coupe Glass']

const cocktailSchema = new mongoose.Schema({
	drinkName: {
    type: String, 
    required: true
  },
	creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: new mongoose.Types.ObjectId("67f401c1478b7fcee134d8ee"),
    required:true

  },
	instructions: String,
	image: String,
	ingredients: [
		{
		  ingredient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Ingredient"
    },
		  amount: String 
		}
	],
	glass: {
		type:String,
		enum: glassesArr,
		required:true,
	},
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

const Cocktail = mongoose.model("Cocktail", cocktailSchema);
module.exports = { Ingredient, Cocktail };