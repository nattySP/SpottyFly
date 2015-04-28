var app = {
		spotifyAPI: 'https://api.spotify.com',

		getArtist: function(artist){
			app.artistRelations = {};
			$.ajax({
				url: app.spotifyAPI + '/v1/search',
				type: 'GET',
				contentType:'application/json',
				data: {q: artist,
					  type: 'artist'},
				success: function(data){
					var artistName = data.artists.items[0].name;
					var artistId = data.artists.items[0].id; 
					var artistPop = data.artists.items[0].popularity; 
					app.artistRelations[artistName] = {};
					app.artistRelations[artistName].id = artistId; 
					app.artistRelations[artistName].popularity = artistPop; 
					app.artistRelations[artistName].related = [];
					$.ajax({
						url: app.spotifyAPI + '/v1/artists/'+ artistId + '/related-artists',
						type: 'GET', 
						contentType: 'application/json',
						success: function(data){
							data.artists.forEach(function(artistObj){
								var artistTrimmed = {
									name : artistObj.name,
									  id : artistObj.id,
									  popularity: artistObj.popularity

								};
								app.artistRelations[artistName].related.push(artistTrimmed);
							})
							createMap(app.artistRelations);
						}
					})
				}
			})
		},

		init: function(){
			$('#selectArtist').on('submit', function(event){
				event.preventDefault();
				var artist = $(this).find('#artist').val();
				console.log('submit with ', artist);
				app.getArtist(artist);
				$(this).find('#artist').val('');
			})
		}
};


