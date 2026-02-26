// Constructor Functional Approach to Weather App
function WeatherApp() {
    this.apiKey = "a5dcdeeb26893c7a0ebba08d31ad99cf";

    // Store DOM references
    this.searchInput = document.getElementById("searchInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weatherContainer");
    this.forecastContainer = document.getElementById("forecastContainer");
}

// Initialize App
WeatherApp.prototype.init = function () {
    this.showWelcome();

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
};

// Show Welcome Message
WeatherApp.prototype.showWelcome = function () {
    this.weatherContainer.innerHTML = `
        <h2>Welcome to SkyFetch 🌤</h2>
        <p>Search for a city to see the weather.</p>
    `;
};

// Handle Search
WeatherApp.prototype.handleSearch = function () {
    const city = this.searchInput.value.trim();
    if (!city) return;

    this.getWeather(city);
};

// Fetch Current Weather + Forecast Together
WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();

    try {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;

        const [weatherRes, forecastRes] = await Promise.all([
            fetch(weatherURL),
            fetch(forecastURL)
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
            throw new Error("City not found");
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        this.displayWeather(weatherData);

        const processedForecast = this.processForecastData(forecastData);
        this.displayForecast(processedForecast);

    } catch (error) {
        this.showError(error.message);
    }
};

// Process Forecast Data (Get 5 Days at 12:00)
WeatherApp.prototype.processForecastData = function (forecastData) {
    const list = forecastData.list;

    const dailyForecast = list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyForecast.slice(0, 5);
};

// Display Current Weather
WeatherApp.prototype.displayWeather = function (data) {
    this.weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Condition: ${data.weather[0].description}</p>
    `;
};

// Display 5-Day Forecast
WeatherApp.prototype.displayForecast = function (forecastArray) {
    this.forecastContainer.innerHTML = "";

    forecastArray.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        this.forecastContainer.innerHTML += `
            <div class="forecast-card">
                <h3>${dayName}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

// Show Loading
WeatherApp.prototype.showLoading = function () {
    this.weatherContainer.innerHTML = "<p>Loading...</p>";
    this.forecastContainer.innerHTML = "";
};

// Show Error
WeatherApp.prototype.showError = function (message) {
    this.weatherContainer.innerHTML = `<p style="color:red;">${message}</p>`;
    this.forecastContainer.innerHTML = "";
};

// Create Instance
const app = new WeatherApp();
app.init();