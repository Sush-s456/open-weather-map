 
function WeatherApp() {
  this.apiKey = "a5dcdeeb26893c7a0ebba08d31ad99cf"
  this.cityInput = document.getElementById("city-input")
  this.searchBtn = document.getElementById("search-btn")
  this.weatherDisplay = document.getElementById("weather-display")
  this.recentContainer = document.getElementById("recent-searches")
  this.clearBtn = document.getElementById("clear-history")
  this.recentSearches = []

  this.init()
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", () => {
    const city = this.cityInput.value.trim()
    if (city !== "") {
      this.getWeather(city)
    }
  })

  this.loadRecentSearches()
  this.loadLastCity()

  this.clearBtn.addEventListener("click", () => {
    this.clearHistory()
  })
}

WeatherApp.prototype.getWeather = async function (city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`
    )

    if (!response.ok) {
      throw new Error("City not found")
    }

    const data = await response.json()

    this.displayWeather(data)
    this.saveRecentSearch(city)

  } catch (error) {
    this.weatherDisplay.innerHTML = `<p>${error.message}</p>`
  }
}

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
  `
}

WeatherApp.prototype.loadRecentSearches = function () {
  const stored = JSON.parse(localStorage.getItem("recentSearches")) || []
  this.recentSearches = stored
  this.displayRecentSearches()
}

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()

  this.recentSearches = this.recentSearches.filter(c => c !== city)

  this.recentSearches.unshift(city)

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop()
  }

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches))
  localStorage.setItem("lastCity", city)

  this.displayRecentSearches()
}

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = ""

  this.recentSearches.forEach(city => {
    const button = document.createElement("button")
    button.textContent = city
    button.classList.add("recent-btn")

    button.addEventListener("click", () => {
      this.getWeather(city)
    })

    this.recentContainer.appendChild(button)
  })
}

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity")
  if (lastCity) {
    this.getWeather(lastCity)
  }
}

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches")
  localStorage.removeItem("lastCity")
  this.recentSearches = []
  this.displayRecentSearches()
}

new WeatherApp()