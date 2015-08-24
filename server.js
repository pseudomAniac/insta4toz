var express = require("express");
var app = express();
var ig = require("instagram-node").instagram();
var weather = require("openweather-apis");

app.use(express.static(__dirname + "/public"));

app.set('view engine','ejs');

app.get('/', function(req,res){
	// res.render('pages/index');
	ig.media_popular(function(err, medias, remaining, limit) {
		res.render('pages/index', {grams: medias});
	});
});

app.get('/newguinea', function(req,res){
	ig.media_search(-6.733543, 147.001667, 5000, function(err, medias, remaining, limit) {
		res.render('pages/newguinea', {grams: medias});
	});
});

ig.use({
	client_id: '70267f0181bb4fd6a81440f0f0939b76',
	client_secret: 'bd71b76f1912441dac0d5d4850b65826'
});

app.get('/weather', function(req,res) {

	// setter methods
	weather.setLang('en');
	weather.setCity('Lae');
	weather.setUnits('metric');
	weather.setAPPID('375cc7f16728bf0dddde9ec5c3a33f0b');
	
	// getter methods
	weather.getAllWeather(function (err, data) {
		// console.log(data);
		res.render('pages/weather', {laewd: data});
	});

	// weather.setCity('Goroka');
	// weather.getAllWeather(function (err, data) {
	// 		// console.log(data);
	// 		res.render('pages/weather', {gkawd: data});
	// 	});

	// weather.setCity('Rabaul');
	// weather.getAllWeather(function (err, data) {
	// 	// console.log(data);
	// 	res.render('pages/weather', {rabwd: data});
	// });
});

app.listen(6395);
console.log("app started at http://localhost:6395/");