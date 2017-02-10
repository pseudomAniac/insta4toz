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
	weather.getCurrent("Lae", function(err, data) {
		data.dt = moment(data.dt).format("DD MM YYYY");
		data.sys.sunrise = moment(data.sys.sunrise).format("LLL");
		data.sys.sunset = moment(data.sys.sunset).format("LLL");
		err ? res.send(err) : res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: "Lae Weather Report",
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
	weather.getCurrent("Lae", function(err, data) {
		data.dt = moment(data.dt).format("DD MMMM");
		data.sys.sunrise = moment(data.sys.sunrise).format("HH:SS");
		data.sys.sunset = moment(data.sys.sunset).format("HH:SS");
		err ? res.send(err) : res.render("pages/flexbox",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com",
				type: "article",
				title: "Lae Weather Report",
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
	weather.getCurrent(req.query.city, function(err, data) {
		data.dt = moment(data.dt).format();
		data.sys.sunrise = moment(data.sys.sunrise).format();
		data.sys.sunset = moment(data.sys.sunset).format();
		err ? res.send(err) : res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "http://sudoweatherreport.herokuapp.com/api/?city="+city,
				type: "article",
				title: city + " Weather Report",
				description: "This neat little app provides you with an up to the minute update on your local weather.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/public/img/app-logo.png"
				}
			}
		});
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