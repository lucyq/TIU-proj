/* G L O B A L   V A R I A B L E S */
var BLS;
var BLS_lat = 42.3380;
var BLS_long = -71.1020;

var geocoder;
var map;


var mapOptions = {
	zoom: 12,
	center: BLS, 
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init() {

	geocoder = new google.maps.Geocoder();
	BLS = new google.maps.LatLng(BLS_lat, BLS_long);
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var request = new XMLHttpRequest();
		var data_link = "/location_data"; 
//		var data_link = "http://localhost:5000/location_data";
		request.open("GET", data_link, true);
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200) {
				
				data = JSON.parse(request.responseText);
				
				renderMarkers();
				// renderMap();
				// console.log(data);	
			}
	};
		map.panTo(BLS);

};

function renderMarkers() {

	for (k in data) {
		var address = data[k]["location_address"];
		geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var pos = results[0].geometry.location;
				console.log("Position: " + pos);
				var marker = new google.maps.Marker({
					map: map,
					icon: '../images/marker.png',
					position: pos
				});

				var infoWindow = new google.maps.InfoWindow();

				var infoList = document.createElement("ul");
				infoList.id = "infoDiv";
				infoList.innerHTML = data[k]["location_name"];

				google.maps.event.addListener(marker, 'click', (function(infoList) {
					return function() {
						infoWindow.setContent(infoList);
						infoWindow.open(map, this);
					}
				})(infoList));
			}
		});
	}
}


function renderMap() {
//	console.log(data[0]["location_address"]);
	// data[i]["location_address"]
//	var locations = data
	// create map
	// update map and go there!

};


