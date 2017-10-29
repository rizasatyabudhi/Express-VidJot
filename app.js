const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");

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

// methodOverride Middleware
app.use(methodOverride("_method"));

// Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Flash Message Middleware
app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

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

///////////////// CRUD ////////////////

//// CREATE ////
// create form process
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
      req.flash("success_msg", "New Idea Added");
      res.redirect("/ideas");
    });
  }
});

//// READ ////
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    // to match _id from DB with id from URL
    _id: req.params.id
  }).then(idea => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

//// UPDATE ////
// edit form process
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // set new Value from the PUT request form
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "Idea Updated");
      res.redirect("/ideas");
    });
  });
});

//// DELETE ////
app.delete("/ideas/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Idea Deleted");
    res.redirect("/ideas");
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
