﻿var request = require("request");
var xml2js = require('xml2js');

// Default parameters when making request
var defaultParams = {
    lang: 'en',
    vars: [12, 19, 13, 20, 14, 26, 2, 21, 15, 23, 16, 24, 17, 27, 4, 28, 18],
    group: 'halfhourlyData0',
    type: 'halfhourly',
    id: 1828 // Ljubljana - Bezigrad
};

// Main object
function WeatherArso(options) {
    this.baseUrl = "http://meteo.arso.gov.si/webmet/archive/data.xml";
    
    if (typeof options !== "undefined") this.checkOptions(options);
    this.params = defaultParams;
}

// Get weather data for specific time
WeatherArso.prototype.weatherData = function (time, time2, options, callback) {
    var d1 = time;
    var d2 = time2;
    
    if (typeof time2 === "function") {
        callback = time2;
        d2 = time;
        options = {};
    }
    
    if (typeof time2 === "object") {
        callback = options;
        d2 = time;
        options = time2;
    }
    
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    
    //TODO: Check Options!! 
    this.checkOptions(options, true);

    var url = this.buildUrl(d1, d2);
    this.makeRequest(url, function (err, data) {
        if (err) return callback(err);
        return callback(null, data);
    })
}

// TODO: Find better way to construct url (something like string format in python)
// Build url request for specific time
WeatherArso.prototype.buildUrl = function (d1, d2) {
    var url = this.baseUrl + "?lang=" + this.params.lang + "&vars=" + 
        this.params.vars.toString() + "&group=" + this.params.group + 
        "&type=" + this.params.type + "&id=" + this.params.id + 
        "&d1=" + d1 + "&d2=" + d2

    return url
}

// Check if any of options key are the same as in defaultParams. If yes, overwrite their value.
WeatherArso.prototype.checkOptions = function (options, copy) {
    // If copy is false, newParams will copy reference from defaultParams and make permanent change.
    var newParams = (copy === true) ? JSON.parse(JSON.stringify(defaultParams)) : defaultParams; 
    for (key in defaultParams) {
        if (options[key]) {
            newParams[key] = options[key];
        }
    }
    this.params = newParams;
}

// Make request and parse the result
WeatherArso.prototype.makeRequest = function (url, callback) {
    request(url, function (error, response, body) {
        if (error) return callback(error);
        if (response.statusCode !== 200) throw new WeatherArsoError("Request Failed")
        
        //data = parseBody(body)
        data = formatOutput(body)
     
        return callback(null, data)
    })
}

// Parse requested data body to JSON
function parseBody(data) {
    
    subString = data.substring(data.indexOf("{ baseurl"), data.indexOf("}}}}") + 4)
    subStringFixed = subString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    subStringFixed = subStringFixed.replace("\"HH\"", "HH")
    bodyData = JSON.parse(subStringFixed)

    //return formatOutput(jsonData)
    return bodyData
}

// Parse requested data header to JSON
function parseHeader(data) {
    
    var parser = new xml2js.Parser();
    var headerData = []

    parser.parseString(data, function (err, result) {
        var arr = result.pujs.params[0].p;
        arr.forEach(function (element) {
            headerData.push(element["$"])   
        })
    });

    return headerData;
}

// TODO: comment this function better
function formatOutput(body) {
    
    var header = parseHeader(body);
    var bodyJson = parseBody(body);

    var id = Object.keys(bodyJson["points"])[0];
    var obj = bodyJson["points"][id];
    var outObj = {};
    
    outObj["id"] = Number(id.substring(1));
    outObj["data"] = [];
    outObj["header"] = header; //TODO

    for (var key in obj) {
        var timestamp = parseTimestamp(Number(key.substring(1)))
        var measurements = obj[key]
        var jsonObj = {};

        jsonObj["ts"] = timestamp.getTime() / 1000; //convert from ms to s
        jsonObj["dateTime"] = timestamp.getDateTimeString(); //convert from ms to s

        for (measure in measurements) {
            jsonObj[bodyJson["params"][measure]["name"]] = measurements[measure];
        }
        
        outObj["data"].push(jsonObj);
    }
    return outObj;
}

// Transforms timestamp from Arso service to date
function parseTimestamp(timestamp) {
    var startDate = new Date("Wed Jan 01 1800 00:00:00 GMT+0100")   
    return new Date(startDate.getTime() + timestamp * 60000);
}

// Format date to Date string
Date.prototype.getDateString = function () {
    var year = this.getFullYear();
    var month = ("0" + (this.getMonth() + 1)).slice(-2)
    var day = ("0" + this.getDate()).slice(-2)
    
    return String(year + "-" + month + "-" + day)
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

// Function to add days to date
Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

// Custom Error message 
// (ref: http://j-query.blogspot.si/2014/03/custom-error-objects-in-javascript.html)
function WeatherArsoError(msg) {
    Error.captureStackTrace(this);
    this.message = msg;
    this.name = "WeatherArsoError";
}
WeatherArsoError.prototype = Object.create(Error.prototype);

// Exports
module.exports = WeatherArso;
    