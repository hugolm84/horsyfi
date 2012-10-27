jQuery.ajaxSettings.traditional = true;
// I want to get the duration the user has listen to the track
// the lib wont supply me with that
// why? If you change track, you may do so cuz you dont like it. But if you'v been
// listening to it for a while, i guess you do like it.
var MIN_DURATION = 20000;
var INTERVAL = 10000;

var listenDuration = 0;
var currGenre = null;

var tickInterval = setInterval(function() {
	tick(player)
}, INTERVAL);


function fetchGenre(artist) {
	var url = 'http://developer.echonest.com/api/v4/artist/terms?api_key=K4CQ8QOWBZBA4HBYG&format=jsonp&callback=?';
	$.getJSON(url, {
		'name': artist.name
	}, function(data) {
		if (checkResponse(data)) {
			console.log("Fetched: " + data.response.terms[0].name);
			currGenre = data.response.terms[0].name;			
			nowPlaying();
		} else {
			return;
		}
	});
}
 

            
function checkResponse(data) {
	if (data.response) {
		if (data.response.status.code != 0) {
			error("Whoops... Unexpected error from server. " + data.response.status.message);
		} else {
			return true;
		}
	} else {
		console.log("Unexpected response from server");
	}
	return false;
}
$(function() {
	var previousTrack = null;
	// Update the page when the app loads
	if (player.playing) currGenre = fetchGenre(player.track.album.artist);
	else nowPlaying();
	// If we dont have a playlist yet, make sure they drop one 
	if (typeof thisPlaylist === 'undefined') {
		$('#player-content').hide();
	}
	// Listen for track changes and update the page
	player.observe(models.EVENT.CHANGE, function(event) {
		if (event.data.curtrack == true) {
			var track = player.track;
			console.log(track.name + ' by ' + track.album.artist.name);
			console.log("Track changed!");
			doFetchTracks(track);
		}
	});

	function doFetchTracks(track) {
		console.log(listenDuration + " " + MIN_DURATION);
		console.log("fetching based on" + track.name + ' by ' + track.album.artist.name);
		timerSeconds = track.duration / 1000;
		fetchGenre(track.album.artist);
		listenDuration = 0;
		tickInterval = setInterval(function() {
			tick(player)
		}, INTERVAL);
		nowPlaying();
	}
});
// Here we can see track progress

function tick(player) {
	console.log("tick");
	if (player && player.playing) {
		console.log((player.track.duration - player.position) + " listenDuration: " + listenDuration);
		listenDuration += INTERVAL;
		if (listenDuration > player.track.duration - INTERVAL) clearTimeout(tickInterval);
	}
};

function nowPlaying() {
	// This will be null if nothing is playing.
	var track = player.track;
	if (track == null) {
		$("#now-playing").html("Painful silence!");
	} else {
		
		$("#now-playing").empty();
		var playerDiv = $(document.createElement('div')).attr('class', 'sp-player');
		var button = $(document.createElement('button')).attr('class', 'sp-player-button');
		var cover = $(document.createElement('div')).attr('class', 'sp-player-image').attr('id', 'player-image');
		cover.append($(document.createElement('a')).attr('href', track.data.album.uri));
		var img = new ui.SPImage(track.data.album.cover ? track.data.album.cover : "sp://import/img/placeholders/300-album.png");
		cover.children().append(img.node);
		$(playerDiv).append(cover);
		$(playerDiv).append(button);
		$("#now-playing").append(playerDiv);
		var song = '<a href="' + track.uri + '">' + track.name + '</a>';
		var album = '<a href="' + track.album.uri + '">' + track.album.name + '</a>';
		var artist = '<a href="' + track.album.artist.uri + '">' + track.album.artist.name + '</a>';
		var context = player.context,
			extra = "";
		if (context) {
			contextName = null;
			extra = ' from <a href="' + context + '">here</a>';
		} // too lazy to fetch the actual context name
		$("#now-playing").append(song + " by " + artist + " off " + album + extra + " : " + currGenre);
	}
}