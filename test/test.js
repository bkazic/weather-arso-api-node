var assert = require('assert');
var WeatherArso = require('../');
// TODO: Maybe do unit test with mocha

var weatherArso = new WeatherArso()
//var weatherArso = new WeatherArso({id: 1872})

describe('WeatherArso', function () {
    describe('#weatherData()', function () {
        this.timeout(10000); // Increase mocha timeouts

        it('should return weather data for Ljubljana Bezigrad for specific date', function (done) {
            weatherArso.weatherData("2015-02-03", function (err, data) {
                if (err) throw err;
                
                assert.ok(data);
                assert.ok(data.id);
                assert.ok(data.data);
                assert.ok(data.data[0].p);

                done();
            });
        });

        it('should return weather data for specific time period', function (done) {
            weatherArso.weatherData("2015-02-03", "2015-02-04", function (err, data) {
                if (err) throw err;
                
                assert.ok(data);
                assert.ok(data.id);
                assert.ok(data.data);
                assert.ok(data.data[0].p);

                done();
            });
        });

        it('should return weather data with optional parameters', function (done) {
            
            var options = {
                vars: [12, 19, 13, 20, 14, 26, 2, 21, 15, 23, 16, 24, 17, 27, 4, 28, 18],
                id: 2293
            }

            weatherArso.weatherData("2015-02-03", options, function (err, data) {
                if (err) throw err;
                
                assert.ok(data);
                assert.ok(data.id);
                assert.equal(2293, data.id);
                assert.ok(data.data);
                assert.ok(data.data[0].p);
                assert.ok(data.data[0].rh);
                
                done();
            });
        });
    });
});