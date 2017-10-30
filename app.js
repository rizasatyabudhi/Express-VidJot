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

// Load Routes
const ideas = require('./routes/ideas')
// wires up ideas route
// everything
app.use('/ideas',ideas);

//////// ROUTES ////////
app.get("/", (req, res) => {
  res.render("index");
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

app.get('/users/login',(req,res)=>{
  res.send('Login')
})

app.get('/users/register',(req,res)=>{
  res.send('Register')
})

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
