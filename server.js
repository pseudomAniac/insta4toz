var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var cookieSession = require("cookie-session");
var weather = require("./lib/weather-config.js");
var moment = require('moment');
// var unxConv = require("./lib/unixdate-converter.js");

app.use(bodyParser.json());
app.use(cookieSession({
	name: "sampleSession",
	secret: "monobelle",
	img: "/public/img/app-logo.png"
})); 
app.post("/", function (req, res) {
	res.redirect("/");
});
app.get("/", function(req,res) {
	var city = "lae"
	weather.getCurrent(city, function(data) {
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: city.toUpperCase + " WEATHER REPORT",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/public/img/app-logo.png"
				}
			}
		});
	});
});

app.get("/flexbox", function(req,res) {
	var city = "lae"
	weather.getCurrent(city, function(data) {
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: city.toUpperCase + " WEATHER REPORT",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/public/img/app-logo.png"
				}
			}
		});
	});
});

app.get('/api/', function (req, res) {
	var city = req.query.city;
	weather.getCurrent(city, function(data) {
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: city.toUpperCase + " WEATHER REPORT",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/public/img/app-logo.png"
				}
			}
		});
	});
});

// app.get("/forecast/", function (req, res) {
// 	weather.getForecast(req.query.city, function(err, data) {
// 		err ? res.send(err) : console.log(data.city.name, ",\t", data.list.temp); res.send(data);
// 	});
// });

app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('views','./client/views');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});