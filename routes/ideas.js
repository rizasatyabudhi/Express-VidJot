const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

// Load Idea model
require("../models/Idea");
const Idea = mongoose.model("ideas");

// We don't need /ideas anymore in the router.get/post
// but we still need /ideas in the res.render

// Ideas index page
router.get("/", (req, res) => {
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


// Add idea form
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

///////////////// CRUD ////////////////

//// CREATE ////
// create form process
router.post("/", (req, res) => {
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
    const newIdea = {
      title: req.body.title,
      details: req.body.details
    };
    new Idea(newIdea).save().then(idea => {
      req.flash("success_msg", "New Idea Added");
      res.redirect("/");
    });
  }
});

//// READ ////
router.get("/edit/:id", (req, res) => {
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
router.put("/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // set new Value from the PUT request form
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash("success_msg", "Idea Updated");
      res.redirect("/");
    });
  });
});

//// DELETE ////
router.delete("/:id", (req, res) => {
  Idea.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Idea Deleted");
    res.redirect("/");
  });
});


module.exports = router;