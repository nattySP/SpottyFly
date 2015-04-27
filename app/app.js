var app; 
$(function(){
	app = {

		spotifyAPI: 'https://api.spotify.com',
		// GET https://api.spotify.com/v1/search

		getArtist: function(artist){
			$.ajax({
				url: app.spotifyAPI + '/v1/search',
				type: 'GET',
				contentType:'application/json',
				data: {q: artist,
					  type: 'artist'},
				success: function(data){
					console.log(data.artists.items[0].id);
				}
			})
		},

		init: function(){
			app.getArtist('beyonce');
		}


	}

})