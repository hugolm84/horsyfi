var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var image = 'img/chevaux-43_r.gif';

function initialize() {
	var iceland = new google.maps.LatLng(64.140867, -21.871822)
	if (iceland) console.log("got maps");
	directionsDisplay = new google.maps.DirectionsRenderer();
	var opts = {
		center: iceland,
		panControl: false,
		zoomControl: false,
		minZoom: 8,
		scaleControl: false,
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mode: google.maps.TravelMode.WALKING,
		optimizeWaypoints: false,
		disableDefaultUI: true
	};
	map = new google.maps.Map(document.getElementById("map"), opts);
	var myLatLng = new google.maps.LatLng(64.136973,-21.874603);
	var horseMarker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      icon: image,
      zIndex: 80
  });
	directionsDisplay.setMap(map);
	//startLoc = [64.136973,-21.874603];
	//setMarkers(map, startLoc);

					try
					{
						$.ajax({
						type: "GET",
						url: "https://maps.google.com/maps/ms?ie=UTF8&oe=UTF8&authuser=0&msa=0&output=kml&msid=209542625718007051021.0004a0def5a2439e0d0f9",
						//dataType: "xml",
						success: function(xml) {
													//alert(xml);
													var xmlNodeCount = 0;
													$(xml).find('coordinates').each(function(node) {
														console.log(node);
													});
											
												}
						});
					}
					catch (e)
					{
						alert(e);
					}
					
	var ctaLayer = new google.maps.KmlLayer('https://maps.google.com/maps/ms ie=UTF8&oe=UTF8&authuser=0&msa=0&output=kml&msid=209542625718007051021.0004a0def5a2439e0d0f9');
	ctaLayer.setMap(map);//calcRoute();
}


function setMarkers(map, locations) {
  
  
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var image = new google.maps.MarkerImage('img/dummy.gif',
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(0, 32));
  /*var shadow = new google.maps.MarkerImage('images/beachflag_shadow.png',
      // The shadow image is larger in the horizontal dimension
      // while the position and offset are the same as for the main image.
      new google.maps.Size(37, 32),
      new google.maps.Point(0,0),
      new google.maps.Point(0, 32));*/
      // Shapes define the clickable region of the icon.
      // The type defines an HTML <area> element 'poly' which
      // traces out a polygon as a series of X,Y points. The final
      // coordinate closes the poly by connecting to the first
      // coordinate.
  var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
    
    var myLatLng = new google.maps.LatLng(locations[0],locations[1]);
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        shape: shape,
        title: "start",
        zIndex: 1
    });
  
}
function calcRoute() {
	
	var waypts = [];
	stop = new google.maps.LatLng(64.249965, -21.826504)
	
	// waypoints
	waypts.push({
		location: new google.maps.LatLng(64.249965, -21.826504),
		stopover: true
	});
	
	waypts.push({
		location: new google.maps.LatLng(64.271435,-21.076103),
		stopover: true
	});
	
	waypts.push({
		location: new google.maps.LatLng(64.422444,-21.209312),
		stopover: true
	});
	
    
	start = new google.maps.LatLng(64.330094, -21.643169);
	end = new google.maps.LatLng(64.298547, -21.465328);
	var request = {
		origin: start,
		destination: end,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: google.maps.DirectionsTravelMode.WALKING
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			var route = response.routes[0];
		}
	});
}