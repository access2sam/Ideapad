var express = require("express");
var exphbs = require("express-handlebars");
var path = require('path');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var app = express();

//Load routes
var ideas = require('./routes/ideas');
var users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config load
var dbs = require('./config/database');



//map global promise- rid of warnings
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(dbs.mongoURI,{
  useMongoClient:true}).then(()=> console.log("MongoDB connected..")).catch(err => console.log(err));


//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname,'public')));

//method override middleware for PUT or DELETE request
app.use(methodOverride('_method'));

//middleware for express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//index route
app.get(`/`, function(req , res){
    var title = "A notepad for ideas"
   res.render('index', {
       title: title
   });
});

//about route
app.get(`/about`, (req, res) => {
   res.render("about");
});

//use custom routes
app.use('/ideas', ideas);
app.use(`/users`, users);


var port = process.env.port || 3000;

app.listen(port, function(){
    console.log(`The server is running on port ${port}`);
});