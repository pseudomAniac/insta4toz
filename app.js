var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var cookieSession = require("cookie-session");
var weather = require("./lib/weather-config.js");
var moment = require('moment');
var morgan = require('morgan');
var fbmsg = require('./lib/fb-messenger');
// var unxConv = require("./lib/unixdate-converter.js");
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieSession({
	name: "superSecretSession",
	secret: "monobelle",
	img: "/img/background image files (4).png"
}));
router.post("/", function (req, res) {
	res.redirect("/");
});
router.get("/", function(req,res) {
	var city = "png"
	weather.getCurrent(city, function(data) {
		res.render("pages/index",{
			weda:data,
			appInfo: {
				url: "https://sudoweather.herokuapp.com",
				type: "article",
				title: city.toUpperCase() + " WEATHER REPORT",
				description: "Get your city's weather and forecast.",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "/img/background image files (2).jpg"
				}
			}
		});
	});
});
router.get('/test/fb', function(req,res) {
	res.redirect("http://www.facebook.com/sudo.snapit");
})
app.use('/',router);
router.use((req,res,next)=>{
	res.locals.city = req.query.city;
	// console.log('res.locals.city -',res.locals.city);
	// next({a:"test"});
	next()
});
router.get("/forecast", function (req, res) {
	console.log('req.query.city -',req.query.city);
	weather.getForecast(req.query.city, function(err, data) {
		err ? res.send(err) : res.send(data);
	});
});
router.get('/weather_json', (req,res)=>{
	weather.getCurrent(res.locals.city,(err, data)=>{
		err ? res.send(err) : res.send(data);
	})
});
router.get('/weather/', function (req, res) {
	var mycity = res.locals.city.toUpperCase() + " WEATHER REPORT";
	// console.log('req.originalUrl -',req.originalUrl);
	// console.log('weather city -',mycity)
	weather.getCurrent(res.locals.city, function(data) {
		// console.log('data',data);
		res.render("pages/weather",{
			weda:data,
			appInfo: {
				url: "https://sudoweather.herokuapp.com/api/weather/?city="+res.locals.city.toLowerCase(),
				title: mycity,
				description: data.name + " temp: "+data.main.temp +" Deg. Celcius. Get your local weather update along with 7 days forecast. Click here",
				img: {
					title: "Sudo Weather Reoprt - Logo",
					url: "https://sudoweather.herokuapp.com/img/"+res.locals.city.toLowerCase()+".png"
				}
			}
		});
	});
});
router.get('/test',(req,res)=>{
	res.render('pages/force-graph');
})
app.use('/api',router);
router.get('/calendar',(req,res)=>{
	// res.send("success")
	res.render('pages/calendar-app',{
		appInfo: {
				url: "https://sudoweather.herokuapp.com/app/calendar",
				title: "Calendar App",
				description: "Awesome app that appends a calendar to your profile picture!",
				img: {
					title: "Sudo Weather Report - City Weather n Forecase",
					url: "https://sudoweather.herokuapp.com/img/bg5.jpg"
				}
			}
	});
});
app.use('/app',router);
app.get('/webhook',(req,res)=>{
	if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'monobelle101516'){
		console.log("validated webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed Validation! Make sure the Validation tokens match.");
		res.status(403).send('Error, invalid validation token!');
	}
});
app.post('/webhook',(req,res)=>{
	var data = req.body;
	console.log("REQUEST BODY\n",req.body);
	console.log("REQUEST MESSAGING\n",req.body.messaging);
	if (data.object = 'page') {
		data.entry.forEach((entry)=>{
			var pageID = entry.id;
			var timeOfEvent = entry.time;
			entry.messaging.forEach((event)=>{
				if (event.message) {
					fbmsg.receivedMessage(event);
				} else {
					console.log("Webhook received unknown event!",event);
				}
			});
		});
		res.sendStatus(200);
	}
});
app.set('view engine','ejs');
// app.set('leaflet','/assets/leaflet');
app.set('views','./client/views');
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});