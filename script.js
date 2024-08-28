const apiKey = '0867accd62fba21cb2fce680fc92119d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('searchLocation');
const searchButton = document.getElementById('searchButton');
const userLocationElement = document.getElementById('userLocation');
const userTemperatureElement = document.getElementById('userTemperature');
const userDescriptionElement = document.getElementById('userDescription');

// Event listener for the search button


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
            if (data.cod === '401') { // Check for string '401'
                throw new Error('Invalid API key');
            } else if (data.cod === '404') { // Handle location not found
                throw new Error('Location not found');
            }
            // Update the user location area with the searched location
            userLocationElement.textContent = data.name;
            userTemperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            userDescriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            userLocationElement.textContent = 'Error';
            userTemperatureElement.textContent = '';
            userDescriptionElement.textContent = '';
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
            userLocationElement.textContent = data.name;
            userTemperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            userDescriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            userLocationElement.textContent = 'Error';
            userTemperatureElement.textContent = '';
            userDescriptionElement.textContent = '';
        });
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
