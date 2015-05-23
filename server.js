var express     = require('express'),
    mongoose    = require('mongoose');

var app = express();

//connect to database
mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/spottyfly';
mongoose.connect(mongoURI);

// configure our server with all the middleware and and routing
require('./server/config.js')(app, express);


// listen on port 3000
var port = process.env.PORT || 3000; 
app.listen(port);
console.log('listening on port: ', port);

// serves public folder
app.use(express.static('./public'));