var mongoose = require('mongoose')

console.log("ImageModel");

var image_schema = mongoose.Schema({
   event: {
        person_name: {
            type: String,
            required: true,
        },
    },
});

var ImageModel = mongoose.model('logs_99957758195164324594', image_schema);

module.exports = ImageModel;

