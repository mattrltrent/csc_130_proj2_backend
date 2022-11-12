function create_name(meal) {
    if (meal.strMeal.length == 0) return null;
    return meal.strMeal;
}

module.exports = { create_name };