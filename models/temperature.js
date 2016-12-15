var mongoose = require('mongoose')

console.log("TemperatureModel");

var temperature_schema = mongoose.Schema({
    // This isn't required for reading in the data records, but it might be needed for creating records in mongoose
    // At least it helps format date strings into date objects
    event: {
        temperature: {
            type: Number,
            default: 1,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
    },
    // ip_address: {
    //     type: String,
    //     required: true,
    // },
});

var TemperatureModel = mongoose.model('logs_92888412929238858988', temperature_schema);

module.exports = TemperatureModel;

