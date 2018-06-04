var weather = require("openweather-apis"),
	moment = require('moment'),
	q = require('q');

// weather.defaults({
	weather.setAPPID("375cc7f16728bf0dddde9ec5c3a33f0b");
	weather.setCity("lae");
	weather.setLang("en");
	// weather.setFormat("JSON");
	weather.setUnits("metric");
	// cnt: 10,
	// weather.setCoordinate: {
	// 	lat: 35,
	// 	lon: 139
	// },
	// weather.setmethod: "name";
	// weather.setaccuracy: "accurate";
// });

exports.getCurrent = function (city, callback) {
	weather.setCity(city+",pg");
	weather.getAllWeather(function (err, data) {
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
	log(coordinates);
	// weather.setCity("");
	weather.setCoordinate(coordinates.lat,coordinates.lon);
	weather.getAllWeather(function(err,data){
		if(!err){
			log("data", data);
			callback(data);	
		}
	});
}

exports.getWeatherSummary = function(coordinates,callback) {
	weather.setCoordinate(coordinates.lat,coordinates.lon);
	weather.getSmartJSON((err,data)=>{
		if (!err) { 
			// log('summary weather',data);
			callback(data);
		} else {
			callback(err);
		}
	});
}

exports.getForecast = function (city, callback) {
	weather.setCity(city+',pg');
	weather.getWeatherForecastForDays(3,function (err, data) {
		// console.log("data.list -",data.list)
		// log("getForecastdata",data.list);
		// if (data.list.weather) log("getForecastdata",data.list.weather);
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
		temperature.push({x: forecastData.list[i].dt, y: forecastData.list[i].temp.day});
		// console.log('raindance -',forecastData.list[i].rain['3h'])
		if (forecastData.list[i].rain) {
			rain.push({x: forecastData.list[i].dt, y: Math.round(forecastData.list[i].rain)});
		} else {
			rain.push({x: forecastData.list[i].dt, y: 0});
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

function log(stuff) {
	return console.log(stuff);
}

function log(stufftitle,stuff) {
	return console.log(stufftitle,stuff);
}
