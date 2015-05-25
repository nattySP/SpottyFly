var mongoose = require('mongoose');

var ArtistSchema = new mongoose.Schema({
  _id: {
      type: String,
      unique: true,
  },
  external_urls: Object, 
  followers: Object,
  genres: Array, 
  href: String, 
  images: Array, 
  spotifyName: String, 
  popularity: Number, 
  type: String, 
  uri: String, 
  name: String,
  related: Array

});

var Artist = mongoose.model('Artist', ArtistSchema);

Artist.prototype.convertSpecialChars = function(str) {
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
}

ArtistSchema.pre('save', function(next) {
  var name = this.convertSpecialChars(this.spotifyName);
  this.name = name; 
  next()
});

module.exports = Artist;



/*

{ external_urls: { spotify: 'https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m' },
  followers: { href: null, total: 3010684 },
  genres: [ 'dance pop', 'r&b', 'urban contemporary' ],
  href: 'https://api.spotify.com/v1/artists/6vWDO969PvNqNYHIOW5v0m',
  id: '6vWDO969PvNqNYHIOW5v0m',
  images: 
   [ { height: 1000,
       url: 'https://i.scdn.co/image/a370c003642050eeaec0bc604409aa585ca92297',
       width: 1000 },
     { height: 640,
       url: 'https://i.scdn.co/image/79e91d3cd4a7c15e0c219f4e6c941d282fe87a3d',
       width: 640 },
     { height: 200,
       url: 'https://i.scdn.co/image/18141db33353a7b84c311b7068e29ea53fad2326',
       width: 200 },
     { height: 64,
       url: 'https://i.scdn.co/image/214f45121374d7298e58355bd4ef8c6e9a4710b1',
       width: 64 } ],
  name: 'Beyoncé',
  popularity: 94,
  type: 'artist',
  uri: 'spotify:artist:6vWDO969PvNqNYHIOW5v0m' }


  */