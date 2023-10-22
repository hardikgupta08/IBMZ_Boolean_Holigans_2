const q = (e, n = document) => n.querySelector(e);
const qa = (e, n = document) => n.querySelectorAll(e);

let projectData = [
	// {
	// 	id: 1,
	// 	lat: 45.4862385,
	// 	lng: 9.2170785,
	// 	label: "Stanza #1",
	// 	stanza: "Singola",
	// 	genere: "Ragazzo",
	// 	zona: "Loreto",
	// 	value: "1000000",
	// 	project_description: "Descrizione stanza 1",
	// },
	// {
	// 	id: 2,
	// 	lat: 45.474288,
	// 	lng: 9.2054146,
	// 	label: "Stanza #2",
	// 	stanza: "Singola",
	// 	genere: "Ragazza",
	// 	zona: "Porta Venezia",
	// 	value: "1000000",
	// 	project_description: "Descrizione stanza 2",
	// },
	// {
	// 	id: 3,
	// 	lat: 45.4771041,
	// 	lng: 9.1701771,
	// 	label: "Stanza #3",
	// 	stanza: "Matrimoniale",
	// 	genere: "Ragazzo",
	// 	zona: "Sempione",
	// 	value: "1000000",
	// 	project_description: "Descrizione stanza 3",
	// },
	// {
	// 	id: 4,
	// 	lat: 45.4926057,
	// 	lng: 9.1928587,
	// 	label: "Stanza #4",
	// 	stanza: "Doppia",
	// 	genere: "Ragazza",
	// 	zona: "Zara",
	// 	value: "1000000",
	// 	project_description: "Descrizione stanza 4",
	// },
	// {
	// 	id: 5,
	// 	lat: 45.4886207,
	// 	lng: 9.20548596,
	// 	label: "Stanza #5",
	// 	stanza: "Matrimoniale",
	// 	genere: "Ragazzo",
	// 	zona: "Centrale",
	// 	value: "1000000",
	// 	project_description: "Descrizione stanza 5",
	// }
];

function initMap() {

	let markers = [];
	let Filters = {};

	const map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 30.734417, lng: 76.771611 },
		zoom: 12,
		mapTypeControl: false,
		styles: [{ "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] }, { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] }, { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#eeeeee" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#7b7b7b" }] }, { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#c8d7d4" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#070707" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#ffffff" }] }]
	});
	const card = document.getElementById("pac-card");
	const input = document.getElementById("pac-input");
	const options = {
		fields: ["formatted_address", "geometry", "name"],
		strictBounds: false,
		types: ["establishment"],
	};

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

	const autocomplete = new google.maps.places.Autocomplete(input, options);

	autocomplete.bindTo("bounds", map);

	const infoWindow = new google.maps.InfoWindow({
		disableAutoPan: false,
	});

	const marker = new google.maps.Marker({
		map,
		anchorPoint: new google.maps.Point(0, -29),
	});

	autocomplete.addListener("place_changed", () => {
		marker.setVisible(false);

		const place = autocomplete.getPlace();
		fetchFoodShelters();

		if (!place.geometry || !place.geometry.location) {
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

		marker.setPosition(place.geometry.location);
		marker.setVisible(true);
	});

	const clickhandler = function (e) {
		infoWindow.open(map, this);
		infoWindow.setPosition(this.position);
		infoWindow.setContent(Object.keys(this.data).map(k => [k, this.data[k]].join(': ')).join('<br />'));
		
	};


	const changehandler = (e) => {
		let bounds = new google.maps.LatLngBounds();
		if (e.target.selectedIndex == 0 && Filters.hasOwnProperty(e.target.name)) {
			delete Filters[e.target.name];
		} else {
			Filters[e.target.name] = e.target.value;
		}

		infoWindow.close();

		markers.forEach(mkr => mkr.setVisible(false));

		let filtered = markers.filter(function (mkr) {
			let res = true;
			Object.keys(Filters).forEach(name => {
				res = res && Filters[name] === mkr.data[name];
			});
			return res;
		});

		filtered.forEach(mkr => {
			mkr.setVisible(true);
			bounds.extend(mkr.position);
		});

		if (!bounds.isEmpty()) map.fitBounds(bounds);
	};


	Object.keys(projectData).forEach(k => {
		let json = projectData[k];
		console.log(json)
		let args = {
			position: { lat: Number(json.lat), lng: Number(json.lng) },
			title: json.stanza,
			data: json,/* This is ALL the json data for this marker - this is used in the filter!! */
			map: map
		};
		let marker = new google.maps.Marker(args);
		google.maps.event.addListener(marker, 'click', clickhandler);

		markers.push(marker);
	});

	//assign change event handlers to select menus
	qa('.filter').forEach(n => {
		n.addEventListener('change', changehandler);
	});

	function fetchFoodShelters() {
		radiusReal = document.getElementById("radius");
		console.log(radiusReal.value)
        const request = {
            location: map.getCenter(),
            radius: radiusReal.value, // Adjust the radius as needed (in meters)
            type: "Food Bank", // You can use "restaurant" for food shelters
        };
        const service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createFoodShelterMarker(results[i]);
                }
            }
        });
    }

    // Function to create markers for food shelters
    function createFoodShelterMarker(place) {
        const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent(place.name);
            infoWindow.open(map, this);
			
        });
    }
	radiusReal = document.getElementById("radius")
	radiusReal.addEventListener("change",fetchFoodShelters());
   
}

window.initMap = initMap;