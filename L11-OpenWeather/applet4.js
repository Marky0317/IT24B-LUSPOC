class WeatherApp {
    constructor() {
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.cityInput = document.getElementById('cityInput');
        this.getWeatherBtn = document.getElementById('getWeatherBtn');
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.weatherCard = document.getElementById('weatherCard');
        this.cityName = document.getElementById('cityName');
        this.temperature = document.getElementById('temperature');
        this.description = document.getElementById('description');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.map = L.map('map').setView([0, 0], 2); 

        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
        this.getWeatherBtn.addEventListener('click', () => this.fetchWeather());
        this.getLocationBtn.addEventListener('click', () => this.fetchWeatherByLocation());

    }

async fetchWeather() {
    const apiKey = this.apiKeyInput.value.trim();
    const city = this.cityInput.value.trim();
    if (!apiKey || !city) {
        alert('Please enter your API key and a city name.');
        return;
    }
    const data = await this.getWeatherData(`q=${city}`, apiKey);
    if (data) this.displayWeather(data);
}async fetchWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async ({ coords: { latitude, longitude } }) => {
                const apiKey = this.apiKeyInput.value.trim();
                const data = await this.getWeatherData(`lat=${latitude}&lon=${longitude}`, apiKey);
                if (data) this.displayWeather(data);
            },
            () => alert('Unable to retrieve your location. Please allow location access.')
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
async getWeatherData(query, apiKey) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found or invalid API key.');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(error.message);
        return null;
    }
}
displayWeather(data) {
    this.cityName.textContent = `${data.name}, ${data.sys.country} (${data.coord.lat}, ${data.coord.lon})`;
    this.temperature.textContent = `Temperature: ${data.main.temp} °C`;
    this.description.textContent = `Weather: ${data.weather[0].description}`;
    this.humidity.textContent = `Humidity: ${data.main.humidity}%`;
    this.windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    this.weatherIcon.src = iconUrl;

    this.weatherCard.style.display = 'block';
    this.map.setView([data.coord.lat, data.coord.lon], 10); 
    L.marker([data.coord.lat, data.coord.lon]).addTo(this.map)
        .bindPopup(`${data.name}`)
        .openPopup();
}
}
document.addEventListener('DOMContentLoaded', () => new WeatherAp());