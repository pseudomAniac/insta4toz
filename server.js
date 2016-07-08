var express = require("express");
var app = express();
var weather = require("openweather-apis");

weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID('375cc7f16728bf0dddde9ec5c3a33f0b');

app.get('/template', function(req,res) {
	res.render('pages/template');
});

app.get('/', function (req, res) {
	weather.setCity('lae')
	weather.getAllWeather(function(err,data) {
		console.log(data);
		res.render('pages/weather',{wd: data});
	});
});

app.get('/api/weather/?', function (req, res) {
	var city = req.query.city;
	console.log(req.query)
	weather.setCity(city)
	weather.getAllWeather(function(err,data) {
		console.log(data);
		res.render('pages/weather',{wd: data});
	});
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});