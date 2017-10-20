if(process.env.NODE_ENV === 'production'){
    module.exports= {mongoURI: 'mongodb://sameer:darkknight1@ds125555.mlab.com:25555/ideapad-prod'};
} else{
    module.exports = {mongoURI: 'mongodb://localhost/ideapad-dev'};
}