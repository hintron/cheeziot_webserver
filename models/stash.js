var mongoose = require('mongoose')

var stash_schema = mongoose.Schema({
    image: {
        type: Buffer,
        required: true,
    },
    name : {
        type: String,
        required: true,
    }
});

var StashModel = mongoose.model('test_images', stash_schema);

module.exports = StashModel;

