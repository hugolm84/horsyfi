jQuery.ajaxSettings.traditional = true;
// I want to get the duration the user has listen to the track
// the lib wont supply me with that
// why? If you change track, you may do so cuz you dont like it. But if you'v been
// listening to it for a while, i guess you do like it.
var MIN_DURATION = 20000;
var INTERVAL = 1000;

var listenDuration = 0;
var currGenre = null;
var tickInterval;


function clearTick()
{
	clearInterval(tickInterval);
	tickInterval = null;
}

function startTick()
{
	 if( tickInterval )
	 	clearTick();
	tickInterval = setInterval(function() {
				tick(player)
			}, INTERVAL);
}
function fetchAudioSummary(track) {
	var url = "http://developer.echonest.com/api/v4/song/search?api_key=K4CQ8QOWBZBA4HBYG&format=jsonp&callback=?&results=1";
	$.getJSON(url, {
		'artist': track.album.artist.name,
		'title' : track.name,
		'bucket': "audio_summary"
	}, function(data) {
		if (checkResponse(data)) {
			console.log("Fetched summary!");
			if(data.response.songs[0] != undefined){
				var currTempo = data.response.songs[0].audio_summary.tempo;
				console.log(currTempo);	
				INTERVAL = currTempo*10;
				INTERVAL += data.response.songs[0].audio_summary.energy*100;
				INTERVAL = Math.round( INTERVAL );
			}else
				INTERVAL = 1000;
		} else {
			return;
		}
	});
}
 
 
function fetchGenre(artist) {
	var url = 'http://developer.echonest.com/api/v4/artist/terms?api_key=K4CQ8QOWBZBA4HBYG&format=jsonp&callback=?';
	$.getJSON(url, {
		'name': artist.name
	}, function(data) {
		if (checkResponse(data)) {
			if( data.response.terms[0] != undefined ){
				console.log("Fetched: " + data.response.terms[0].name);
				currGenre = data.response.terms[0].name;
				//if( currGenre == "hip hop")
				//	INTERVAL = 10;
					
			}else currGenre = "wierd";			
			nowPlaying();
		} else {
			return;
		}
	});
}
 

            
function checkResponse(data) {
	if (data.response) {
		if (data.response.status.code != 0) {
			console.log("Whoops... Unexpected error from server. " + data.response.status.message);
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
	startTick();
	// Update the page when the app loads
	if (player.playing){ 
		
		fetchAudioSummary(player.track);
		fetchGenre(player.track.album.artist);
	
	}else nowPlaying();
	// If we dont have a playlist yet, make sure they drop one 
	if (typeof thisPlaylist === 'undefined') {
		$('#player-content').hide();
	}
	// Listen for track changes and update the page
	player.observe(models.EVENT.CHANGE, function(event) {
		if (event.data.curtrack == true) {
			var track = player.track;
			//console.log(track.name + ' by ' + track.album.artist.name);
			console.log("Track changed!");
			fetchAudioSummary(track);
			doFetchTracks(track);
			
			
			initialize();	

		}
	});

	function doFetchTracks(track) {
		//console.log(listenDuration + " " + MIN_DURATION);
		//console.log("fetching based on" + track.name + ' by ' + track.album.artist.name);
		timerSeconds = track.duration / 1000;
		fetchGenre(track.album.artist);
		listenDuration = 0;
		
		nowPlaying();
	}
});
// Here we can see track progress

function tick(player) {
	console.log("tick");
	if (player && player.playing) {
		//console.log((player.track.duration - player.position) + " listenDuration: " + listenDuration);
		listenDuration += INTERVAL;
		//console.log("INTERVAL: " + INTERVAL );
		setAndClearMarkers();
		//if (listenDuration > player.track.duration - INTERVAL) clearTimeout(tickInterval);
	}//else clearTimeout(tickInterval);
	
};

function nowPlaying() {
	// This will be null if nothing is playing.
	var track = player.track;
	if (track == null) {
		//$("now-playing").clear;
		$("#now-playing").html("Painful silence!");
	} else {
		
		$("#now-playing").empty();
		var playerDiv = $(document.createElement('div')).attr('class', 'sp-player');
		var button = $(document.createElement('button')).attr('class', 'sp-player-button');
		var cover = $(document.createElement('div')).attr('class', 'sp-player-image').attr('id', 'player-image');
		cover.append($(document.createElement('a')).attr('href', track.data.album.uri));
		
		var img; 
		if( currGenre && currGenre == "hip hop")
			img = new ui.SPImage("img/album/gangsta.png");
		else if( currGenre && currGenre == "pop")
			img = new ui.SPImage("img/album/pop.jpeg");
		else if( currGenre && currGenre == "electronic")
			img = new ui.SPImage("img/album/electronic.jpeg");
		//else if( currGenre && currGenre == "punk")
		//	img = new ui.SPImage("img/album/punk.jpeg");
		else if( currGenre && currGenre == "wierd")
			img = new ui.SPImage("img/album/wierd.jpeg");
		else
			img = new ui.SPImage("img/album/flying_pig.jpeg");
			
		cover.children().append(img.node);
		$(playerDiv).append(cover);
		$(playerDiv).append(button);
		$("#now-playing").append(playerDiv);
		var song = '<a href="' + track.uri + '">' + track.name + '</a>';
		var album = '<a href="' + track.album.uri + '">' + track.album.name + '</a>';
		var artist = '<a href="' + track.album.artist.uri + '">' + track.album.artist.name + '</a>';
		var context = player.context;
		if( currGenre && currGenre != "punk" )
			$("#now-playing").append("<a>OOh niiice! a " + currGenre + " horse!</a>");
		else
			$("#now-playing").append("<a>Doh! This is a flying big, not a horse!</a>");
		var random = Math.floor(Math.random() * (facts.length - 0 + 1)) + 0;
		$("#now-playing").append("<br>" + facts[random] + "<br>" + song + " by " + artist + " (" + currGenre +")");

	}
}