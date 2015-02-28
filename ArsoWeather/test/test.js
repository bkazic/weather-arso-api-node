var assert = require('assert');
var WeatherArso = require('../');
// TODO: Maybe do unit test with mocha

var weatherArso = new WeatherArso()
//var weatherArso = new WeatherArso({id: 1872})

describe('WeatherArso', function () {
    describe('#weatherData()', function () {
        it('should return weather data for Ljubljana Bezigrad for specific date', function (done) {
            weatherArso.weatherData("2015-02-03", function (err, data) {
                if (err) throw err;
                
                assert.ok(data);
                assert.ok(data.id);
                assert.ok(data.data)
                done();
            });
        });
    });
});