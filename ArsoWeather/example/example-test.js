var assert = require('assert');
var WeatherArso = require('../');

var weatherArso = new WeatherArso()
//var weatherArso = new WeatherArso({id: 1872})

// Test default parameters.
console.log(JSON.stringify(weatherArso.params))

// Request url and display output
weatherArso.weatherData("2015-02-03", function (err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data));
})

// Test constructed url
console.log(weatherArso.buildUrl("2015-02-03"))

// Test request with start day and end day
weatherArso.weatherData("2015-02-03", "2015-02-04", function (err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data));
})

// Testing with options
var options = {
    vars: [12, 19, 13, 20, 14, 26, 2, 21, 15, 23, 16, 24, 17, 27, 4, 28, 18],
    id: 2293
}

weatherArso.weatherData("2015-02-03", options, function (err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data));
})

console.log(JSON.stringify(weatherArso.params))


// Request url and display output
weatherArso.weatherData("2015-02-03", function (err, data) {
    if (err) throw err;
    //console.log(JSON.stringify(data));
})

console.log(JSON.stringify(weatherArso.params))
