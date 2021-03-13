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
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let visibilityElement = document.querySelector("#visibility");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;
  if (selectedUnit == "C") {
      temperatureElement.innerHTML = Math.round(celsiusTemperature);
  } else {
      temperatureElement.innerHTML = Math.round((celsiusTemperature * 9)/5 +32);
  }

  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  visibilityElement.innerHTML = response.data.visibility / 100;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function displayForecast(response){
  let forecastElement = document.querySelector("#forecast");

  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++){
    forecast = response.data.list[index];
    forecastElement.innerHTML +=`
      <div class="col-2">
        <h3>
          ${formatHours(forecast.dt * 1000)}
        </h3>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
        <div class="weather-forecast-temperature">
          <strong>${Math.round(forecast.main.temp_max)}°</strong> <small>${Math.round(forecast.main.temp_min)}°</small>
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
  let temperatureElement = document.querySelector("#temperature")
  let fahrenhietTemperature = (celsiusTemperature * 9)/5 +32;
  temperatureElement.innerHTML = Math.round(fahrenhietTemperature);
}

function displayCelsiusTemperature(event){
  event.preventDefault();
  selectedUnit = "C";
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature")
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function showcurrentLocation(position) {
  let apiKey = "65ce7574d4f259033178f9fae0906779";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showcurrentLocation);
}

let celsiusTemperature = null;

let selectedUnit = "C";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenhiet-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let currentButton = document.querySelector("#current-temperature");
currentButton.addEventListener("click", getCurrentPosition);

search("stockholm");