var assert = require('assert');
var fs = require('fs');
var json2csv = require('json2csv');
var WeatherArso = require('../');

//var weatherArso = new WeatherArso()
var weatherArso = new WeatherArso({ vars: [12, 18] })

var i = 1;
var fileName = './example/file2.csv';
var startDate = new Date("2015-02-03")
var endDate = new Date("2015-02-06")


var callback = function (err, data) {
    if (err) throw err;

    json2csv({ data: data.data, fields: ['dateTime', 'p', 'rh'] }, function (err, csv) {
        if (err) console.log(err);

        var callback2 = function (err) {
            if (err) throw err;
            console.log('file for day ' + date.getDateString() + ' saved.');
        }

        if (i == 1) { 
            fs.writeFile(fileName, csv, callback2);
        } else {
            csv = csv.replace(/[\w\W]+?\n+?/, "\n");
            fs.appendFile(fileName, csv, callback2);
        }
    });
    
    var date = startDate.addDays(i++)
    if (date.setHours(0, 0, 0, 0) > endDate.setHours(0, 0, 0, 0)) return;
    weatherArso.weatherData(date.getDateString(), callback)
};

// Request url and display output
weatherArso.weatherData(startDate.getDateString(), callback)
 