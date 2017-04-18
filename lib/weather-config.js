var weather = require("openweathermap-js"),
	moment = require('moment'),
	q = require('q');

weather.defaults({
	appid: "375cc7f16728bf0dddde9ec5c3a33f0b",
	location: "Lae",
	method: "name",
	format: "JSON",
	accuracy: "accurate",
	units: "metric"
});

exports.getCurrent = function (city, callback) {
	// console.log(city)
	weather.current({location: city},function (err, data) {
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
	weather.daily({location: city},function (err, data) {
		console.log("data.list -",data.list.length)
		if (!err) {
			sortForecastData(data,(sortedData)=>{
				console.log("sortedData -",sortedData);
				callback(null, "sortedData");
			})
		}
		else callback(err, null);
	});
};

function sortForecastData(forecastData) {
	var threeHourly = [];
	for (var i=0; i<forecastData.list.length; i++) {
		// threeHourly.push({x: i, y: forecastData.list[i].temp.day});
		threeHourly.push({x: forecastData.list[i].dt, y: forecastData.list[i].temp});
	}
	return {
		values: threeHourly,
		key: 'Date',
		color: 'cadetblue'
	};
}
