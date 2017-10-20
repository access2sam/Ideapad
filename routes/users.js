var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var router = express.Router();

//LOad user Model
require('../models/User');
var User = mongoose.model('users');


//users login route
router.get(`/login`, function(req, res){
    res.render('users/login');
});

//users registration route
router.get(`/register`, function(req, res){
    res.render('users/register');
});

//Login with filled form data using post method
router.post('/login', function(req, res, next){
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//Register form POST
router.post('/register', function(req, res){
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'passwords do not match'});
    }
    if(req.body.password.length < 5){
        errors.push({text: 'Password must be atleast 5 characters'})
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else{
        User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                req.flash('error_msg', 'Email already exists');
                res.redirect('/users/register');
            }
            else{

                var newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                 });
                 bcrypt.genSalt(10, function(err,salt){
                     bcrypt.hash(newUser.password,salt,function(err, hash){
                         if(err) throw err;
                         newUser.password = hash;
                         newUser.save()
                         .then(user => {
                            req.flash('success_msg', 'Registration successfull');
                            res.redirect('/users/login');
                         });
                     });
                 });
            }
        });
       
        
        //res.send("Passed");
    }
});

//Logout route
router.get('/logout',function(req, res){
    req.logOut();
    req.flash('success_msg', 'Bye, See you soon');
    res.redirect('/users/login');
   
   });

module.exports = router;