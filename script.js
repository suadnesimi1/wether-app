const apiKey = '0867accd62fba21cb2fce680fc92119d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Elements for user input and displaying weather data
const locationInput = document.getElementById('searchLocation');
const searchButton = document.getElementById('searchButton');
const userLocationElement = document.getElementById('userLocation');
const userTemperatureElement = document.getElementById('userTemperature');
const userDescriptionElement = document.getElementById('userDescription');
const weatherIconElement = document.getElementById('weatherIcon'); // Image element for the weather icon
const precipitationElement = document.getElementById('precipitation'); // Precipitation element
const humidityElement = document.getElementById('humidity'); // Humidity element
const windElement = document.getElementById('wind'); // Wind element
const dateTimeElement = document.getElementById('dateTime'); // Element for displaying date and time

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

// Function to fetch weather based on location
function fetchWeather(location) {
    const encodedLocation = encodeURIComponent(location);
    const url = `${apiUrl}?q=${encodedLocation}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            userLocationElement.textContent = 'Error';
            userTemperatureElement.textContent = '';
            userDescriptionElement.textContent = '';
            weatherIconElement.src = ''; // Clear icon on error
            precipitationElement.textContent = '';
            humidityElement.textContent = '';
            windElement.textContent = '';
            dateTimeElement.textContent = '';
        });
}

// Function to fetch weather based on geographic coordinates
function fetchWeatherByCoords(lat, lon) {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            userLocationElement.textContent = 'Error';
            userTemperatureElement.textContent = '';
            userDescriptionElement.textContent = '';
            weatherIconElement.src = ''; // Clear icon on error
            precipitationElement.textContent = '';
            humidityElement.textContent = '';
            windElement.textContent = '';
            dateTimeElement.textContent = '';
        });
}

// Function to update weather information in the DOM
function updateWeatherInfo(data) {
    userLocationElement.textContent = data.name;
    userTemperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    userDescriptionElement.textContent = data.weather[0].description;
    precipitationElement.textContent = `Precipitation: ${data.clouds.all}%`;
    humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    windElement.textContent = `Wind: ${data.wind.speed} km/h`;

    // Set the weather icon based on the weather condition
    const weatherIconCode = data.weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`; // Set the icon URL

    // Calculate and display the local date and time
    const timezoneOffset = data.timezone; // Timezone offset in seconds
    const localTime = new Date(Date.now()); // Convert to local time

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    const dateTimeString = localTime.toLocaleString('en-US', options);

    dateTimeElement.textContent = `${dateTimeString}`;
}

// Check if geolocation is available and get weather for current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeatherByCoords(latitude, longitude);
        },
        error => {
            console.error('Geolocation error:', error);
            // If location access is denied or unavailable, default to Istanbul
            fetchWeatherByCoords(41.0082, 28.9784); // Istanbul coordinates
        }
    );
} else {
    // If geolocation is not supported, default to Istanbul
    fetchWeatherByCoords(41.0082, 28.9784); // Istanbul coordinates
}
