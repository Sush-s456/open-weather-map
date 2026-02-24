const apiKey = "a5dcdeeb26893c7a0ebba08d31ad99cf";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageDiv = document.getElementById("message");

async function getWeather(city) {

  if (!city.trim()) {
    showError("Please enter a city name.");
    return;
  }

  showLoading();
  searchBtn.disabled = true;

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    document.getElementById("city").textContent = data.name;
    document.getElementById("temperature").textContent =
      "Temperature: " + data.main.temp + "°C";
    document.getElementById("description").textContent =
      data.weather[0].description;
    document.getElementById("icon").src =
      `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    messageDiv.innerHTML = "";

  } catch (error) {
    showError("City not found. Please try again.");
  } finally {
    searchBtn.disabled = false;
  }
}

function showError(message) {
  messageDiv.innerHTML = `<p class="error">${message}</p>`;
}

function showLoading() {
  messageDiv.innerHTML = `<p class="loading">Loading...</p>`;
}

searchBtn.addEventListener("click", function () {
  getWeather(cityInput.value);
  cityInput.value = "";
});

cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather(cityInput.value);
    cityInput.value = "";
  }
});