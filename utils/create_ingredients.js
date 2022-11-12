function create_ingredients(meal) {
    // if (meal.strTags == null) return null;
    // return meal.strTags.split(",");
    let ingredients = [];
    for (var i = 0; i < 20; i++) {
        if (meal["strIngredient" + i] && meal["strMeasure" + i]) {
            ingredients.push({
                "item": meal["strIngredient" + i],
                "amount": meal["strMeasure" + i],
            });
        }
    }
    if (ingredients.length == 0) return null;
    return ingredients;
}

module.exports = { create_ingredients };