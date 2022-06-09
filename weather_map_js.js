(function () {
    'use strict';
    const OPEN_WEATHER_APPID = TREVORS_WEATHER_MAP_KEY;
    mapboxgl.accessToken = TREVORS_MAP_TOKEN;
    const OPTIMAL_ZOOM_LEVEL = 20;
    const STARTING_COORDS = [-98.4936, 29.4241];
    const weatherURL = `http://api.openweathermap.org/data/2.5/onecall`;
    let dailyWeatherInfo = [];
    let compassHeading;

    var weatherOptions = {
        lat: 29.4241, /* i want coords to feed from map center */
        lon: -98.4936,
        appid: TREVORS_WEATHER_MAP_KEY,
        units: "imperial"
    };

    const map = new mapboxgl.Map({
        container: 'mapDiv', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        center: [-98.4861, 29.4260], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

////// CENTERS MAP AND SETS MARKER AT CENTER WHEN MAP STOPS MOVING, ALLOWS MARKER TO BE SET USING MAPBOX GEOCODE CONTROL ///////
    function onMoveEnd() {
        var coords = map.getCenter();
        marker.setLngLat(coords);
        makePopUpForCoords(coords)
        // console.log(coords);
        // appendWeather();
        dailyWeatherUpdates();
    }

    map.on('moveend', onMoveEnd);

    ////////MAPBOX GEOCODE CONTROLLER, COPIED DIRECTLY FROM WEBSITE//////////

    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            zoom: OPTIMAL_ZOOM_LEVEL,
            placeholder: 'Search Box',
            mapboxgl: mapboxgl,
            marker: false,
        })
    );

    var marker = new mapboxgl.Marker({
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
        console.log(coords);
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


    function loadWeather() {
        $.get(weatherURL, weatherOptions).done(function (data) {
            console.log(data);
            dailyWeatherInfo = data.daily;
            console.log(dailyWeatherInfo);
            // convertWeatherData(dailyWeatherInfo);
            dailyWeatherUpdates(dailyWeatherInfo);

        })

    }

    function dailyWeatherUpdates(weather) {
        $(`#cardStack`).html('');
        weather.forEach(function (day) {
            console.log(day);
            var dailyHTML = createDailyForecastHTML(day);
            $(`#cardStack`).append(dailyHTML);
        })

    }

    function degToCompass(num) {
        var val = Math.floor((num / 22.5) + 0.5);
        compassHeading = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return compassHeading[(val % 16)];
    }

    function createDailyForecastHTML(singleDay) {
        var myDate = new Date(singleDay.dt * 1000).toString();
        var dayOfWeek = (myDate.slice(0,3));
        var parsedHighTemp = (parseInt(singleDay.temp.max));
        var parsedLowTemp = (parseInt(singleDay.temp.min));
        var windSpeed = (parseInt(singleDay.wind_speed));
        var windHeading = singleDay.wind_deg;
        var weatherIcon = `<img  src='http://openweathermap.org/img/wn/${singleDay.weather[0].icon}@2x.png' alt={cccc}>`
        // degToCompass(windHeading);
        var sunsetTime = new Date(singleDay.sunset * 1000).toString();
        var sunSet = sunsetTime.slice(16,21);
        var sunriseTime = new Date(singleDay.sunrise * 1000).toString();
        var sunRise = sunriseTime.slice(16,21);
        var inchesOfMercury = (singleDay.pressure * 0.0295301).toFixed(2);
        // language = HTML
        var html = `
			<div class="col-3">
				
				<div id="cardBody" class="card-body">
				    <div id="dayOfWeek" class="card-body">${dayOfWeek}</div>
					<div id="highLow">H:${parsedHighTemp}°F / L:${parsedLowTemp}°F</div>
					<div id="icon">${weatherIcon}</div>
					<div id="forecast">${singleDay.weather[0].description}</div>
					<div id="wind">${windSpeed} mph / ${degToCompass(windHeading)}</div>
					<div id="pressure">${inchesOfMercury}" inHg</div>
					<div id="sun">${sunRise}/${sunSet}</div>
				</div>
			</div>`


        return html;

    }










})();


// ////////USE THIS FUNCTION TO CONVERT DEGREES TO HEADING///////////
// function degToCompass(num) {
//     var val = Math.floor((num / 22.5) + 0.5);
//     var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
//     return arr[(val % 16)];
// }

function onSuccessfulLoad(data) {

}
