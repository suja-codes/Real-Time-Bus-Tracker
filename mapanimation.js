
//Enter your mapbox access token 
mapboxgl.accessToken = 
	
	//To generate marker in colors 
	const colors =[
	'#00ffff',
	'#7fffd4',
	'#f5f5dc',
	'#5f9ea0',
	'#deb887',
	'#6495ed',
	'#a9a9a9',
	'#e9967a',
	'#8fbc8f',
	'#fffaf0',
	'#f0fff0',
	'#fff0f5',
	'#f08080',
	'#ffb6c1',
	'#87cefa',
	'#b0c4de',
	'#ffe4e1',
	'#ffdab9',
	'#d8bfd8',
	]
	
    

	// Initializing variables
	var Markers = [];

	// To have mapbox layout and to zoom in on select location
	
    var map = new mapboxgl.Map({
        //container ID
		container: 'map',
		//style  
        style :'mapbox://styles/mapbox/dark-v10',
		// starting position [lng, lat]
        center: [-71.104881, 42.365554],
		//starting zoom   
        zoom:12  
    });
	
	//To add fullscreen control to the map
    map.addControl(new mapboxgl.FullscreenControl());
    
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

	var Markers = [];
	
	async function move(){
	// get bus data    
	const locations = await getBusLocations();
	console.log(locations);
	//setting colored markers for each bus
	locations.forEach((bus, i) => {
		var marker = new mapboxgl.Marker({ 'color': colors[i] })
		.setLngLat([bus.attributes.longitude, bus.attributes.latitude])
		.setPopup(new mapboxgl.Popup({offset: 25, closeOnClick: false, closeOnMove: true})
		.setHTML(`<h4>Bus ID : ${bus.attributes.label}<br>${bus.attributes.occupancy_status}</h4>`))
		.addTo(map)
    // toggle popup open or closed
	    .togglePopup(); 
		
		Markers.push(marker);	
	});

	//To keep popups in current bus position 
	function removeMarkers(){
		if (Markers!==null) {
		for (var i = Markers.length - 1; i >= 0; i--) {
		Markers[i].remove();
		}
	}
	}
    //To remove popups
    //const popup = new mapboxgl.Popup().addTo(map);
    //popup.remove();

	locations.forEach((marker, i)=> {
		let popUp = document.getElementsByClassName('mapboxgl-popup-content');
		popUp[i].style.background = colors[i];
		
	});

	setTimeout(removeMarkers,11000)

	// timer
	setTimeout(move, 15000);
}

	// Request bus data for route 1 from MBTA
	async function getBusLocations(){
		const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
		const response = await fetch(url);
		const json     = await response.json();
		return json.data;
	}

	map.on('load', function() {
		move()
	});