var assert = require('assert');
var WeatherArso = require('../');
// TODO: Maybe do unit test with mocha

var weatherArso = new WeatherArso()

// Request url and display output
weatherArso.weatherData("2015-02-03", function (err, data) {
    if (err) throw err;
    //console.log(data);
})

// Print constructed url
console.log(weatherArso.buildUrl("2015-02-03"))
