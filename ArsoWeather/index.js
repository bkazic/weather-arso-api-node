var request = require("request");

// Default parameters when making request
var defaultParams = {
    lang: 'en',
    vars: [12, 19, 13, 20, 14, 26, 2, 21, 15, 23, 16, 24, 17, 27, 4, 28, 18],
    group: 'halfhourlyData0',
    type: 'halfhourly',
    id: 1828 // Ljubljana - Bezigrad
};

// Main object
function WeatherArso() {
    this.baseUrl = "http://meteo.arso.gov.si/webmet/archive/data.xml";
}

// Make weather request for specific time
WeatherArso.prototype.weather = function (time, callback) {   
    var url = this.buildUrl(time);

    request(url, function (error, response, body) {
        if (error) return callback(error);
        return callback (null, body)
    })
}

// TODO: Find better way to construct url (something like string format in python)
// Build url request for specific time
WeatherArso.prototype.buildUrl = function (time) {
    var url = this.baseUrl + "?lang=" + defaultParams.lang + "&vars=" + 
        defaultParams.vars.toString() + "&group=" + defaultParams.group + 
        "&type=" + defaultParams.type + "&id=" + defaultParams.id + 
        "&d1=" + time + "&d2=" + time

    return url
}

// Exports
module.exports = WeatherArso;
    