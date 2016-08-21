var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var cookieSession = require("cookie-session");
var weather = require("./lib/weather-config.js");
var unxConv = require("./lib/unixdate-converter.js");

app.use(bodyParser.json());
app.use(cookieSession({
	name: "sampleSession",
	secret: "monobelle",
	img: "http://www.google.com"
})); 

app.post("/", function (req, res) {
	res.redirect("/");
});
app.get("/", function(req,res) {
	weather.getCurrent("Lae", function(err, data) {
		data.dt = unxConv(data.dt);
		data.sys.sunrise = unxConv(data.sys.sunrise);
		data.sys.sunset = unxConv(data.sys.sunset);
		err ? res.send(err) : res.render("pages/weather",{weda:data});
	});
});

app.get('/api/', function (req, res) {
	console.log(req.query.city);
	weather.getCurrent(req.query.city, function(err, data) {
		data.dt = unxConv(data.dt);
		data.sys.sunrise = unxConv(data.sys.sunrise);
		data.sys.sunset = unxConv(data.sys.sunset);
		err ? res.send(err) : res.render("pages/weather",{weda:data});
	});
});

app.get("/forecast/:city", function (req, res) {
	weather.getForecast(req.params.city, function(err, data) {
		err ? res.send(err) : res.send(data);
	});
});

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});