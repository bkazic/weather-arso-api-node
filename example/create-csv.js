var assert = require('assert');
var fs = require('fs');
var json2csv = require('json2csv');
var WeatherArso = require('../');

//var weatherArso = new WeatherArso()
var weatherArso = new WeatherArso({ vars: [12, 18] })

weatherArso.weatherData("2015-02-03", function (err, data) {
    if (err) throw err;
    
    var headerData = ["dateTime"]
    data.header.forEach(function (element) {
        headerData.push(element.name);
    })

    json2csv({ data: data.data, fields: headerData }, function (err, csv) {
        if (err) console.log(err);
        fs.writeFile('./example/file.csv', csv, function (err) {
            if (err) throw err;
            console.log('file saved');
        });
    });

})
