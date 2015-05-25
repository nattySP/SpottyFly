var request = require('request');
// var db = require('../app/config');
var qs = require('qs');
var Artist = require('../db/artistModel');

exports.getArtistFromUser = function(req, res, next){
	  var artist = exports.convertSpecialChars(req.body.artist)
	  req.body.artist = artist; 
	  Artist.findOne({ name: artist}, function(error, artist) {
	  	if (error) {
	  		console.log('error checking db: ', error);
	  	} else if (artist){
	  		console.log('artist already in db')
	  		next('route');
	  	} else {
	  		next();
	  	}
	  })
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
		if (err) {
			console.log('error getting id: ', err);
		}
		var bodyObj = JSON.parse(body);
		console.log('body: ', bodyObj);
		if (bodyObj.artists.items.length) {
			var artistObj = bodyObj.artists.items[0];
			
			Artist.findOne({ spotifyName : artistObj.name }, function(error, artist) {
				if (error) {
					console.log('error in checking database', err);
					res.status(500).send({errorMessage: 'error in searching database'});
				} else if (!artist) {
					var newArtist = new Artist({
						_id: artistObj.id,
						external_urls: artistObj.external_urls,
						followers: artistObj.followers, 
						genres: artistObj.genres,
						href: artistObj.href,
						images: artistObj.images,
						spotifyName: artistObj.name,
						popularity: artistObj.popularity,
						type: artistObj.type,
						uri: artistObj.uri
					});

					newArtist.save(function(error, newArtist) {
						if (error) {
							console.log('error saving new artist info'); 
							res.status(500).send({errorMessage: 'error in saving new artist in database'})
						} else {
							next('route'); 
						}
					})

				}
			})
		} 
	})
};

exports.getRelatedArtists = function(req, res, next) {
	console.log('getRelatedArtists called');
	Artist.findOne({ name: req.body.artist }, function(error, artist) {
		if (error) {
			console.log('error : ', error);
		}
		var id = artist._id; 
	  request({
		  url: '/v1/artists/'+ id + '/related-artists',
		  baseUrl: 'https://api.spotify.com',
		  type: 'GET',
		  contentType:'application/json',
			}, function(err, res, body){
				if (res.statusCode === 200) {
					var bodyObj = JSON.parse(body);
					var relatedArtists = bodyObj.artists; 
					console.log('relatedArtists: ', relatedArtists);
					var relatedArtistNames = []; 
					relatedArtists.forEach(function(relatedArtist) {
						relatedArtistNames.push({
																			name: relatedArtist.name,
																			popularity: relatedArtist.popularity
																		});
						// relatedArtist.spotifyName = relatedArtist.name; 
						// relatedArtist.name = exports.convertSpecialChars(relatedArtist.spotifyName);
						// console.log('relatedArtist: ', relatedArtist);
					});
					req.body.relatedArtists = relatedArtistNames;
					next();
				} else {
					console.log('there was a problem getting related artists');
				}
			})
	})
};

exports.sendDataBack = function(req, res, next){
	Artist.findOne({name: req.body.artist}, function(error, artist) {
		res.status(200).json(artist);
	})
};

exports.updateRelated = function(req, res, next) {
	console.log('updateRelated called: ', req.body);
	Artist.update({ name: req.body.artist }, { related: req.body.relatedArtists }, function(err, raw) {
		console.log('err: ', err, ' raw: ', raw);
		next('route'); 
	})
};


exports.hasRelated = function(req, res, next) {
	console.log('hasRelated called');
	Artist.findOne({ name : req.body.artist }, function(error, artist) {
		if (error) {
			console.log('error: ', error)
		} else if (artist) {
			if(!artist.related.length) {
				next();
			} else {
				console.log('send data back to client');
				// exports.sendDataBack(req, res, next);
				next('route');
			}
		}
	})
};

exports.resetPage = function(req, res, next) {
	console.log('reset page called');
}

exports.convertSpecialChars = function(str) {
  var rep = ' ';
  
  str = str.toLowerCase()
  .replace(/\s+/g, rep) // replace whitespace

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç";
  var to   = "aaaaeeeeiiiioooouuuunc";
  for (var i=0, l=from.length ; i<l ; i++) {
      str = str.replace(
                new RegExp(from.charAt(i), 'g'),
                to.charAt(i)
            );
  }
        // remove invalid chars
  str = str.replace(new RegExp('[^a-z0-9'+rep+']',"g"), '')
        .replace(/-+/g, rep); // collapse dashes;

  return str;
};




