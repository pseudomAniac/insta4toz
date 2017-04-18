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
	name: "sampleSession",
	secret: "monobelle",
	img: "/public/img/app-logo.png"
}));
app.use(morgan('dev'));
app.post("/", function (req, res) {
	res.redirect("/");
});
router.get("/", function(req,res) {
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
app.use('/',router);
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

app.use((req,res,next)=>{
	res.locals.city = req.query.city;
	console.log(res.locals.city);
	// next({a:"test"});
	next()
});
router.get('/', function (req, res) {
	console.log(a);
	weather.getCurrent(res.locals.city, function(data) {
	// weather.getCurrent(city, function(data) {
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: res.locals.city.toUpperCase() + " WEATHER REPORT",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/public/img/app-logo.png"
				}
			}
		});
	});
});
router.get("/forecast/", function (req, res) {
	weather.getForecast(res.locals.city, function(err, data) {
		err ?
			res.send(err) :
			console.log(data.city.name, ",\t", data.list.temp);
			res.send(data);
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
				url: "/public/img/app-logo.png"
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