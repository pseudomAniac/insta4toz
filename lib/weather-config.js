var weather = require("openweathermap-js"),
	moment = require('moment'),
	q = require('q');

weather.defaults({
	appid: "375cc7f16728bf0dddde9ec5c3a33f0b",
	location: "lae,pg",
	method: "name",
	format: "JSON",
	accuracy: "accurate",
	units: "metric"
});

exports.getCurrent = function (city, callback) {
	// console.log(city)
	weather.current({location: city+",pg"},function (err, data) {
		if (!err) {
			data.dt = moment.unix(data.dt).format("DD MMMM - HH:MM");
			data.sys.sunrise = moment.unix(data.sys.sunrise).format("HH:MM");
			data.sys.sunset = moment.unix(data.sys.sunset).format("HH:MM");
			callback(data);
		}
		else callback(err);
	});
};

exports.getForecast = function (city, callback) {
	weather.daily({location: city+",pg",units:'metric'},function (err, data) {
		// console.log("data.list -",data.list)
		if (!err) {
			sortForecastData(data,(sortedData)=>{
				// console.log("sortedData -",sortedData[0].values);
				callback(null, sortedData);
			})
		}
		else callback(err, null);
	});
};

function sortForecastData(forecastData, callback) {
	var temperature = [], rain = [], humidity = [];
	for (var i=0; i<forecastData.list.length; i++) {
		// temperature.push({x: i, y: forecastData.list[i].temp.day});
		// forecastData.list[i].dt = moment.unix(forecastData.list[i].dt).format('LLL');
		// console.log(forecastData.list[i].dt);
		temperature.push({x: forecastData.list[i].dt, y: forecastData.list[i].temp.max});
		rain.push({x: forecastData.list[i].dt, y: forecastData.list[i].rain});
		humidity.push({x: forecastData.list[i].dt, y: forecastData.list[i].humidity});
	}
	callback([{
				values: temperature,
				key: 'Temp (Celcius)',
				color: 'crimson'
			},{
				values: rain,
				key: 'Rainfall (mm)',
				color: 'coral'
			},{
				values: humidity,
				key: 'Humidity (%)',
				color: 'navy'
			}]);
}
