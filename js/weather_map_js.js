$(document).ready(function () {
    'use strict';


    mapboxgl.accessToken = TREVORS_MAP_TOKEN;
    const OPTIMAL_ZOOM_LEVEL = 20;
    const STARTING_COORDS = [-98.4936, 29.4241];
    var weatherURL = `https://api.openweathermap.org/data/2.5/onecall`;
    let dailyWeatherInfo = [];
    let compassHeading;


    const map = new mapboxgl.Map({
        container: 'mapDiv', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-98.4861, 29.4260], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

////// CENTERS MAP AND SETS MARKER AT CENTER WHEN MAP STOPS MOVING, ALLOWS MARKER TO BE SET USING MAPBOX GEOCODE CONTROL ///////
    function onMoveEnd() {
        let coords = map.getCenter();
        marker.setLngLat(coords);
        makePopUpForCoords(coords)
        // console.log(coords);
        // appendWeather();
        dailyWeatherUpdates();
    }

    map.on('moveend', onMoveEnd);

    ////////MAPBOX GEOCODE CONTROLLER, COPIED DIRECTLY FROM WEBSITE//////////

    const geoCoder = new MapboxGeocoder({
        accessToken: TREVORS_MAP_TOKEN,
        zoom: OPTIMAL_ZOOM_LEVEL,
        placeholder: 'Weather Search',
        mapboxgl: mapboxgl,

    })

    $('#searchBox').append(geoCoder.onAdd(map));


    let marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat(STARTING_COORDS)
        .addTo(map);
    marker.on(`load`, loadWeather());
    /*THE 'DRAGEND' IS FROM MAPBOX */
    marker.on('dragend', endOfMarkerDrag);

    //// SETS MARKER AT END OF MARKER DRAG /////
    function endOfMarkerDrag() {
        const coords = marker.getLngLat();
        weatherOptions.lat = coords.lat;
        weatherOptions.lon = coords.lng;

        /* Calling popup function with end of marker drag */
        makePopUpForCoords(coords);
    }

    /* POPUP AND ATTACHMENT TO COORDS */

    function makePopUpForCoords(coords) {
        // console.log(coords);
        /* coords from MAPBOX are an object, need to convert to array */
        const coordArray = [coords.lng, coords.lat];
        const popup = new mapboxgl.Popup({closeOnClick: false})
            .setLngLat(coordArray)
            .setHTML(`${coordArray}`)
        weatherOptions.lat = coordArray[1];
        weatherOptions.lon = coordArray[0];
        marker.setPopup(popup);
        popup.addTo(map);
        loadWeather();
    }














})();

