var mongoose = require('mongoose')

console.log("StatisticsModel");

var statistics_schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    recognized_count: {
        type: Number,
        required: true,
    },
    last_time : {
        type: String,
        required: true,
    },
    last_location : {
        type: String,
        required: true,
    }
});

var StatisticsModel = mongoose.model('statistics', statistics_schema);

module.exports = StatisticsModel;

