var mongoose = require("mongoose");
var schema = mongoose.Schema;

//Create Schema
var UserSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required : true
    },
    password:{
        type: String,
        required : true
    },
    date:{
        type:Date,
        default: Date.now   
    }
});
mongoose.model("users", UserSchema);