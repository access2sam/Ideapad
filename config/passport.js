var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Load user model
require('../models/User');
var User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'},function(email, password,done){
        //Match user
       User.findOne({
           email: email
        }).then(user=>{
           if(!user){
            return done(null, false, {message:'User not found'});
           }

           //Match passwords with the hashed passwords stored in db
           bcrypt.compare(password,user.password,function(err, isMatch){
               if(err) throw err;
               if(isMatch){
                return done(null, user);
               } else{
                return done(null, false, {message: 'Password incorrect'});
               }
           });
       })
    }));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
}