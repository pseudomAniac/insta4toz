var express = require("express");
var app = express();
var weather = require("openweather-apis");
var http = require('http');
var q = require('q');

weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID('375cc7f16728bf0dddde9ec5c3a33f0b');
weather.setCity('lae');

app.get('/template', function(req,res) {
	res.render('pages/template');
});

app.get('/', function (req, res) {
	weather.getAllWeather(function(err,data) {
		console.log(data);
		res.render('pages/weather',{weda: data});
	});
});

app.get('/api/weather/?', function (req, res) {
	var city = req.query.city;
	console.log(req.query)
	weather.setCity(city)

	// first get data from wikimedia and return to next (callback) function
	// then get data from openweathermap.org, add it into a data object and pass it to the rendering (callback) function
	// finally render the page with the passed data

	//first
	function getWiki(cityWiki) {
		https.get('https://en.wikipedia.org/w/api.php?action=query&titles='+cityWiki+'&prop=info&format=jsonfm', function(wikiData) {
			console.log('wikiData');
			return wikiData;
		})
	};

	// then
	function getWeather() {
		weather.getAllWeather(function(err, weatherData) {
			console.log(weatherData.cod);
			res.render('pages/weather',{weda: weatherData, wida: null});
			// return weatherData;
		});
	}

	// finally
	function renderPage(weatherInfo, wikiInfo) {
		console.log(weatherInfo,wikiInfo)
		res.render('pages/weather',{weda: weatherInfo, wida: wikiInfo});
	}

	// use q to bind them all together
	getWeather();
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});