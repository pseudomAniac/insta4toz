var request = require('request');
var weather = require("../weather-config.js");
// functions
exports.receivedMessage = (event)=>{
	// console.log("Event data: ",event);
	// console.log("Message data: ",event.message);
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	// console.log('Received message from user %d and page %d at %d with message:', senderID, recipientID, timeOfMessage);
	console.log("Message Received: ",JSON.stringify(message));

	var messageID = message.mid;
	var messageText = message.text;

	if (messageText) {
		messageText.toLowerCase();
		switch(messageText) {
			// case 'generic':
			// 	// sendTextMessage(senderID, messageText);
			// 	sendGenericMessage(senderID);
			// 	break;
			case 'lae':
			case 'port moresby':
			case 'mount hagen':
			case 'rabaul':
			case 'madang':
			case 'goroka':
			case 'kerema':
			case 'lorengau':
				// sendTextMessage(senderID, messageText);
				sendWeatherData(senderID,messageText);
				break;
			case 'start bot':
				sendTextMessage(senderID,messageText); 
				break;
			default:
				sendTextMessage(senderID, messageText);
				break;
		}
	} else if (message.attachments) {
		// if (message.sticker_id) {return;}
		// else {sendTextMessage(senderID, "Message with attachments received!");}
	}
}
// 	curl -X POST -H "Content-Type: application/json" -d '{
//   "setting_type" : "domain_whitelisting",
//   "whitelisted_domains" : ["https://sudoweather.herokuapp.com"],
//   "domain_action_type": "add"
// }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAUZBZCZCHjIZBoBAEtIvLYftNbZAEnymC5sJNdZBFSsnEAryVnxZBum2PuB7VAPdNq9H68MuOYZAg0kAh0ZBZBED2MyHNJ1aPwYcYLx1JiIinin1s14ZAyT1wIbMqCwUsSnCQMpM4lZCa35R1lHv3SuWEdHiMIF54ZBbzc0iLsObGkG66wZDZD"
// curl -X POST -H "Content-Type: application/json" -d '{
// 	"get_started": {
// 		"payload": "more_options"
// 	}
// }' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAUZBZCZCHjIZBoBAEtIvLYftNbZAEnymC5sJNdZBFSsnEAryVnxZBum2PuB7VAPdNq9H68MuOYZAg0kAh0ZBZBED2MyHNJ1aPwYcYLx1JiIinin1s14ZAyT1wIbMqCwUsSnCQMpM4lZCa35R1lHv3SuWEdHiMIF54ZBbzc0iLsObGkG66wZDZD"
exports.payloadHandler = (event)=>{
	var postbackData = event.postback.payload;
	if (postbackData === "start bot") {
		// call start bot fx
		startBot(event);
	} else if (postbackData === "more_options") {
		// call more options fx
		console.log("User requesting for more information");
	}
	else {
		console.log("UNKNOW PAYLOAD PASSED TO payloadHandler. Please check your code!");
	}
}
function startBot(event) {
	console.log("PAYLOAD RECEIVED!",event.postback.payload);
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.postback.payload;
	var messageData;
	if (message && message === "start bot") {
		// sendGenericMessage(senderID);
		messageData = {
		  "recipient":{
		    "id": senderID
		  }, 
		  "message": {
		    "attachment": {
		      "type": "template",
		      "payload": {
		        "template_type": "list",
		        "top_element_style": "compact",
		        "elements": [
		          // {
		          //   "title": "Classic T-Shirt Collection",
		          //   "subtitle": "See all our colors",
		          //   "image_url": "https://sudoweather.herokuapp.com/img/collection.png",          
		          //   "buttons": [
		          //     {
		          //       "title": "View",
		          //       "type": "web_url",
		          //       "url": "https://sudoweather.herokuapp.com/collection",
		          //       "messenger_extensions": true,
		          //       "webview_height_ratio": "tall",
		          //       "fallback_url": "https://sudoweather.herokuapp.com/"
		          //     }
		          //   ]
		          // },
		          {
								title: "Weather Subscription",
								subtitle: "Subscribe to receive weather updates daily.",
								item_url: "https://sudoweather.herokuapp.com/subscribe/fb-messenger",
								image_url: "https://sudoweather.herokuapp.com/img/app-logo.png",
								buttons: [{
									type: "web_url",
									url: "https://sudoweather.herokuapp.com/subscribe/fb-messenger",
									title: "Subscribe"
								}]
							},
		          {
		            "title": "Weather Update",
		            "subtitle": "Get weather update for your PNG city.",
		            "default_action": {
		              "type": "web_url",
		              "url": "https://sudoweather.herokuapp.com",
		              "messenger_extensions": true,
		              "webview_height_ratio": "tall",
		              "fallback_url": "https://sudoweather.herokuapp.com"
		            }
		          },
		          // {
		          //   "title": "Classic Blue T-Shirt",
		          //   "image_url": "https://sudoweather.herokuapp.com/img/alotau.png",
		          //   "subtitle": "100% Cotton, 200% Comfortable",
		          //   "default_action": {
		          //     "type": "web_url",
		          //     "url": "https://sudoweather.herokuapp.com",
		          //     "messenger_extensions": true,
		          //     "webview_height_ratio": "tall",
		          //     "fallback_url": "https://sudoweather.herokuapp.com"
		          //   },
		          //   "buttons": [
		          //     {
		          //       "title": "Shop Now",
		          //       "type": "web_url",
		          //       "url": "https://sudoweather.herokuapp.com",
		          //       "messenger_extensions": true,
		          //       "webview_height_ratio": "tall",
		          //       "fallback_url": "https://sudoweather.herokuapp.com"
		          //     }
		          //   ]        
		          // }
		        ],
		         "buttons": [
		          {
		            "title": "More Options",
		            "type": "postback",
		            "payload": "more_options"
		          }
		        ]  
		      }
		    }
		  }
		}
		callSendAPI(messageData);
	}
	// whitelisting
}
function sendWeatherData(recipientID,city) {
	var apptitle = city.toUpperCase() + " WEATHER REPORT";
	var messageData;
	weather.getCurrent(city,(data)=>{
		var wURL = 'https://sudoweather.herokuapp.com/api/weather/?city='+city;
		messageData = {
			recipient: {
				id: recipientID
			},
			message: {
				attachment: {
					type: 'template',
					payload: {
						template_type: 'generic',
						elements: [{
							title: apptitle,
							subtitle: 'Temp. is '+data.main.temp+' deg Celsius. with '+data.clouds.all+' % of the sky covered with '+data.weather[0].description,
							item_url: wURL,
							image_url: "https://sudoweather.herokuapp.com/img/"+city+".png",
							buttons: [{
								type: "web_url",
								url: wURL,
								title: "See 7 Day Forecast"
							},{
								type: "element_share",
								// title: "Menu",
								// payload: "Payload for first bubble"
							}],
						},
						// {
						// 	title: apptitle+" 2",
						// 	subtitle: 'The wind is averaging speeds of up to '+data.wind.speed+' km/h blowing in from the North at '+data.wind.deg+' &deg;',
						// 	item_url: wURL,
						// 	image_url: "https://sudoweather.herokuapp.com/img/app-logo-2.png",
						// 	buttons: [{
						// 		type: "web_url",
						// 		url: wURL,
						// 		title: apptitle+" 2"
						// 	},{
						// 		type: "postback",
						// 		title: "Menu",
						// 		payload: "Payload for first bubble"
						// 	}],
						// }
						]
					}
				}
			}
		};
		callSendAPI(messageData);
	});
}
function sendGenericMessage(recipientID) {
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'generic',
					elements: [{
						title: "Sample Title 1",
						subtitle: "Next generation virtual reality",
						item_url: "https://sudoweather.herokuapp.com",
						image_url: "https://sudoweather.herokuapp.com/img/app-logo-2.png",
						buttons: [{
							type: "web_url",
							url: "https://sudoweather.herokuapp.com",
							title: "Home | PNG Weather Reports"
						},{
							type: "postback",
							title: "Call Postback",
							payload: "Payload for first bubble"
						}],
					},{
						title: "touch",
						subtitle: "Your hands now in VR",
						item_url: "https://sudoweather.herokuapp.com",
						image_url: "https://sudoweather.herokuapp.com/img/app-logo-2.png",
						buttons: [{
							type: "web_url",
							url: "https://sudoweather.herokuapp.com",
							title: "Open Web URL"
						},{
							type: "postback",
							title: "Call Postback",
							payload: "Payload for second bubble"
						}]
					}]
				}
			}
		}
	};
	callSendAPI(messageData);
}
function sendTextMessage(recipientID, messageText) {
	var messageData = {
		recipient: {
			id: recipientID
		},
		message: {
			text: "Apologies, at the moment we only support weather for POM, LAE, Goroka, Rabaul, Madang, Kerema and Lorengau. Please type in any one of these cities and we will be able to send you the current weather information."
		}
	}
	callSendAPI(messageData);
}
function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: 'EAAUZBZCZCHjIZBoBAEtIvLYftNbZAEnymC5sJNdZBFSsnEAryVnxZBum2PuB7VAPdNq9H68MuOYZAg0kAh0ZBZBED2MyHNJ1aPwYcYLx1JiIinin1s14ZAyT1wIbMqCwUsSnCQMpM4lZCa35R1lHv3SuWEdHiMIF54ZBbzc0iLsObGkG66wZDZD'},
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var recipientID = body.recipient_id;
			var messageID = body.message_id;
			console.log("Successfully sent generic message with id %s to recipient %s", messageID, recipientID);
		} else {
			console.error("Unable to send message");
			if (response) console.error("response =>",response.body);
			if (error) console.error("error =>",error.body);
		}
	})
}