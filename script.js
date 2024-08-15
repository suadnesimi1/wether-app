const apiKey = '0867accd62fba21cb2fce680fc92119d';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('searchLocation');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim(); // Trim any extra spaces
    if (location) {
        fetchWeather(location);
    } else {
        alert("Please enter a location.");
    }
});

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
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            locationElement.textContent = 'Error';
            temperatureElement.textContent = '';
            descriptionElement.textContent = '';
        });
}
