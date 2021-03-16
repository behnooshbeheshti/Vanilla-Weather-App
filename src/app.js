function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayTemperature(response) {
  responseTempreture = response
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feels-like");
  let visibilityElement = document.querySelector("#visibility");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  let celsiusTemperature = response.data.main.temp;
  let feelsLike = response.data.main.feels_like;

  if (selectedUnit == "C") {
      temperatureElement.innerHTML = Math.round(celsiusTemperature);
      feelsLikeElement.innerHTML = `${Math.round(feelsLike)}°`;
  } else {
      temperatureElement.innerHTML = Math.round((celsiusTemperature * 9)/5 +32);
      feelsLikeElement.innerHTML = `${Math.round((feelsLike * 9)/5 +32)}°`;
  }

  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  visibilityElement.innerHTML = response.data.visibility / 100;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  iconElement.setAttribute("src", `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response){
  responseForcast = response
  let forecastElement = document.querySelector("#forecast");

  forecastElement.innerHTML = null;

  for (let index = 0; index < 6; index++){
    let forecast = response.data.list[index];

    let temp_max = null;
    let temp_min = null;

    if (selectedUnit == "C") {
      temp_max = Math.round(forecast.main.temp_max);
      temp_min = Math.round(forecast.main.temp_min);
    } else {
      temp_max = Math.round((forecast.main.temp_max * 9)/5 +32);
      temp_min = Math.round((forecast.main.temp_min * 9)/5 +32);
    }

    forecastElement.innerHTML +=`
      <div class="col-2">
        <h3>
          ${formatHours(forecast.dt * 1000)}
        </h3>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
        <div class="weather-forecast-temperature">
          <strong>${temp_max}°</strong> <small>${temp_min}°</small>
        </div>
      </div>
`;
  } 
}

function search(city){
  let apiKey = "65ce7574d4f259033178f9fae0906779";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}
 
function handleSubmit(event){
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event){
  event.preventDefault();
  selectedUnit = "F";
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  displayTemperature(responseTempreture);
  displayForecast(responseForcast);
}

function displayCelsiusTemperature(event){
  event.preventDefault();
  selectedUnit = "C";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  displayTemperature(responseTempreture);
  displayForecast(responseForcast);
}

function showcurrentLocation(position) {
  let apiKey = "65ce7574d4f259033178f9fae0906779";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
   axios.get(apiUrl).then(displayForecast);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showcurrentLocation);
}

let selectedUnit = "C";

let responseTempreture = null;
let responseForcast = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenhiet-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let currentButton = document.querySelector("#current-temperature");
currentButton.addEventListener("click", getCurrentPosition);

search("stockholm");