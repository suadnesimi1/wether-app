const apiKey = '0867accd62fba21cb2fce680fc92119d';


// UI elements
const userLocation = document.getElementById("userLocation");
const userTemp = document.getElementById("userTemperature");
const userDesc = document.getElementById("userDescription");
const weatherIcon = document.getElementById("weatherIcon");
const precipitation = document.getElementById("precipitation");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const forecastGrid = document.getElementById("forecastGrid");

// ------------------------------
// GEOLOCATION
// ------------------------------
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successLocation, deniedLocation);
} else {
    deniedLocation();
}

function successLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeatherByCoords(lat, lon);
    getForecastByCoords(lat, lon);
}

function deniedLocation() {
    // No crash, just message
    userLocation.innerText = "Location blocked. Please search for a city.";
}

// ------------------------------
// CURRENT WEATHER BY COORDS
// ------------------------------
async function getWeatherByCoords(lat, lon) {
    try {
        const url = 
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        displayWeather(data);
    } catch (e) {
        console.error("Weather error:", e);
    }
}

// ------------------------------
// CURRENT WEATHER BY CITY
// ------------------------------
async function getWeatherByCity(city) {
    try {
        const url = 
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            alert("City not found.");
            return;
        }

        displayWeather(data);
        getForecastByCoords(data.coord.lat, data.coord.lon);
    } catch (e) {
        console.error("City weather error:", e);
    }
}

// ------------------------------
// UPDATE CURRENT WEATHER UI
// ------------------------------
function displayWeather(data) {
    if (!data || !data.main) return;

    userLocation.innerText = data.name;
    userTemp.innerText = Math.round(data.main.temp) + "°C";
    userDesc.innerText = data.weather[0].description;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
    wind.innerText = `Wind: ${Math.round(data.wind.speed)} km/h`;

    const rain = data.rain?.["1h"] ?? 0;
    precipitation.innerText = `Precipitation: ${rain}%`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// ------------------------------
// 7 DAY FORECAST — ONE CALL API
// ------------------------------
async function getForecastByCoords(lat, lon) {
    try {
        const url =
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const res = await fetch(url);
        const data = await res.json();

        generate7DayForecast(data.daily);
    } catch (e) {
        console.error("Forecast error:", e);
    }
}

function generate7DayForecast(days) {
    if (!days) return;

    forecastGrid.innerHTML = "";

    days.slice(0, 7).forEach(day => {
        const date = new Date(day.dt * 1000);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

        const card = `
            <div class="forecast-card">
                <h4>${weekday}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.temp.day)}°C</p>
            </div>
        `;

        forecastGrid.innerHTML += card;
    });
}

// ------------------------------
// SEARCH EVENTS
// ------------------------------
document.getElementById("searchButton")
.addEventListener("click", () => {
    const city = document.getElementById("searchLocation").value.trim();
    if (city !== "") getWeatherByCity(city);
});

document.getElementById("citySelector")
.addEventListener("change", (e) => {
    if (e.target.value !== "") getWeatherByCity(e.target.value);
});

// ------------------------------
// LIVE DATE & TIME
// ------------------------------
setInterval(() => {
    document.getElementById("dateTime").innerText =
        new Date().toLocaleString();
}, 1000);
