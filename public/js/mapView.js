/* G L O B A L   V A R I A B L E S */
var BLS;
var BLS_lat = 42.3380;
var BLS_long = -71.1020;
var map;


var mapOptions = {
	zoom: 13,
	center: BLS, 
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init() {
	BLS = new google.maps.LatLng(BLS_lat, BLS_long);

	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
//	ONCE HAVE DATA SOURCE, SEND REQUEST AND ONLY RENDER IF SUCCESS	
//  var request = new XMLHttpRequest();	
//	request.open("GET", "http://YOURLINKHERE", true);
//	request.send();
//	request.onreadystatechange = function() {
// 	if (request.readyState==4 && request.status==200) {
// 			renderMap();
// 		}
//	data = JSON.parse(request.responseText);
//	renderMap();
		map.panTo(BLS);

};

/*
function renderMap() {
	// create map
	// update map and go there!

};

*/
