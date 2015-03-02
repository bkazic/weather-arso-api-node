var assert = require('assert');
var WeatherArso = require('../');

//var weatherArso = new WeatherArso()
var weatherArso = new WeatherArso({vars: [12,18]})
//var weatherArso = new WeatherArso({id: 1872})

var i = 0;
var startDate = new Date("2015-01-03")
var endDate = new Date("2015-02-06")

var callback = function (err, data) {
    if (err) throw err;
    console.log(JSON.stringify(data.data));

    var date = startDate.addDays(i++)
    if (date.setHours(0,0,0,0) === endDate.setHours(0,0,0,0)) return;
    weatherArso.weatherData(date.getDateString(), callback)
};

// Request url and display output
weatherArso.weatherData(startDate.getDateString(), callback)