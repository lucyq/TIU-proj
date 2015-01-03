
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
		request.open("GET", data_link, true);
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState==4 && request.status==200) {
				
				data = JSON.parse(request.responseText);
			
				renderMarkers();
			}
	};
		map.panTo(BLS);

};

function renderMarkers() {

	for (k in data) {
		var address = data[k]["location_address"];
		var location_name = data[k]["location_name"];
						console.log(location_name);
		geocoder.geocode({'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var pos = results[0].geometry.location;
			
				var marker = new google.maps.Marker({
					map: map,
					icon: '../images/marker.png',
					position: pos
				});


				var contentString = "<div class='infoDiv'><h4>" + location_name + "</h4><p>" + address + "</p></div>";
				

				var infoWindow = new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 200
				});

				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.open(map, marker);
				});
			}
		});
	}
}