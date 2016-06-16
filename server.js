var express = require("express");
var app = express();
var ig = require("instagram-node").instagram();
var weather = require("openweather-apis");
var pg = require("pg");

app.use(express.static(__dirname + "/public"));

app.set('view engine','ejs');
app.set('port', (process.env.PORT || 3000))

app.get('/home', function(req,res){
	var tags = ['pngup','samoa','nauru','tahiti','vanuatu','islandjewel', 'tonga', 'kiribati', 'shark'];
	var tagged = tags[Math.floor(Math.random()*tags.length)];
	ig.tag_media_recent(tagged, function (err, medias, pagination, remaining, limit) {
		res.render('pages/index', {grams: medias, tag_used: tagged, tag:tags});
	}); 
});
app.get('/tag/:tag?', function (req, res) {
	var tags = ['paris', 'france', 'explosion', 'bombings', 'manusday', 'pngup', 'nipsday', 'sepikday','gulfday','pngswag','pnggirl','tahiti','pacificjewel','islandjewel', 'sudo', 'instapng', 'yesyabarrah'];
	var tag = req.params.tag;
	ig.tag_media_recent(tag, function (err, medias, pagination, remaining, limit) {
		res.render('pages/tags', {grams: medias, tag_used: tag, tag: tags});
	})
})
app.get('/instacarousel', function(req, res) {
	var tags = ['cityphotography', 'landscapephotography', 'architectures', 'paratroopers'];
	var tagged = tags[Math.floor(Math.random()*tags.length)];
	ig.tag_media_recent(tagged, function (err, medias, pagination, remaining, limit) {
		res.render('pages/instacarousel', {grams: medias, tag_used: tagged, tag: tags });
	})
})

app.get('/pngindependence', function(req, res) {
	var tags = ['papuanewguinea','pngindependence','40thindependence','independencefever','sept16','september16'];
	var tagged = tags[Math.floor(Math.random()*tags.length)];
	ig.tag_media_recent(tagged, function (err, medias, pagination, remaining, limit) {
		res.render('pages/instacarousel', {grams: medias, tag_used: tagged, tag: tags });
	})
})

app.get('/newguinea', function(req,res){
	ig.media_search(-6.733543, 147.001667, 5000, function (err, medias, remaining, limit) {
		res.render('pages/newguinea', {grams: medias});
	});
});

ig.use({
	client_id: '70267f0181bb4fd6a81440f0f0939b76',
	client_secret: 'bd71b76f1912441dac0d5d4850b65826'
});

app.get('/template', function(req,res) {
	res.render('pages/template');
});
app.get('/', function (req, res) {
	weather.setLang('en');
	weather.setUnits('metric');
	weather.setAPPID('375cc7f16728bf0dddde9ec5c3a33f0b');
	// var tags = ['cityphotography', 'landscapephotography', 'architectures'],
	// 		tagged = tags[Math.floor(Math.random()*tags.length)],
	// 		grams;
	// ig.tag_media_recent(tagged, function (err, medias, pagination, remaining, limit) {
	// 	console.log(grams);
	// 	return {grams: medias};
	// });

	weather.getGroupWeather(function (err, data) {
		if (!err) {
			res.render('pages/weather-group', {all: data});
		} else {
			console.log('ERROR ENCOUNTERED!\n\n',err);
		}
	})
});

app.post('/weather-group/', function (req, res) {
	weather.setLang('en');
	weather.setUnits('metric');
	weather.setAPPID('375cc7f16728bf0dddde9ec5c3a33f0b');
	var tags = ['cityphotography', 'landscapephotography', 'architectures'],
			tagged = tags[Math.floor(Math.random()*tags.length)],
			grams;
	// ig.tag_media_recent(tagged, function (err, medias, pagination, remaining, limit) {
	// 	console.log(grams);
	// 	return {grams: medias};
	// });

	weather.getGroupWeather(function (err, data) {
		if (!err) {
			res.render('pages/weather-group', {all: data});
		} else {
			console.log('ERROR ENCOUNTERED!\n\n',err);
		}
	})
});
app.listen(app.get('port'), function() {
	console.log("app started at " + app.get('port'));
});