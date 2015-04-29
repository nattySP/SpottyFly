var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');


var app = express();

// Parse JSON (uniform resource locators)
//this mounts middleware that will parse the json in the body of every request and place the 
//parsed info into req.body
app.use(bodyParser.json());
// Parse forms (signup/login)
//this mounts middleware that will parse the urlencoded bodies of req from form submission and places the 
//parsed info into the req.body which will contain key-value pairs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.post('/', function(req, res, next){
  var artist = req.body.artist;
  console.log("artist: ", artist);
  next();
}, function(req, res, next){
  request({
  url: '/v1/search',
  baseUrl: 'https://api.spotify.com',
  type: 'GET',
  contentType:'application/json',
  data: {q: req.body.artist,
      type: 'artist'}

}, function(err, res, body){
  console.log("response: ", res.body);
})});



console.log('Shortly is listening on 4568');
app.listen(4568);
