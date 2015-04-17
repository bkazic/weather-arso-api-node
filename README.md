# ARSO Weather

[![Build Status](https://travis-ci.org/bkazic/weather-arso-api-node.svg?branch=master)](https://travis-ci.org/bkazic/weather-arso-api-node)

Slovenian historical and current weather data. Arso archive wrapper for node.
http://meteo.arso.gov.si/met/sl/archive/

### Installation

```
npm install arso-weather
```

### Usage

```javascript
var WeatherArso = require('arso-weather');
var weatherArso = new WeatherArso()

weatherArso.weatherData("2015-02-03", "2015-02-04", function (err, data) {
    if (err) throw err;
    console.log(data.data);
})
```