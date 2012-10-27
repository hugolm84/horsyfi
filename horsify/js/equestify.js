// Initialize the Spotify objects
var sp = getSpotifyApi(1),
	models = sp.require("sp://import/scripts/api/models"),
	views = sp.require("sp://import/scripts/api/views"),
	ui = sp.require("sp://import/scripts/ui");
	dnd =  sp.require('sp://import/scripts/dnd'),
	player = models.player,
	library = models.library,
	application = models.application,
	playerImage = new views.Player(),
	echoNest = nest.nest("K4CQ8QOWBZBA4HBYG");
	
// Handle URI arguments
application.observe(models.EVENT.ARGUMENTSCHANGED, handleArgs);
	
function handleArgs() {
	var args = models.application.arguments;
	$(".section").hide();	// Hide all sections
	$("#"+args[0]).show();	// Show current section
	console.log(args);
	
}

// Handle items 'dropped' on your icon
application.observe(models.EVENT.LINKSCHANGED, handleLinks);
	
/** Drop on droparea in application **/
function dropPlaylist(event)
{
	loadPlaylistUri(event.dataTransfer.getData("url"));	
}

/** Loads the playlist from uri in to list view **/
function loadPlaylistUri(uri)
{

	if( ( uri != undefined || !uri ) && ( uri.split(":")[3] == "playlist" ) )
	{
		console.log("Appending " + uri );
		$('#playlist-drop').hide();
		$('#player-content').fadeIn();
		thisPlaylist = models.Playlist.fromURI(uri);		
		var playlistArt = new views.Player();
			playlistArt.track = thisPlaylist.get(0);
			playlistArt.context = thisPlaylist;
			$("#playlistDiv").append(playlistArt.node);
		
		$("#playlistDiv").append("<h1>" + thisPlaylist.name + "</h1>");	
		var playlistList = new views.List(thisPlaylist);
			playlistList.node.classList.add("temporary");
			playlistList.node.id = "currPlaylist";
			$("#playlistDiv").append(playlistList.node);
			
		initialize();	
	} 
	else
		console.log("Fail to append " + uri );
}

/** Drop on application icon in sidebar **/
function handleLinks() {
	var links = models.application.links;
	if(links.length) {
		switch(links[0].split(":")[1]) {
			case "user":
				if( links[0].split(":")[3] == "playlist" )
				{
				 	loadPlaylistUri(links[0]);
				}		
			default:
				break;
		}		
	} 
}

$(function(){
	
	console.log('Loaded.');
	// Run on application load
	handleArgs();
	handleLinks();
	
});



