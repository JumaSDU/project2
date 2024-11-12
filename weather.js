const apiKey = "bd96ec1daa5ca42766d5e13ba334d989";
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const unitToggle = document.getElementById("unitToggle");
const locationButton = document.getElementById("locationButton");
const cityInput = document.getElementById("cityInput");
let unit = "metric";

unitToggle.onclick = () => {
  unit = unit === "metric" ? "imperial" : "metric";
  unitToggle.textContent = unit === "metric" ? "°C" : "°F";
  const city = cityInput.value || "auto-location";
  fetchWeather(city);
};

async function fetchWeather(city) {
  if (!city) return;
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&cnt=7&appid=${apiKey}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) throw new Error("City not found");

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData.list);
  } catch (error) {
    currentWeather.innerHTML = `<p>Weather data unavailable for "${city}".</p>`;
    forecast.innerHTML = "";
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&cnt=7&appid=${apiKey}`;

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData.list);
  } catch (error) {
    currentWeather.innerHTML = "<p>Unable to retrieve location weather data.</p>";
    forecast.innerHTML = "";
  }
}

function displayCurrentWeather(data) {
  const { name, main, weather } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.body.className = getBackgroundClass(weather[0].main);

  currentWeather.innerHTML = `
    <h2>${name}</h2>
    <img src="${iconUrl}" alt="${weather[0].description}">
    <p>${weather[0].description}</p>
    <p>${Math.round(main.temp)}°${unit === "metric" ? "C" : "F"}</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind: ${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}</p>
  `;
}

function displayForecast(forecastData) {
  forecast.innerHTML = forecastData.slice(0, 7).map(day => {
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' });
    return `
      <div class="forecast-item">
        <p>${date}</p>
        <img src="${iconUrl}" alt="${day.weather[0].description}">
        <p>${Math.round(day.main.temp)}°${unit === "metric" ? "C" : "F"}</p>
      </div>
    `;
  }).join('');
}

function getBackgroundClass(condition) {
  switch (condition.toLowerCase()) {
    case "clear":
      return "sunny";
    case "clouds":
      return "cloudy";
    case "rain":
    case "drizzle":
      return "rainy";
    case "snow":
      return "snowy";
    default:
      return "default";
  }
}

cityInput.addEventListener("input", (e) => {
  if (e.target.value.length >= 3) fetchWeather(e.target.value);
});

locationButton.onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  } else {
    currentWeather.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
  }
};

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        fetchWeather("Almaty");
      }
    );
  } else {
    fetchWeather("Almaty");
  }
});
