var weather = require("openweathermap-js");

weather.defaults({
	appid: "375cc7f16728bf0dddde9ec5c3a33f0b",
	location: "Lae",
	method: "name",
	format: "JSON",
	accuracy: "accurate",
	units: "metric"
});

exports.getCurrent = function (city, callback) {
	weather.current({location: city},function (err, data) {
		if (!err) callback(null, data);
		else res.send(err, null);
	});
};

exports.getForecast = function (city, callback) {
	weather.daily({location: city},function (err, data) {
		if (!err) callback(null, data);
		else callback(err, null);
	});
};