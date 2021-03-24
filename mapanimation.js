mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpb3RtYXQiLCJhIjoiY2tsemQwdW1hMTU0azJua3ZvaW92Z2ZlZSJ9.q1Ohm39684pG_dgEM1htvA';

var map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [-71.0727476236504, 42.36070356143535], 
    zoom: 12
});

/*
var marker = new mapboxgl.Marker()
.setLngLat([-71.092761, 42.357575])
.addTo(map);
*/

var legend = document.getElementById("Bus Legend");
var locationsData = [];
var busLocations = [];
var markers = [];
var colorIndex = ["brown", "cyan", "magenta", "red", "orange", "yellow", "lime", "green", "olive", "aqua", "teal", "blue", "navy", "indigo", "violet", "black", "gray", "silver"]
async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);
	console.log(locations.length);
	for (let j = 0; j < markers.length; j++){
		markers[j].remove();
	}

	busLocations = [];
	markers = [];
	removeAllChildNodes(legend);
		
	for (let i = 0; i < locationsData.length; i++){
		busLocations.push([locationsData[i].attributes.longitude, locationsData[i].attributes.latitude]);
		markers.push(new mapboxgl.Marker({color: colorIndex[i]}));
	}

	for (let j = 0; j < markers.length; j++){
		markers[j].setLngLat([busLocations[j][0], busLocations[j][1]]).addTo(map);
	}

	for (let k = 0; k < markers.length; k++){
		let li = document.createElement("li");
		li.id = "listItem" + k;  //Sets id value for <li> elements
		li.innerHTML = "Bus # " + locationsData[k].id;  //Adds bus # to the legend
		li.style.borderLeftColor = markers[k]._color;  //Sets Legend Color to correspond with bus map marker color
		legend.appendChild(li);  //Adds <li> element to the legend <ul>
	}
	

	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	locationsData = [];
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	locationsData = json.data;
	return json.data;
}

run();

function removeAllChildNodes(parent) {
    parent.innerHTML = '<p class = "legendHeader">BUS LEGEND</p>';
}