// TODO: 
// -render marker color by type 
// -fix infowindow location_name
// -fix infowindow open/close

var BLS;
var BLS_lat = 42.3380;
var BLS_long = -71.1020;


var geocoder;
var service;
var map;



var mapOptions = {
	zoom: 12,
	center: BLS, 
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init() {

	geocoder = new google.maps.Geocoder();
	// service = new google.maps.places.PlacesService(map);

	BLS = new google.maps.LatLng(BLS_lat, BLS_long);
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var request = new XMLHttpRequest();
		request.open("GET", "/location_data", true);
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200) {
				
				data = JSON.parse(request.responseText);
			
				renderMarkers();
			}
	};
		map.panTo(BLS);

};


// var address_array = [];
// var location_array = [];
// var positions = [];


// function storeData() {
// 	var count = 0;
// 	for (k in data) {
// 		address_array[count] = data[k]["location_address"];
// 		location_array[count] = data[k]["location_name"];
		
// 		geocoder.geocode({'address': data[k]["location_address"]}, function(results, status) {
// 			if (status == google.maps.GeocoderStatus.OK) {
// 				positions[count] = results[0].geometry.location;
// 				console.log("curr pos: " + positions[count]);
// 			}
// 		});
// 		count++;
// 	}
// }



function renderMarkers() {

	for (k in data) {
		var address = data[k]["location_address"];
		var location_name = data[k]["location_name"];
						
		geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var pos = results[0].geometry.location;
			
				console.log("YO>");
				var marker = new google.maps.Marker({
					map: map,
					icon: '../images/marker.png',
					position: pos
				});

				var contentString = "<div class='infoDiv'><h4 style='color: #000000'>" + "NAME GOES HERE" + "</h4><p style='color: #000000'>" + results[0].formatted_address + "</p></div>";
				/*
google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
    return function() {
        infowindow.setContent(content);
        infowindow.open(map,marker);
    };
})(marker,content,infowindow));  
				*/

				// var infoWindow = new google.maps.InfoWindow({
				// 	content: contentString,
				// 	maxWidth: 200
				// });

				var infowindow = new google.maps.InfoWindow();

				google.maps.event.addListener(marker, 'click', function(marker, contentString, infowindow) {
					return function () {
						infowindow.setContent(contentString);
						infowindow.open(map, marker);
					};
				}(marker, contentString, infowindow));
			}
		});
	}
}