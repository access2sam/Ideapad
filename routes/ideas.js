var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var {ensureAuthenticated} = require('../helpers/auth');

  //Load Idea model
  require("../models/Idea.js");
  const myIdea = mongoose.model("ideas");

//Idea index page
router.get(`/`, ensureAuthenticated,function(req, res){
    myIdea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render(`./ideas/index`,{
            ideas: ideas
        });
    });
})


//Add idea form
router.get(`/add`, ensureAuthenticated,(req, res) => {
    res.render("ideas/add");
 });

 //Edit idea form
router.get(`/edit/:id`, ensureAuthenticated,(req, res) => {
    myIdea.findOne({
        _id: req.params.id
    })
    .then(idea=>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render("ideas/edit", {
                idea:idea
            });
        }
       
    });
 });

 //Process form to submit idea
  router.post(`/`,ensureAuthenticated,function(req, res){
    let errors = [];

    if(!req.body.title){
        errors.push({
            text: "Please add a title"
        });
    }
    if(!req.body.description){
        errors.push({text: "Please add a desription"})
    }
    if(errors.length > 0){
        res.render(`ideas/add`, {
            errors: errors,
            title: req.body.title,
            description: req.body.description
        });
    } else{
        var newUser = {
            title: req.body.title,
            description: req.body.description,
            user: req.user.id
        }
        new myIdea(newUser)
        .save()
        .then(idea=>{
            req.flash('success_msg', 'Idea added');
            res.redirect('/ideas');})
    }
});

//Edit ideas form
router.put('/:id', ensureAuthenticated,function(req, res){
    myIdea.findOne({
        _id: req.params.id
    })
        .then(idea=>{
            //New values to be updated in existing idea card
            idea.title = req.body.title,
            idea.description = req.body.description

            idea.save()
            .then(idea=>{
                req.flash('success_msg', 'Idea updated');
                res.redirect('/ideas')
            })
        })
}); 

//Delete Ideas
router.delete('/:id', ensureAuthenticated,function(req, res){
    myIdea.remove({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Idea removed');
        res.redirect('/ideas');
    })
});


module.exports = router;