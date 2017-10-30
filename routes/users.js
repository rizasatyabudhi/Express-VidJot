const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

require('../models/User')
const User = mongoose.model('users')

router.get('/login',(req,res)=>{
  res.render('users/login')
})

router.get('/register',(req,res)=>{
  res.render('users/register')
})

router.post('/register',(req,res)=>{
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text:'Password do not match!'})
  }
  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'})
  }

  if(errors.length > 0){
    res.render('users/register',{
      // when there are error, the form will not be cleared
      // it will use the previous value
      errors:errors,
      name:req.body.name,
      password:req.body.password,
      password2:req.body.password2
    })
  } else {
    res.send('Pass')
  }
  // const newUser = {
  //   name:req.body.title,
  //   email:req.body.email,
  //   password:req.body.password
  // }
  // new User(newUser).save().then(user=>{
  //   req.flash("success_msg","Register Success")
  //   res.redirect('/')
  // })
  console.log(req.body)
  res.send('register')
})

module.exports = router