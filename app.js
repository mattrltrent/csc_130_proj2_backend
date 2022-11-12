const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const { create_tags } = require('./utils/create_tags');
const { create_ingredients } = require('./utils/create_ingredients');
const { create_name } = require('./utils/create_name');




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("<h1>Matt's RESTful Web Service</h1><p>It's not really meant to have UI... but like... it exists. I guess as proof it was me that made it.</p><p>Use 'domain/random' to get a random recipe, or 'domain/meals/YOUR_QUERY' to search for meals.</p><p>Credit to these people for the meal data: https://www.themealdb.com.</p>");
});

app.post("/random", async function (req, res) {
    try {
        axios.post('https://www.themealdb.com/api/json/v1/1/random.php').then(resp => {
            let meal = resp.data.meals[0];
            let data = {
                "name": create_name(meal),
                "image_source": meal.strMealThumb,
                "video_source": meal.strYoutube,
                "tags": create_tags(meal),
                "ingredients": create_ingredients(meal),
                "recipe_source": meal.strSource,
            };
            return res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

app.post("/meals/:id", async function (req, res) { 
    try {
        axios.post('https://www.themealdb.com/api/json/v1/1/search.php?s=' + req.params.id).then(resp => {
            let meals = [];
            if (resp.data.meals == null) return res.status(200).send({
                "length": 0,
                "meals": null,
            });
            resp.data.meals.forEach((i) => {
                let data = {
                    "name": create_name(i),
                    "image_source": i.strMealThumb,
                    "video_source": i.strYoutube,
                    "tags": create_tags(i),
                    "ingredients": create_ingredients(i),
                    "recipe_source": i.strSource,
                };
                meals.push(data);
            });
            return res.status(200).send({
                "length": meals.length,
                "meals": meals,
            });
        });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 211;
}
app.listen(port);
