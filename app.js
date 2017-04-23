var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var cookieSession = require("cookie-session");
var weather = require("./lib/weather-config.js");
var moment = require('moment');
var morgan = require('morgan');
var request = require('request');
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
router.get("/", function(req,res) {
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
router.get("/flexbox", function(req,res) {
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
router.get('/webhook',(req,res)=>{
	// enter webhook code here
	if(req.query['hub.mode'] === 'subscribe' &&
		 req.query['hub.verify_token'] === 'monobelle101516'){
		console.log("validating webhook");
	res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed Validation! Make sure the Validation tokens match.");
		res.sendStatus(403);
	}
})
.post('/webhook',(req,res)=>{
	var data = req.body;
	if (data.object = 'page') {
		data.entry.forEach((entry)=>{
			var pageID = entry.id;
			var timeOfEvent = entry.time;

			entry.messaging.forEach((event)=>{
				if (event.message) {
					receivedMessage(event);
				} else {
					console.log("Webhook received unknown event!",event);
				}
			});
		});
		res.sendStatus(200);
	}
});
function receivedMessage(event) {
	// console.log("Message data: ",event.message);
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	console.log('Received message from user %d and page %d at %d with message:', senderID, recipientID, timeOfMessage);
	console.log(JSON.stringify(message));

	var messageID = message.mid;
	var messageText = message.text;
	var messageAttachments = message.attachments;

	if (messageText) {
		switch(messageText) {
			case 'generic':
				sendGenericMessage(senderID);
				break;
			default:
				sendTextMessage(senderID, messageText);
		}
	} else if (messageAttachments) {
		sendTextMessage(senderID, "Message with attachments received!");
	}
}
function sendGenericMessage(recipientID, messageText) {}
function sendTextMessage(recipientID, messageText) {
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			text: messageText
		}
	}
	callSendAPI(messageData);
}
function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: 'monobelle101516'},
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var recipientID = body.recipient_id;
			var messageID = body.message_id;

			console.log("Successfully sent generic message with id %s to recipient %s", messageID, recipientID);
		} else {
			console.error("Unable to send message");
			console.error("response =>",response);
			console.error("error =>",error);
		}
	})
}
app.use('/',router);
app.use((req,res,next)=>{
	res.locals.city = req.query.city;
	console.log('res.locals.city -',res.locals.city);
	// next({a:"test"});
	next()
});
router.get("/forecast", function (req, res) {
	console.log('req.query.city -',req.query.city);
	weather.getForecast(req.query.city, function(err, data) {
		err ?
			res.send(err) :
			// console.log("city -",data.list);
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