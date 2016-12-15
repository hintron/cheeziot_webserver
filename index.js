var express = require('express');
var http = require('http');
// var fs = require('fs');
// Header security improvements
var helmet = require('helmet');
// To parse JSON data
var bodyparser = require('body-parser')
// For easy access to the mongodb database
var mongoose = require('mongoose');
// Use bluebird as the promise library for mongoose
mongoose.Promise = require('bluebird');
// See http://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/
// and see http://stackoverflow.com/questions/39333229/mpromise-mongooses-default-promise-library-is-deprecated-error-when-testing

//
//// Models
//
// See http://mongoosejs.com/docs/index.html
// TODO: Create mongoose models
var temp_model = require('./models/temperature.js');

const DB = "kaa";


// Note: if db "pizza" didn't exist, it would still connect, and just create the db when saves
mongoose.connect('mongodb://localhost/' + DB);

mongoose.connection.on('error', console.error.bind(console, 'mongoose connection error:'));
mongoose.connection.once('open', function() {
    // we're connected!
    console.log("Connected to the db via mongoose!");
});

var app = express();


// Use the helmet middleware to shore up some attack vectors
// See https://expressjs.com/en/advanced/best-practice-security.html
// https://www.npmjs.com/package/helmet
app.use(helmet());

app.use(bodyparser.json());
// Use the bodyparser middleware to get the json data


// TODO: Create CRUD endpoints


// app.post('/data', function (req, res, next) {
// Use get instead of post for now, so I can test in browser window
app.get('/data', function (req, res, next) {
    // console.log("Test CRUD endpoint!");
    // TODO: Grab inputs
    // var my_var = req.body.my_var;
    // var sess = req.session;

    // Regarding mongodb injection preventions, read ALL the answers:
    // http://stackoverflow.com/questions/13436467/javascript-nosql-injection-prevention-in-mongodb

    temp_model.find({}, function (err, temp_records) {
        if(err) return console.error(err);
        if(temp_records.length > 0){
            // Filter out the kaa-specific data?
            var data = [];
            for(index in temp_records){
                // console.log(temp_records[index]);
                // console.log(temp_records[index]["event"]);
                data.push(temp_records[index]["event"]);
            }
            res.send(JSON.stringify({
                success: true,
                msg:'Here is all the temperature data:',
                count: temp_records.length,
                data: data,
            }));
        }
        else {
            res.send(JSON.stringify({
                success: false,
                msg:'Could not get the data...',
            }));
        }
    }); // End temp_model callback


});



// Serve public content - set it as the website root
app.use(express.static('public', {
    // extensions: ['html'],
}));


// See https://expressjs.com/en/starter/faq.html
// static simply calls next() when it hits 404, so if nothing catches it, it is not found
app.use(function (req, res, next) {
    res.status(404).sendFile(__dirname + "/public/404.html");
    // Use the following error-generating code to temporarily test 500 errors
    // res.status(404).sendFile("./public/404.htffffff");
});


// Test this by trying to do sendFile with a bad path
// NOTE: If you don't handle this, it defaults to spitting out error info to the client, which can be bad!
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).sendFile(__dirname + "/public/500.html");
});

// redirect http request to https
http.createServer(app).listen(80);


console.log("Nodejs server is up and running!");