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

// Get weather data for specific time
WeatherArso.prototype.weatherData = function (time, callback) {   
    var url = this.buildUrl(time);

    this.makeRequest(url, function (err, data) {
        if (err) return callback(err);
        return callback(null, data);
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

// Make request and parse the result
WeatherArso.prototype.makeRequest = function (url, callback) {
    request(url, function (error, response, body) {
        if (error) return callback(error);
        if (response.statusCode !== 200) throw new WeatherArsoError("Request Failed")
        
        //TODO: parse body here!
        parseXmlToJson(body)
     
        return callback(null, body)
    })
}


function parseXmlToJson(data) {
    
    subString = data.substring(data.indexOf("{ baseurl"), data.indexOf("}}}}") + 4)
    subStringFixed = subString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    subStringFixed = subStringFixed.replace("\"HH\"", "HH")
    jsonData = JSON.parse(subStringFixed)

    formatOutput(jsonData)
}

function formatOutput(jsonData) {
    var obj = jsonData["points"]["_1828"];
    
    for (var key in obj) {
        //console.log(' name=' + key + ' value=' + JSON.stringify(obj[key]));
        console.log(parseTimestamp(Number(key.substring(1))))
    }
}


// Transforms timestamp from Arso service to date
function parseTimestamp(timestamp) {
    var startDate = new Date("Wed Jan 01 1800 00:00:00 GMT+0100")   
    return new Date(startDate.getTime() + timestamp * 60000);
}


// Custom Error message
function WeatherArsoError(msg) {
    this.name = "WeatherArsoError"
    this.message = msg
    this.toString = function () {
        return this.name + ": " + this.message;
    }
}

// Exports
module.exports = WeatherArso;
    