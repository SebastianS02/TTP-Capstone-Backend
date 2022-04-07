const express = require ("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { all } = require("./routes/jwtAuth");

//port for heroku
var PORT = process.env.PORT || 5000;

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static("build"));
//     app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname,  "build", "index.html"));
//     });
// }

//====middleware====//
app.use(cors());
app.use(express.json()); //req.body
//====//


//====ROUTES====//

//register and login routes
app.use("/auth", require("./routes/jwtAuth"));

//user home  route
app.use("/userHomePage", require("./routes/userHomePage"));

//==//


//====INGREDIENT ROUTES====//

//get all ingredients
app.get("/ingredients",async (req, res) => {
    try {
        const allIngredients = await pool.query(
            "SELECT * FROM ingredients"
        )
        res.json(allIngredients.rows);

    } catch (error) {
        console.error(error.message)
    }
})

//get all ingredients off one type
app.get("/ingredients/:type",async (req, res) => {
    try {
        const {type} = req.params;
        const allIngredients = await pool.query(
            "SELECT * FROM ingredients WHERE ing_type = $1", [type]
        );
        res.json(allIngredients.rows);

    } catch (error) {
        console.error(error.message)
    }
})

//get one ingredient by its id
app.get("/ingredients/ingredient/:ingId",async (req, res) => {
    try {
        const {ingId} = req.params;
        const ingredient = await pool.query(
            "SELECT * FROM ingredients WHERE ing_id = $1", [ingId]
        );
        res.json(ingredient.rows);

    } catch (error) {
        console.error(error.message)
    }
})

//==//


//====SANDWICH ROUTES====//

//create empty sandwich
app.post("/sandwiches/:uid/:sandwich_name", async (req, res) => {
    try {
        const uid = req.params.uid;
        const s_name = req.params.sandwich_name;

        //create a new sandwich in user sandwich
        const newSandwich = await pool.query(
            "INSERT INTO user_sandwich (sandwich_name, uid) VALUES ($1, $2) RETURNING *", [s_name, uid]
        );
        res.json(newSandwich)
    } catch (error) {
        console.error(error.message)
    }
})


//insert an ingredient into a sandwich  
app.post("/sandwiches/sandwich/:sandwich_id/:ingredient_id", async (req, res) => {
    try {
        const sandwich_id = req.params.sandwich_id;
        const ingredient_id = req.params.ingredient;

        const newIngredientEntry = await pool.query(
            "INSERT INTO sandwich_ingredients (used_in, ingredient_id) VALUES ($1, $2) RETURNING *", 
            [sandwich_id, ingredient_id]
        );
        res.json(newIngredientEntry)
    } catch (error) {
        console.error(error.message)
    }
})


//get all sandwiches made by the user
//use this and the route that returns all ingredients of sandwich to get all ingredients of a users sandwich
app.get("/sandwiches/:uid" , async (req, res) => {
    try{
        //get sandwich ids
        const {uid}  = req.params;
        const sandwich_ids = await pool.query(
            "SELECT * FROM user_sandwich WHERE uid = $1", [uid]
        )
        res.json(sandwich_ids.rows);
    }catch (error) {
        console.error(error.message)
    }
})

//get the ingredients of a sandwich by its id
app.get("/sandwiches/sandwich/:sandwich_id" , async (req, res) => {
    try{
        const {sandwich_id} = req.params;
        const sandwich_ingr = await pool.query(
            "SELECT * FROM sandwich_ingredients WHERE used_in = $1", [sandwich_id]
        )
         res.json(sandwich_ingr.rows);
    }catch (error) {
        console.error(error.message)
    }
})

//update a specific sandwich made by the user
//REMOVE an ingredient from a sandwich
app.delete("/sandwiches/sandwich/:sandwich_id/:ingredient_id", async (req, res) => {
    try{
        const sandwich_id = req.params.sandwichId;
        const ingredient_id = req.params.ingredient_id;
        const sandwich_ingr = await pool.query(
            "DELETE FROM sandwich_ingredients WHERE used_in = $1 and ingredient_id = $2", 
            [sandwich_id, ingredient_id]
        )
         res.json("Ingredient was removed from the sandwich");
    }catch (error) {
        console.error(error.message)
    }
})

//delete a specific sandwich made by id
app.delete("/sandwiches/sandwich/sandwich_id", async (req, res) => {
    try{
        const sandwich_id = req.params.sandwich_id;
        const sandwich_ingr = await pool.query(
            "DELETE FROM user_sandwich WHERE sandwich_id = $1", 
            [sandwich_id]
        )
         res.json("Sandwich was deleted");
    }catch (error) {
        console.error(error.message)
    }
})

//====//


//====user routes====//

//====//


app.listen(PORT, () => {
    console.log("server has started on port" + PORT)
});
