var express = require('express');
var http = require('http');
var fs = require('fs');
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
var image_model = require('./models/image.js');

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

    temp_model.find({}, function(err, temp_records) {
        if(err) return console.error(err);
        if(temp_records.length > 0){
            // Filter out the kaa-specific data?
            var data = [];
            for(var index in temp_records){
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

//Pull an image from the Mongo database and send it to the client
app.get('/image', function (req, res, next) {

    var PythonShell = require('python-shell');

    //python script extracts an image from the MongoDB and saves it as test_out.bmp
    PythonShell.run('scripts/m2.py', function (err) {
        if (err){
            throw err;
        }
        else {
            res.sendFile('public/images/test_out.bmp', {root: __dirname},
                function(err){
                    if(err) {
                        console.log("Error reading image");
                        return;
                    }
                    //delete the image from the local filesystem
                    fs.unlink("public/images/test_out.bmp", function(err){
                        if(err){
                            console.log("Error: could not delete image");
                        }
                    });
                }
            );
        }
    });
});


// Proof-of-concept - storing and retrieving an image from MongoDB!

// TODO: Is it worth it to save images in MongoDB with Kaa?
// Will we gain from Kaa's redundancy protections here?
// Or would it be simpler to merely store the path to an image, and store the images into folders in the file system?

// stash all files in the images folder
// Stores the files in "public/images/" in the db and deletes the left-over files
app.get('/stash', function (req, res, next) {
    var image_folder = __dirname + "/public/images/"

    // Read all files in the image folder
    fs.readdir(image_folder, function(err, files){
        if (err){
            console.error(err);
            res.send("Cannot open images folder");
            return;
        }

        // See http://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
        var itemsProcessed = 0;

        files.forEach(function(image){
            console.log(image);

            fs.readFile(image_folder + image, function(err, data) {
                if (err){
                    console.error(err);
                    res.send("Cannot stash image " + image + ". Perhaps it doesn't exist?");
                    return;
                }

                // console.log(data);
                var record = new image_model({
                    image: data,
                    name: image
                });
                record.save(function(err, saved_record) {
                    if(err){ return console.error(err) };

                    // Delete the image file
                    fs.unlink(image_folder + image, function(){
                        console.log("Deleted file " + image);

                        itemsProcessed++;
                        // Since this is all asynchronous and in parallel, we only want to send the http response once
                        // So don't send it until the last one finishes up!
                        if(itemsProcessed == files.length){
                            console.log("All images stashed");
                            res.send("all images stashed and saved!");
                            // return;
                        } else {
                            // console.log(itemsProcessed + " < " + files.length);
                        }
                    });

                });
            });
        });


    });
});



// Un-stash or pop all the images in the db into the images folder
app.get('/retrieve', function (req, res, next) {
    var image_folder = "images/";
    var image_path = __dirname + "/public/" + image_folder;

    image_model.find({}, function (err, records) {
        if(err) return console.error(err);
        console.log(records.length);
        if(records.length <= 0){
            res.send("No more image records to retrieve");
            return;
        }

        // console.log(records);

        var html = "Hello!";
        var itemsProcessed = 0;
        records.forEach(function(record){

            // See https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
            fs.writeFile(image_path + record.name, record.image, function () {
                // Create an img tag
                html += '<img src="' + image_folder + record.name + '"></img>';
                // delete image record
                image_model.remove({_id:record._id}, function(){
                    console.log("Popped off image and deleted image record " + record.name);

                    itemsProcessed++;
                    // If processing the last one, send the response
                    if(itemsProcessed == records.length){
                        res.send(html);
                        // return;
                    }
                });
            });

        })

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
http.createServer(app).listen(8080);


console.log("Nodejs server is up and running!");