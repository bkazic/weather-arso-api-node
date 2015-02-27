var request = require("request");

// Default parameters when making request
var defaultParams = {
    lang: 'en',
    //vars: [12, 19, 13, 20, 14, 26, 2, 21, 15, 23, 16, 24, 17, 27, 4, 28, 18],
    vars: [12, 19],
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

// Parse requested data to JSON
function parseXmlToJson(data) {
    
    subString = data.substring(data.indexOf("{ baseurl"), data.indexOf("}}}}") + 4)
    subStringFixed = subString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    subStringFixed = subStringFixed.replace("\"HH\"", "HH")
    jsonData = JSON.parse(subStringFixed)

    formatOutput(jsonData)
}


// TODO: comment this function better
function formatOutput(jsonData) {
    var obj = jsonData["points"]["_"+defaultParams.id];
    var outObj = {}
    outObj["list"] = []

    for (var key in obj) {
        var timestamp = parseTimestamp(Number(key.substring(1)))
        var measurements = obj[key]
        
        console.log(timestamp) // TODO: debuging. delete this later.

        var jsonObj = {};
        for (measure in measurements) {
            jsonObj[jsonData["params"][measure]["name"]] = measurements[measure]
        }
        jsonObj["ts"] = timestamp.getTime() / 1000; //convert from ms to s
        jsonObj["dateTime"] = timestamp.getDateTimeString(); //convert from ms to s
        
        //console.log(JSON.stringify(jsonObj));
        outObj["list"].push(jsonObj)
    }
    console.log(JSON.stringify(outObj))
}


// Transforms timestamp from Arso service to date
function parseTimestamp(timestamp) {
    var startDate = new Date("Wed Jan 01 1800 00:00:00 GMT+0100")   
    return new Date(startDate.getTime() + timestamp * 60000);
}


// Format date to DateTime string
Date.prototype.getDateTimeString = function () {
    var year = this.getFullYear();
    var month = ("0" + (this.getMonth() + 1)).slice(-2)
    var day = ("0" + this.getDate()).slice(-2)
    var hour = ("0" + this.getHours()).slice(-2)
    var minutes = ("0" + this.getMinutes()).slice(-2)

    return String(year + "-" + month + "-" + day + " " + hour + ":" + minutes)
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
    