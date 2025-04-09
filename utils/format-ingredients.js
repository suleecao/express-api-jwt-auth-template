function formatIngredients(cocktail) {
  const ingredients = [];

  cocktail.ingredients.forEach(item => {
  
    const ingredientName = item.ingredient.ingredient; 
    const ingredientAmount = item.amount.trim();
    
    const formattedIngredient = ingredientAmount ? `${ingredientAmount} ${ingredientName}` : ingredientName;
    
    ingredients.push(formattedIngredient);
  });

  return ingredients;
}

module.exports = formatIngredients;
