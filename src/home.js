const apiKey = 'eab6e1c4cc4f47ec92e24313242910';
const weatherApiUrl = 'https://api.weatherapi.com/v1/current.json';
const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=7`;

document.getElementById('searchButton').addEventListener('click', performSearch);
document.getElementById('locationInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
        performSearch();
    }
});

function performSearch() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        document.getElementById('loadingIndicator').style.display = 'block'; // Show loading
        fetchWeather(location);
        fetchForecast(location);
    } else {
        displayErrorMessage("Please enter a location.");
    }
}

function fetchWeather(location) {
    const url = `${weatherApiUrl}?key=${apiKey}&q=${location}&aqi=no`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Weather data not found for ${location}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            clearErrorMessage();
        })
        .catch(error => {
            displayErrorMessage(error.message);
        })
        .finally(() => {
            document.getElementById('loadingIndicator').style.display = 'none'; // Hide loading
        });
}

function fetchForecast(location) {
    const url = `${apiUrl}&q=${location}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Forecast data not found for ${location}`);
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => console.error(error)); // You might want to handle this error as well
}

function displayWeather(data) {
    updateWeatherInfo(data);
    updateLocalTime(data);
}

function updateWeatherInfo(data) {
    const locationName = `${data.location.name}, ${data.location.country}`;
    const weatherIconUrl = `https:${data.current.condition.icon}`;
    const temperature = `${data.current.temp_c}°C`;
    const windSpeed = `${data.current.wind_kph} kph`;
    const humidity = `${data.current.humidity}%`;
    const rainChance = `${data.current.cloud}%`;

    document.getElementById('location').textContent = locationName;
    document.getElementById('weatherCondition').textContent = data.current.condition.text;
    document.getElementById('weatherIcon').src = weatherIconUrl;
    document.getElementById('currentTemperature').textContent = temperature;
    document.getElementById('windSpeed').textContent = windSpeed;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('chanceOfRain').textContent = rainChance;
}

function updateLocalTime(data) {
    const [date, time] = data.location.localtime.split(' ');
    document.getElementById('localTime').textContent = `Current Time : ${time}`;
    document.getElementById('date').textContent = `Date : ${date}`;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        const iconUrl = `https:${day.day.condition.icon}`;
        forecastCard.innerHTML = `
            <h4>${new Date(day.date).toLocaleDateString()}</h4>
            <img src="${iconUrl}" alt="Weather Icon" class="forecast-icon">
            <p>${day.day.condition.text}</p>
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
            <p>Chance of Rain: ${day.day.daily_chance_of_rain}%</p>
        `;
        forecastDiv.appendChild(forecastCard);
    });
}

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

function clearErrorMessage() {
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
}
