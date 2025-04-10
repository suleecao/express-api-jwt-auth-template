function formatIngredients(drink) {
  const ingredients = {};

  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];

    if (ingredient) {
      ingredients[ingredient] = measure ? measure.trim() : '';
    }
  }

  return ingredients;
}

module.exports = formatIngredients;