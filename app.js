const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const { create_tags } = require('./utils/create_tags');
const { create_ingredients } = require('./utils/create_ingredients');
const { create_name } = require('./utils/create_name');
var cors = require('cors');

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile('views/dashboard.html', {root: __dirname })
});

app.all("/random", async function (req, res) {
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

app.all("/meals/:id", async function (req, res) { 
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
