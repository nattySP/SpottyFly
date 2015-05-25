var app = {
		spotifyAPI: 'https://api.spotify.com',
		mode : 'Spotty',

		getArtist: function (artist, callback) {
			console.log('get artist called with: ',artist);
			$.ajax({
				url: '/',
				type: 'POST',
				data: {artist: artist},
				success: function(data) {
					console.log('got artist data: ', data);
					callback(data);
				},
				error: function(error) {
					console.log('error getting artist id (jquery ajax): ', error);
					alert('That is not a valid artist.');
				}
			})
		},

		init: function(){
			$('#selectArtist').on('submit', function(event){
				event.preventDefault();
				var artist = $(this).find('#artist').val();
				console.log('from input listener, artist: ', artist);
				app.getArtist(artist, createMap);
				$(this).find('#artist').val('');
			});

			$(':button').on('click', function(){
				app.mode = $(this).attr('value');
				$('.clicked').removeClass('clicked')
				$(this).addClass('clicked');
				console.log('app.mode: ', app.mode);
			})
		}
};


