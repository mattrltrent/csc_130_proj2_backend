function create_tags(meal) {
    if (meal.strTags == null) return null;
    let tags = [];
    meal.strTags.split(",").forEach((i) => {
        if (i) tags.push(i);
    });
    if (tags.length > 0) return tags;
    return null;
}

module.exports = { create_tags };