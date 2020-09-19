

const APIURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const APIKEY = "b678e49e1f834e777423d78df270f284";
const IMGURL = "http://openweathermap.org/img/wn/"

const userLocationEl = document.getElementById('user-location'); 
const formEl = document.getElementById('form');
const submitBtn = document.getElementById('submit');

const mainInfoEl = document.querySelector(".main-info");
const otherInfoEl = document.querySelector(".other-info");


const currentLocationEl = document.getElementById('current-location'); 
const imgEl = document.getElementById('img'); 
const TempEl = document.getElementById('temp'); 
const feelsLileEl = document.getElementById('feels-like'); 
const pressureEl = document.getElementById('pressure'); 
const humidityEl = document.getElementById('humidity'); 
const minTempEl = document.getElementById('min-temp'); 
const maxTempEl = document.getElementById('max-temp'); 
const notFoundEl = document.getElementById('not-found');
const notFoundMsgEl = document.getElementById('not-found-msg');



submitBtn.addEventListener('click', (e) => {
    if(userLocationEl.value) {
        e.preventDefault();
        showWeatherInfo(userLocationEl.value); 
    }
});

async function showWeatherInfo(locationValue) {
    let weatherInfo = await getWeatherInfo(locationValue);
    if(weatherInfo.cod == 200) {
        userLocationEl.value = '';
        let weatherIcon = getWeatherIcon(weatherInfo.weather[0].icon);
        imgEl.src = weatherIcon;
        currentLocationEl.innerText = weatherInfo.name;
        TempEl.innerHTML = weatherInfo.main.temp + ' &#176;C';
        feelsLileEl.innerHTML = weatherInfo.main.feels_like + ' &#176;C';
        pressureEl.innerHTML = weatherInfo.main.pressure + ' hPa';
        humidityEl.innerHTML = weatherInfo.main.humidity + ' %';
        minTempEl.innerHTML = weatherInfo.main.temp_min + ' &#176;C';
        maxTempEl.innerHTML = weatherInfo.main.temp_max + ' &#176;C';
        notFoundEl.style.display = 'none';
        mainInfoEl.style.display = 'block';
        otherInfoEl.style.display = 'flex';
    } else { 
        notFoundMsgEl.innerText = locationValue + ' Not Found';
        mainInfoEl.style.display = 'none';
        otherInfoEl.style.display = 'none';
        notFoundEl.style.display = 'block';
    }

}

async function getWeatherInfo(locationValue) {
    const response = await fetch(APIURL + `${locationValue}&appid=` + APIKEY + "&units=metric");
    const responseData = await response.json();
    return responseData;
}

function getWeatherIcon(weatherIcon) {
    return IMGURL + weatherIcon +"@2x.png"
}