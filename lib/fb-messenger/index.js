var request = require('request');
var weather = require("../weather-config.js");
// functions
exports.receivedMessage = (event)=>{
	// console.log("Message data: ",event.message);
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	console.log('Received message from user %d and page %d at %d with message:', senderID, recipientID, timeOfMessage);
	console.log(JSON.stringify(message));

	var messageID = message.mid;
	var messageText = message.text.toLowerCase();
	var messageAttachments = message.attachments;

	if (messageText) {
		switch(messageText) {
			case 'generic':
				sendGenericMessage(senderID);
				break;
			case 'lae':
			case 'port moresby':
			case 'mount hagen':
			case 'rabaul':
			case 'madang':
			case 'goroka':
			case 'kerema':
			case 'lorengau':
				sendWeatherData(senderID,messageText);
				break;
			default:
				sendTextMessage(senderID, messageText);
		}
	} else if (messageAttachments) {
		sendTextMessage(senderID, "Message with attachments received!");
	}
}
function sendWeatherData(recipientID,city) {
	var apptitle = city.toUpperCase() + " WEATHER REPORT";
	var wURL = 'https://sudoweather.herokuapp.com/api/weather/?city='+city;
	var messageData = '';
	// weather.getCurrent(city.toLowerCase(),(data)=>{
	// })
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
						subtitle: "'Temp. is '+data.main.temp+' &deg;C. with '+data.clouds.all+' % of the sky covered with '+data.weather[0].description",
						item_url: wURL,
						image_url: "https://sudoweather.herokuapp.com/img/app-logo-2.png",
						buttons: [{
							type: "web_url",
							url: wURL,
							title: apptitle
						},{
							type: "postback",
							title: "Menu",
							payload: "Payload for first bubble"
						}],
					},{
						title: apptitle+" 2",
						subtitle: "'The wind is averaging speeds of up to '+data.wind.speed+' km/h blowing in from the North at '+data.wind.deg+' &deg;'",
						item_url: wURL,
						image_url: "https://sudoweather.herokuapp.com/img/app-logo-2.png",
						buttons: [{
							type: "web_url",
							url: wURL,
							title: apptitle+" 2"
						},{
							type: "postback",
							title: "Menu",
							payload: "Payload for first bubble"
						}],
					}]
				}
			}
		}
	};
	callSendAPI(messageData);
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
			text: messageText
		}
	}
	callSendAPI(messageData);
}
function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: 'EAAUZBZCZCHjIZBoBAOqONyO9DbcJsleezDQZB2Qkxl9pAS7V4RNsNv9lFsv2YzjtFzrr7BrDi3uZAuYYAZBSleH5AWvcIVzwZCns9qCGeLFjRkecQbe2xWSWSwUUKLNYSbpnnBZAE3dRsoU1RuqZByboYZBioaWdHcBOV1apV0vFTbKbAZDZD'},
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