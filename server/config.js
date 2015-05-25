var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var utils = require('./request-handlers');


module.exports = function (app, express) {

	// Parse JSON (uniform resource locators)
	//this mounts middleware that will parse the json in the body of every request and place the 
	//parsed info into req.body
	app.use(bodyParser.json());

	// Parse forms (signup/login)
	//this mounts middleware that will parse the urlencoded bodies of req from form submission and places the 
	//parsed info into the req.body which will contain key-value pairs
	app.use(bodyParser.urlencoded({ extended: true }));

	// Enable localhost to localhost connections (CORS)
	app.all('/*', function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "origin, content-type, accept");
	  next();
	});

	app.post('/', utils.getArtistFromUser, utils.getArtistId );
	app.post('/', utils.hasRelated, utils.getRelatedArtists, utils.updateRelated );
	app.post('/', utils.sendDataBack)
	
}


