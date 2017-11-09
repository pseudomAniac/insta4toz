var weather = require("openweathermap-js"),
	moment = require('moment'),
	q = require('q');

weather.defaults({
	appid: "375cc7f16728bf0dddde9ec5c3a33f0b",
	location: "lae,pg",
	// cnt: 10,
	// coord: {
	// 	lat: 35,
	// 	lon: 139
	// },
	method: "name",
	format: "JSON",
	accuracy: "accurate",
	units: "metric"
});

exports.getCurrent = function (city, callback) {
	weather.current({location: city+",pg"},function (err, data) {
		if (!err) {
			data.dt = moment.unix(data.dt).format("DD MMMM - HH:MM");
			// data.sys.sunrise = moment.unix(data.sys.sunrise).format("HH:MM");
			// data.sys.sunset = moment.unix(data.sys.sunset).format("HH:MM");
			callback(data);
		}
		else callback(err);
	});
};

exports.getCurrentCoord = (coordinates, callback)=>{
	weather.current({location: null, coord:{lat:coordinates.lat,lon:coordinates.long}},(err,data)=>{
		if(!err){
			data.dt = moment.unix(data.dt).format("DD MMMM - HH:MM");
			callback(data);
		} else callback(err);
	})
}

exports.getForecast = function (city, callback) {
	weather.forecast({location: city+",pg"},function (err, data) {
		// console.log("data.list -",data.list)
		if (!err) {
			sortForecastData(data,(sortedData)=>{
				// console.log("getForecast -",data.list[0],'\n',data.list[1],'\n',data.list[2]);
				callback(null, sortedData);
			})
		}
		else callback(err, null);
	});
};

function sortForecastData(forecastData, callback) {
	var temperature = [], rain = [], humidity = [], pressure = [];
	for (var i=0; i<forecastData.list.length; i++) {
		// temperature.push({x: i, y: forecastData.list[i].temp.day});
		// forecastData.list[i].dt = moment.unix(forecastData.list[i].dt).format('LLL');
		// console.log(forecastData.list[i].dt);
		temperature.push({x: forecastData.list[i].dt, y: forecastData.list[i].main.temp});
		// console.log('raindance -',forecastData.list[i].rain['3h'])
		if (forecastData.list[i].rain['3h'] === undefined || forecastData.list[i].rain['3h'] === null) {
			rain.push({x: forecastData.list[i].dt, y: 0});
		} else {
			rain.push({x: forecastData.list[i].dt, y: Math.round(forecastData.list[i].rain['3h'])});
		}
		// humidity.push({x: forecastData.list[i].dt, y: forecastData.list[i].main.humidity});
		// pressure.push({x: forecastData.list[i].dt, y: forecastData.list[i].main.pressure});
	}
	callback([{
				key: 'Temp (&deg;C)',
				values: temperature,
				color: 'gold',
				type: 'line'
			},{
				key: 'Rain (mm)',
				values: rain,
				color: 'dodgerblue',
				type: 'pie'
			}]);
}
