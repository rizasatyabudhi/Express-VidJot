const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

///// MONGOOSE CONFIG //////////////
// Map global promise - get rid of depricated warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose
  .connect("mongodb://localhost/vidjot-dev", {
    useMongoClient: true
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(error => {
    console.log(error);
  });

// Load Idea model
require("./models/Idea");
const Idea = mongoose.model("ideas");

/////// MIDDLEWARES //////
// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// bodyParser Middleware
// bodyParser is required to access submitted data from client
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//////// ROUTES ////////
app.get("/", (req, res) => {
  res.render("index");
});

// Ideas index page
app.get("/ideas", (req, res) => {
  // res.render("ideas");
  Idea.find({})
    .sort({ date: "desc" })
    .then(ideas => {
      // this is so our view can access "ideas"
      res.render("ideas/index", {
        ideas: ideas
      });
    });
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

// Add idea form
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

// Process Form
app.post("/ideas", (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newUser).save().then(idea => {
      res.redirect("/ideas");
    });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
