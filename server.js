require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const Animal = require('./models/animals.js')
// Database Connection
const DATABASE_URL = process.env.DATABASE_URL

const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

const {Schema, model} = mongoose




//Create our Express Application Object
/////////////////////////////////////////////////
const app = express()

//Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.urlencoded({extended: true})) // parse urlencoded request bodies
app.use(express.static("public")) // serve files from public statically


app.get("/", (req, res) => {
    res.send("your server is running... better catch it.")
})

app.get("/animals/seed", async (req, res) => {

    const startAnimals = [
        {species: "Lion", extinct: Boolean, location: "Africa" , lifeExpectancy: 10},
        {species: "Armadillo", extinct: Boolean, location: "SouthAmerica", lifeExpectancy: 20},
        {species: "Monkey", extinct: Boolean, location: "Africa", lifeExpectancy: 40},
        {species: "Eagle", extinct: Boolean, location: "Eurasia", lifeExpectancy: 30},
        {species: "Snake", extinct: Boolean, location: "Laurasia", lifeExpectancy: 30},
    ];
  
    await Animal.deleteMany({})
    const createdAnimals = await Animal.create(startAnimals)
    res.json(createdAnimals)
  });

  //index

  app.get("/animals", async (req, res) => {
    const themAnimals = await Animal.find({})

    res.render("animals/index.ejs", { animals: themAnimals })
  });

  //new
app.get("/animals/new", (req, res) => {
    res.render("animals/new.ejs");
  });
  
//update
app.post("/animals", async (req, res) => {
    req.body.extinct = req.body.extinct === "on" ? true : false
    await Animal.create(req.body)
    res.redirect("/animals")
  }); 

  //edit
app.get("/animals/:id/edit", async(req, res)=>{
const id = req.params.id 
const animal = await Animal.findById(id)
  res.render("animals/edit.ejs", {animal})
  })
  

//show
app.get("/animals/:id", async (req, res) => {
    const id = req.params.id
    const animal = await Animal.findById(id)
  
    res.render("animals/show.ejs", { animal })
});







    // // Delete all animals
    // Animal.remove({}, (err, data) => {
    //       // Seed Starter Animals
    //     Animal.create(startAnimals,(err, data) => {
    //         // send created animals as response to confirm creation
    //         res.json(data);
    //       }
    //     );
    // //   });
    // });


const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))