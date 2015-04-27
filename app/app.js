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
					console.log('artist: ', data.artists.items[0].name, ' id: ', data.artists.items[0].id);
					var artistId = data.artists.items[0].id; 
					$.ajax({
						url: app.spotifyAPI + '/v1/artists/'+ artistId + '/related-artists',
						type: 'GET', 
						contentType: 'application/json',
						success: function(data){
							data.artists.forEach(function(artistObj){
								console.log(artistObj.name);
							})
							// console.log('related artists: ', data);
						}
					})
					//another GET request to get the related artists
				}
			})
		},

		init: function(){
			app.getArtist('Ghost Loft');
		}


	}

})