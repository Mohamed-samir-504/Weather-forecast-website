let cityInput = document.getElementById('city_input'),
searchBtn = document.getElementById('Search-Btn'),
locationBtn = document.getElementById('Location-Btn'),
currentWeatherCard = document.querySelector('.weather-left .card'),
fiveDaysForecastCard = document.querySelector('.day-forecast'),
aqiCard = document.querySelector('.air-indices'),
aqiStatus = document.querySelector('#air .card-head'),
sunCard = document.querySelector('#sun'),
hourlyForecastCard = document.querySelector('.hourly-forecast'),
humidity_value = document.getElementById('humidity-value'),
pressure_value = document.getElementById('pressure-value'),
visibility_value = document.getElementById('visibility-value'),
Wind_speed_value = document.getElementById('Wind-speed-value'),
Feels_like_value = document.getElementById('Feels-like-value'),

api_key = 'b038e5c1e62eb88030ec57464634b8a5';

//console.log(humidity_value.innerHTML);

function getWeatherDetails(name,lat,lon,country,state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLLUTION_API = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    aqi_gases = ["co","nh3","no","no2","o3","pm2_5","pm10","so2"],
    aqi_list = ["Good","Moderate","Fair","Poor","Very Poor"];


    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        //console.log(data);
        let date = new Date();
        
        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>Now</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)} &deg;C</h2>
                    <p>${data.weather[0].description}</p>

                </div>
                <div>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class='bx bxs-calendar'></i> ${days[date.getDay()]}, ${date.getDate()},
                 ${months[date.getMonth()]}, ${date.getFullYear()}</p>

                <p><i class='bx bx-location-plus' ></i> ${name}, ${country}</p>
            </div> 
       `;

        let {sunrise, sunset} = data.sys,
        {timezone, visibility} = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind,
        sunRiseTime = moment.utc(sunrise,'X').add(timezone,'seconds').format('hh:mm A'),
        sunSetTime = moment.utc(sunset,'X').add(timezone,'seconds').format('hh:mm A');


         sunCard.innerHTML = `
            <div class="card-head">
                <p>Sunrise and Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class='bx bxs-sun fa-4x'></i>
                    </div>
                    <div class="sun-data">
                        <p>Sunrise</p>
                        <h2>${sunRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class='bx bx-sun fa-4x' ></i>
                    </div>
                    <div class="sun-data">
                        <p>Sunset</p>
                        <h2>${sunSetTime}</h2>
                    </div>
                </div>
            </div>
        
        `;

        humidity_value.innerHTML = `${humidity} %`;
        pressure_value.innerHTML = `${pressure} hPa`;
        visibility_value.innerHTML = `${visibility/1000} km`
        Wind_speed_value.innerHTML = `${speed} m/s`;
        Feels_like_value.innerHTML = `${(feels_like - 273.15).toFixed(2)} &deg;C`;
        
    }).catch(() => {
        alert('Failed to fetch current weather');
    });



    fetch(AIR_POLLUTION_API).then(res => res.json()).then(data => {
        //console.log(data);
        aqiStatus.innerHTML = `
            <p>Air quality index</p>
            <p class="air-index status-${data.list[0].main.aqi}">${aqi_list[data.list[0].main.aqi - 1]}</p>
        `

        aqiCard.innerHTML = `<i class="bx bx-wind fa-4x"></i>`;

        for(let i = 0; i < aqi_gases.length; i++){
            aqiCard.innerHTML += `
                <div class="air-item">
                    <p>${aqi_gases[i].toUpperCase()}</p>
                    <h2>${data.list[0].components[aqi_gases[i]]}</h2>
                </div>  
            `
        };

    }).catch(() => {
        alert('Failed to fetch air data');
    });



    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        //console.log(data);
        let substr = '12:00:00';
        let count = 0;
        let fiveDaysForecast = data.list.filter(item =>{
            if(item.dt_txt.includes(substr) && count < 5){
                count++;
                return true;
            }
            return false;
        });

        fiveDaysForecastCard.innerHTML = '';
        for(let i = 0; i < fiveDaysForecast.length; i++){
            let date = new Date(fiveDaysForecast[i].dt_txt);

            fiveDaysForecastCard.innerHTML += `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}@2x.png" alt="">
                        <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div> 
            
            `;
        }

        let hourlyForecast = data.list;
        hourlyForecastCard.innerHTML = '';
        for(let i = 0; i < 8; i++){
            let hourlyForecastDate = new Date(hourlyForecast[i].dt_txt),
            hour = hourlyForecastDate.getHours();
            a = 'PM';
            if(hour < 12) a = 'AM';
            if(hour == 0) hour = 12;
            if(hour > 12) hour-=12;

            hourlyForecastCard.innerHTML+= `
                <div class="card">
                    <p>${hour} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)} &deg;C</p>
                </div>
            `

        }
        //console.log(fiveDaysForecast);

    }).catch(() => {
        alert('Failed to fetch current weather');
    });

}


function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';

    if(!cityName) return;
    console.log(cityName);
    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q='${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        // console.log(data);
        let {name,lat,lon,country,state} = data[0];
        getWeatherDetails(name,lat,lon,country,state);

    }).catch(() => {
        alert('Failed to fetch coodinates of ${cityName}');
    });

}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position =>{
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_API_URL).then(res => res.json()).then(data => {
            let {name,country,state} = data[0];
            getWeatherDetails(name,latitude,longitude,country,state);
            
        }).catch(() => {
            alert('Failed to fetch city name');
        });

    }, error =>{
        if(error.code === error.PERMISSION_DENIED){
            alert("Geolocation permission denied. Please allow location access");
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
