var request = require('request');
// var db = require('../app/config');
var qs = require('qs');
// var User = require('../app/models/user');
// var Link = require('../app/models/link');

exports.getArtistFromUser = function(req, res, next){
	  var artist = req.body.artist;
	  console.log("artist: ", artist);
	  next();
	};

exports.getArtistId = function(req, res, next){
	  request({
	  url: '/v1/search',
	  baseUrl: 'https://api.spotify.com',
	  type: 'GET',
	  contentType:'application/json',
	  qs: {q: req.body.artist,
	      								 type: 'artist'}
	}, function(err, res, body){
		if (res.statusCode === 200 ) {
			var bodyObj = JSON.parse(body);
			// console.log('body: ', body.artists.items);
		  console.log("response: ", bodyObj.artists.items[0].name);
			next(); 
		} else {
			res.writeHead(404);
			res.end(); 
		}
	})};
