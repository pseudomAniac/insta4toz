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
exports.sendGenericMessage = (recipientID, messageText)=>{}
exports.sendTextMessage = (recipientID, messageText)=>{
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
exports.callSendAPI = (messageData)=>{
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