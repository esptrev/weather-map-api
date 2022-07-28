$(document).ready(function () {
    'use strict';

    /*DEFAULT STARTING LOCATION---WILL BE OVERIDDEN WITH SHOWPOSITION IF SUPPORTED BY BROWSER */
    var lat = 29.424349;
    var long = -98.491142;

    /* SHOWPOSITION ALLOWS THE CAPTURE OF USERS LOCATION VIA BROWSER--WILL USE TO SET ORIGINAL MAP/WEATHER LOOKS LIKE I NEED TO USE A/A TO CAPTURE LOCATION BEFORE MAP LOADS WITH DEFUALT LAT/LONG
    const showPosition = (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        return (lat + long);
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

     */


    /* RETURNS A START CITY BASED ON LAT/LONG ABOVE CALLS REVERSEGEO FROM API.JS  CAN UTILIZE SHOW POSITION WITH ASYNC/AWAIT */
    function getStartCity(lat, log) {
        reverseGeocode({lat: lat, lng: log}, TREVORS_MAP_TOKEN)
            .then(function (res) {
                console.log(res);
            })
    }

    getStartCity(lat, long);


    /*CREATES MAP WITH OPTIONS*/

    const createMap = (latitude, longitude) => {
        mapboxgl.accessToken = TREVORS_MAP_TOKEN;
        let mapOptions = {
            container: 'mapDiv',
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [longitude, latitude], // starting position [lng, lat]
            zoom: 7 // starting zoom
        }
        return new mapboxgl.Map(mapOptions);
    }

/*CONVERTS COMPASS BEARING TO NOMINAL HEADING*/

    function convertToHeading(num) {
        let val = Math.floor((num / 22.5) + 0.5);
        var compassHeading = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return compassHeading[(val % 16)];
    }

    function destructureWeatherData(singleDay) {
        console.log(singleDay);
        const myDate = new Date(singleDay.dt * 1000).toString();
        const sunriseTime = new Date(singleDay.sunrise * 1000).toString();
        const sunsetTime = new Date(singleDay.sunset * 1000).toString();

        return {

            dayOfWeek: myDate.slice(0, 10),
            highTemp: parseInt(singleDay.temp.max),
            lowTemp: parseInt(singleDay.temp.min),
            windSpeed: parseInt(singleDay.wind_speed),
            windHeading: singleDay.wind_deg,
            weatherIcon: `<img  src='http://openweathermap.org/img/wn/${singleDay.weather[0].icon}@2x.png' alt={cccc}>`,
            description: singleDay.weather[0].description,
            sunSet: sunsetTime.slice(16, 21),
            sunRise: sunriseTime.slice(16, 21),
            inchesOfMercury: (singleDay.pressure * 0.0295301).toFixed(2),

        }
    }


    /*CREATES THE HTML FOR POPULATING WEATHERCARDS*/

    function createDailyWeatherCard(data) {
        let dailyWeather = destructureWeatherData(data);
        var html =
            `
			<div class="col-12 col-sm-6 col-lg-3">
				
				<div id="cardBody" class="card-body clear">
				    <div id="dayOfWeek" class="card-body">${dailyWeather.dayOfWeek}</div>
					<div id="highLow">H:${dailyWeather.highTemp}°F / L:${dailyWeather.lowTemp}°F</div>
					<div id="icon">${dailyWeather.weatherIcon}</div>
					<div id="forecast">${dailyWeather.description}</div>
					<div id="wind">Wind: ${dailyWeather.windSpeed} mph / ${convertToHeading(dailyWeather.windHeading)}</div>
					<div id="pressure">Barometer: ${dailyWeather.inchesOfMercury} inHg</div>
					<div id="sun">Dawn: ${dailyWeather.sunRise} -- Dusk: ${dailyWeather.sunSet}</div>
				</div>
			</div>`;
        return html;
    }

    /*LIMITS FORECAST TO 5 DAYS*/

    function loopThroughWeatherData(weather) {
        $(`#cardStack`).html('');
        for (let i = 0; i < 5; i++) {
            $(`#cardStack`).append(createDailyWeatherCard(weather[i]));
        }
    }

    /*WEATHER CALL PLACED HERE DUE TO SCOPE---INSIDE DOC READY FUNC CANNOT BE CALLED FROM API.JS*/

    function retrieveWeatherData(lat, long) {
        $.get("https://api.openweathermap.org/data/2.5/onecall", {

            APPID: TREVORS_WEATHER_MAP_KEY,
            lat: lat,
            lon: long,
            units: "imperial",
            exclude: "minutely,hourly,alerts"

        }).done(function (data) {
            const dailyData = data.daily;
            console.log(dailyData)
            loopThroughWeatherData(dailyData);
        })

    }


    /* INITS PAGE---DONT REALLY NEED BUT SEE WHERE I END UP*/
    function initPage(lat, lon) {
        createMap(lat, lon);
        retrieveWeatherData(lat, lon);
    }

    initPage(lat, long);


})///END OF DOCUMENT READY FUNCTION  DO NOT DELETE