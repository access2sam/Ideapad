var mongoose = require("mongoose");
var schema = mongoose.Schema;

//Create Schema
var IdeaSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required : true
    },
    user:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        default: Date.now   
    }
});
mongoose.model("ideas", IdeaSchema);