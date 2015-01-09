// TODO: 
// -render marker color by type 
// -fix infowindow location_name
// -fix infowindow open/close
// create filters


// Neighborhoods in Boston
// var neigh1 = ["East Boston",
// "Charlestown",
// "West End/North End",
// "Beacon Hill/Back Bay",
// "Downtown/Chinatown/Bay Village",
// "South End",
// "South Boston/Waterfront",
// "Fenway/Kenmore/Mission Hill",
// "Allston/Brighton",
// "Roxbury",
// "Dorchester",
// "Jamaica Plain", 
// "West Roxbury",
// "Roslindale",
// "Mattapan ",
// "Hyde Park"];

// // North/E of Boston
// var neigh2 = [ 
// "Winthrop", "Revere",
// "Chelsea",
// "Everett",
// "Malden",
// "Medford"];
// // N/W of Boston
// var neigh3 = ["Arlington",
// "Somerville
// ",
// "Cambridge
// ",
// "Belmont
// ",
// "Watertown
// "];

// // "West of Boston",
// var neigh4 = [
// "Waltham",
// "Newton",
// "Brookline
// ",
// "Needham
// ",
// "Dedham
// "];
// // South of Boston
// [
// "Milton
// ",
// "Quincy
// ",
// "Braintree
// "
// ];
// var location_names[][];


var formatted_data = [{"resource_type":"cafeteria", "locations":[], "image":"../images/marker1.png"},
			{"resource_type":"convenience_store", "locations":[], "image":"../images/marker2.png"},
			{"resource_type":"farmers_market", "locations":[], "image":"../images/marker3.png"},
			{"resource_type":"fast_food", "locations":[], "image":"../images/marker4.png"},
			{"resource_type":"garden/farm", "locations":[], "image":"../images/marker5.png"},
			{"resource_type":"grocery_store", "locations":[], "image":"../images/marker6.png"},
			{"resource_type":"liquor_store", "locations":[], "image":"../images/marker7.png"},
			{"resource_type":"restaurant", "locations":[], "image":"../images/marker8.png"},
			{"resource_type":"other", "locations":[], "image":"../images/marker9.png"},
						];
					
var BLS;
var BLS_lat = 42.3380;
var BLS_long = -71.1020;

var toggle_all = true;

var geocoder;
var service;
var map;

var num_resource_types = 9;

var resource_type_bools = [];

for (var i = 0 ; i < num_resource_types; i++) {
	resource_type_bools[i] = true;
}



var mapOptions = {
	zoom: 12,
	center: BLS, 
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init() {
	//createFilterContent();

	geocoder = new google.maps.Geocoder();
	// service = new google.maps.places.PlacesService(map);

	BLS = new google.maps.LatLng(BLS_lat, BLS_long);
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	var request = new XMLHttpRequest();
	if (toggle_all) {
		request.open("GET", "/location_data", true);

	} else {

		request.open("GET", "/location_data", true);
	}
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200) {
				
				data = JSON.parse(request.responseText);
				console.log("DATA: " + data[0]);
				storeData();
				renderMarkers();
			}
	};
		map.panTo(BLS);

};


function storeData() {
	for (k in data) {
		var resource_type = data[k]["location_type"];
		var index;
		switch (resource_type) {
			case "cafeteria":
				index = 0;
				break;
			case "convenience_store":
				index = 1;
				break;
			case "farmers_market":
				index = 2;
				break;
			case "fast_food":
				index = 3;
				break;
			case "garden/farm":
				index = 4;
				break;
			case "grocery_store":
				index = 5;
				break;
			case "liquor_store":
				index = 6;
				break;
			case "restaurant":
				index = 7;
				break;
			case "other":
				index = 8;
				break;
		}

		if (resource_type != null) {
			var loc = data[k]["location_address"];
			var lat = data[k]["lat"];
			var lng = data[k]["lng"];
			var name = data[k]["location_name"];
			var curr_location = [lat, lng, name, loc];
		//	console.log("STORING: " + curr)
			// curr_location.push(lat);
			// curr_location.push(lng);
			// curr_location.push(loc);
			formatted_data[index]["locations"].push(curr_location);
		}

	}

}



function createFilterContent() {
	// for (int i = 0; i < num_areas; i++) {
	// 	for (int j = 0; j < ) {
	// 		$("#location_checkboxes").append("<input type>" + location_names[i][j])
	// 	}
	// }
//	$("#location_checkboxes").append("HEADER HERE")


}


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
	for (var i = 0; i < num_resource_types; i++) {
		if (resource_type_bools[i]) {
			renderResourceType(i);

			var addresses = formatted_data[i]["locations"]; // array of location data
			// console.log("LOL: " + addresses[0]);

			// console.log(addresses);
			
		
			for (var j = 0; j < addresses.length; j++) {
			
				var lat = formatted_data[i]["locations"][j][0]; 
				var lng = formatted_data[i]["locations"][j][1];
				var name = formatted_data[i]["locations"][j][2];
				var address = formatted_data[i]["locations"][j][3];

				if (lat != undefined && lng != undefined) {

				// console.log("lat: " + lat);
				// console.log("lng: " + lng);
					var pos = new google.maps.LatLng(lat, lng);
				// console.log("POS: " + pos);
						
					var marker = new google.maps.Marker({
						map: map,
						icon: formatted_data[i]["image"],
						position: pos
					});

					var contentString = "<div class='infoDiv'><h4 style='color: #000000'>" + name + "</h4><p style='color: #000000'>" + address + "</p></div>";

					var infowindow = new google.maps.InfoWindow();

					google.maps.event.addListener(marker, 'click', function(marker, contentString, infowindow) {
						return function () {
							infowindow.setContent(contentString);
							infowindow.open(map, marker);
						};
					}(marker, contentString, infowindow));
				}
			}

		}
	}
} 



function renderResourceType(index) {
	

}



/*

function renderMarkers() {

	for (k in data) {
		var address = data[k]["location_address"];
		var location_name = data[k]["location_name"];
						
		geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var pos = results[0].geometry.location;
			
				var marker = new google.maps.Marker({
					map: map,
					icon: '../images/marker.png',
					position: pos
				});

				var contentString = "<div class='infoDiv'><h4 style='color: #000000'>" + "NAME GOES HERE" + "</h4><p style='color: #000000'>" + results[0].formatted_address + "</p></div>";

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

*/



/* FILTERING */
function filterType() {

}


