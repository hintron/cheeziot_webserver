var mongoose = require('mongoose')

console.log("ImageModel");

var image_schema = mongoose.Schema({
    image: {
        type: Buffer,
        required: true,
    },
    name : {
        type: String,
        required: true,
    }
});

var ImageModel = mongoose.model('test_images', image_schema);

module.exports = ImageModel;

