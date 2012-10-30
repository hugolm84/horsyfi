var map_object = null;
var image = null;
var horseMarker = null;
var OFFSET = 2;

var randomType = 0;
var randomHorse = 0;
var ICELAND = new google.maps.LatLng(64.140867, -21.871822)
var INNERCITY = 'https://maps.google.com/maps/ms?ie=UTF8&authuser=0&msa=0&output=kml&msid=217451513966778790628.0004cd1dc01168ef92700';
var GOLDENCIRCLE = 'https://maps.google.com/maps/ms?ie=UTF8&oe=UTF8&authuser=0&msa=0&output=kml&msid=209542625718007051021.0004a0def5a2439e0d0f9';					
	
function initialize() {

	if (ICELAND) 
		console.log("got maps");
	else 
		return;		
	
	if( !currGenre )
		return;	
		
	var opts = {
		center: ICELAND,
		panControl: false,
		minZoom: 1,
		maxZoom: 20,
		draggable: true, zoomControl: true, scrollwheel: false,
		scaleControl: false,
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mode: google.maps.TravelMode.WALKING,
		optimizeWaypoints: false,
		disableDefaultUI: true
	};
	
		
	map_object = new google.maps.Map(document.getElementById("map"), opts);
	

	
	randomType = Math.floor(Math.random() * (horses.length));
	randomHorse = Math.floor(Math.random() * (horses[randomType].length));

	if( (currGenre && currGenre == "hip hop") ||  ( currGenre && currGenre == "rap" )){
		var ctaLayer1 = new google.maps.KmlLayer(INNERCITY);
		map_object.setZoom(20);
		setMarker(map_object, routes[1][1], 1, 1);
	}else{
		var ctaLayer1 = new google.maps.KmlLayer(GOLDENCIRCLE);
		setMarker(map_object, routes[0][1], 0, 1);
	}
	
	ctaLayer1.setMap(map_object); 
		
}

function getHorse()
{
	
	if( currGenre )
	{	
		var image = 'img/selection/';
		switch( currGenre )
		{
			case "pop" : image += horses[6][0]; OFFSET = 18; break;
			case "electronic" : image += horses[2][Math.floor(Math.random() * (horses[2].length))]; OFFSET = 30; break;
			case "punk" : image += horses[4][Math.floor(Math.random() * (horses[2].length))]; OFFSET = 90; break;
			case "wierd": image += horses[4][1]; OFFSET = 100; break;
			case "rap" :
			case "hip hop" : image += horses[5][0]; OFFSET = 8; break;
			default:
				if( randomType == 5 ) // Never the gangsta horse
					randomType = 3;
				image += horses[randomType][randomHorse]; 
				OFFSET = 40; 
				break;
		}
		if( INTERVAL == 1000 )
			OFFSET += 15;
		return image;
	}else
		return null;

}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function setAndClearMarkers()
{
	
	//console.log("SetMarkers");
	horseMarker.setMap(null);
	horseMarker = null;
	if( currentIndex+OFFSET > routes[currentRoute].length)
		currentIndex = 0+OFFSET;
	if( routes[currentRoute][currentIndex][0] > routes[currentRoute][currentIndex+OFFSET][0] ){
		if( !image || !endsWith(image, 'l.gif' ) )
			image = getHorse() + 'l.gif';
	}else{
		if( image || !endsWith(image, 'r.gif' ) )
			image = getHorse() + 'r.gif';	
	}
	
	setMarker(map_object, routes[currentRoute][currentIndex], currentRoute, currentIndex);
 }
function setMarker(map, location, currRoute, currIndex ) {
  
 
  currentRoute = currRoute;
  currentIndex = (currIndex+OFFSET);
  
  var myLatLng = new google.maps.LatLng(location[1], location[0]);
  horseMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image,
      zIndex: 0,
      clickable: false
  });
 
	if( routes[currentRoute][currentIndex][0] < routes[currentRoute][currentIndex-OFFSET][0] ){
		//console.log("hm going back?");
		currAttr = 0;
	}else{
		
  	 if( location[0] > routesAttraction[currRoute][currAttr][1] ){
  		
  		console.log("Passed? " + location[0] + " <> "  + routesAttraction[currRoute][currAttr][1]);	
	  	
	  	if( OFFSET <= 40 ){
  			if( currGenre == "hip hop" || currGenre == "rap" )
  				$("#mapSnippet").html("<h1>Im just to gangsta to care!!</h1>");
  			else		
	  			$("#mapSnippet").html("<h1>Aaah Iceland Iceland</h1>");
	  		
	  	}else{
	  		// get klm snippet ??? 
	  		$("#mapSnippet").html("<h1>Dang you missed a spot! You are riding to fast!</h1>");
  		}
  		
  		$("#mapSnippet").fadeIn(2000);
  		$("#mapSnippet").fadeOut(2000);
  		currAttr++; 
  		}
  	}
  //map_object.setCenter(myLatLng); 
  currentIndex++;

}
