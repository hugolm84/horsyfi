
var map_object;
var image = 'img/chevaux-43_r.gif';
var horseMarker;
var OFFSET = 10;

var ctaLayer1 = new google.maps.KmlLayer('https://maps.google.com/maps/ms?ie=UTF8&oe=UTF8&authuser=0&msa=0&output=kml&msid=209542625718007051021.0004a0def5a2439e0d0f9');
//var ctaLayer2 = new google.maps.KmlLayer('https://maps.google.com/maps/ms?authuser=0&vps=9&ie=UTF8&msa=0&output=kml&msid=217451513966778790628.0004cd17a5deee8d62165');
	
	
function initialize() {
	var iceland = new google.maps.LatLng(64.140867, -21.871822)
	
	if (iceland) 
		console.log("got maps");
	else 
		return;		
	var opts = {
		center: iceland,
		panControl: false,
		minZoom: 1,
		maxZoom: 9,
		draggable: false, zoomControl: true, scrollwheel: false,
		scaleControl: false,
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mode: google.maps.TravelMode.WALKING,
		optimizeWaypoints: false,
		disableDefaultUI: true
	};
	
	map_object = new google.maps.Map(document.getElementById("map"), opts);
	
	 
	setMarker(map_object, routes[0][1], 0, 1);
	ctaLayer1.setMap(map_object); 
	/*if( currGenre && currGenre == "pop" ){
	 setMarker(map_object, routes[1][1], 1, 1);
	 ctaLayer1.setMap(map_object);
	}else{
	 setMarker(map_object, routes[0][1], 0, 1);
	 ctaLayer2.setMap(map_object);
	}*/
}

function getHorse()
{
	if( currGenre )
	{	
		var image = 'img/selection/';
		switch( currGenre )
		{
			case "pop" : image += horses[6][0]; OFFSET = 18; break;
			case "electronic" : image += horses[2][0]; OFFSET = 30; break;
			case "punk" : image += horses[4][0]; OFFSET = 90; break;
			case "wierd": image += horses[4][1]; OFFSET = 100; break;
			case "hip hop" : image += horses[5][0]; OFFSET = 24; break;
			default: image += horses[1][0]; OFFSET = 40; break;
		}
		if( INTERVAL == 1000 )
			OFFSET += 15;
			
		return image;
	}else
		return 'img/chevaux-43_';

}
function setAndClearMarkers()
{
	console.log("SetMarkers");
	horseMarker.setMap(null);
	horseMarker = null;
	if( currentIndex+OFFSET > routes[currentRoute].length)
		currentIndex = 0+OFFSET;
	if( routes[currentRoute][currentIndex][0] > routes[currentRoute][currentIndex+OFFSET][0] ){
		image = getHorse() + 'l.gif';
	}else{ 
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
		console.log("hm going back?");
		currAttr = 0;
	}else{
		
  	 if( location[0] > routesAttraction[currRoute][currAttr][1] ){
  		
  		console.log("Passed? " + location[0] + " <> "  + routesAttraction[currRoute][currAttr][1]);	
	  	console.log("OFFSET:" + OFFSET);
  		if( OFFSET <= 40 ){
  			if( currGenre == "hip hop" )
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
