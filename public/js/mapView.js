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
	
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var request = new XMLHttpRequest();
		var data_link = "http://localhost/location_data"; // || "tiu-proj.herokuapp.com/location_data";
		request.open("GET", data_link, true);
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200) {
				BLS = new google.maps.LatLng(BLS_lat, BLS_long);
				renderMap();
				data = JSON.parse(request.responseText);	
			}
	};
		map.panTo(BLS);

};


function renderMap() {
//	var locations = data
	// create map
	// update map and go there!

};


