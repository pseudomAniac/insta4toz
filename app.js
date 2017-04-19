var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var cookieSession = require("cookie-session");
var weather = require("./lib/weather-config.js");
var moment = require('moment');
var morgan = require('morgan');
// var unxConv = require("./lib/unixdate-converter.js");
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieSession({
	name: "superSecretSession",
	secret: "monobelle",
	img: "/img/background image files (4).png"
}));
app.use(morgan('dev'));
app.post("/", function (req, res) {
	res.redirect("/");
});
app.get("/", function(req,res) {
	var city = "lae"
	weather.getCurrent(city, function(data) {
		res.render("pages/index",{
			weda:data,
			appInfo: {
				url: "https://sudoweather.herokuapp.com",
				type: "article",
				title: city.toUpperCase + " WEATHER REPORT",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/img/background image files (2).jpg"
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
					url: "/img/background image files (1)"
				}
			}
		});
	});
});
app.use((req,res,next)=>{
	res.locals.city = req.query.city;
	// console.log(res.locals.city);
	// next({a:"test"});
	next()
});
router.get("/forecast", function (req, res) {
	weather.getForecast(res.locals.city, function(err, data) {
		err ?
			res.send(err) :
			console.log("city -",data.list);
			res.locals.forecastData = data;
			res.send(data);
	});
});
router.get('/', function (req, res) {
	var mycity = res.locals.city.toUpperCase() + " WEATHER REPORT";
	weather.getCurrent(res.locals.city, function(data) {
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "https://sudoweather.herokuapp.com"+req.originalUrl,
				type: "article",
				title: mycity,
				description: data.name + " temp: "+data.main.temp +" Deg. Celcius. Get your local weather update along with 7 days forecast. Click here",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/img/background image files (3).jpg"
				}
			}
		});
	});
});
app.use('/api',router);
// test api
router.all((req,res,next)=>{
	res.locals.city = req.params.city;
	weather.getCurrent(res.locals.city, (data)=>{
		res.locals.weatherdata = data;
	})
	next();
})
.get("/", function(req,res,next) {
	res.render("pages/weather",{
		weda:res.locals.weatherdata,
		appInfo: {
			url: "http://sudoweatherreport.herokuapp.com",
			type: "article",
			title: res.locals.city.toUpperCase() + " WEATHER REPORT",
			description: "Get up to the minute update on your local weather using this app now!",
			img: {
				title: "Sudo Weather Reoprt - Logo",
				url: "/img/app-logo.png"
			}
		}
	});
});
app.use('/test',router);
app.set('view engine','ejs');
app.set('views','./client/views');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});