const button = document.getElementById("search-button");
const voiceButton = document.getElementById("voice-button");
const input = document.getElementById("city-input");
const cityTemp = document.getElementById("city-temp");
const cityName = document.getElementById("city-name");
const cityTime = document.getElementById("city-time");
const nearby = document.getElementById("nearby");
const speed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const hourlyForecastContainer = document.getElementById("hourly-forecast");
const forecastContainer = document.getElementById("forecast");
const conditionIcon = document.getElementById("condition-icon");

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("close-sidebar");

menuToggle.addEventListener("click", () => {
    sidebar.classList.add("active");
});
closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
});

async function getData(cityName) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=8547ac94c827467597275355240509&q=${cityName}&aqi=no`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching current weather data:", error);
        alert("Unable to fetch current weather data. Please try again.");
    }
}

async function getForecast(cityName) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8547ac94c827467597275355240509&q=${cityName}&days=3&aqi=no&alerts=no`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert("Unable to fetch forecast data. Please try again.");
    }
}

button.addEventListener("click", async () => {
    const value = input.value.trim();
    if (!value) {
        alert("Please enter a city name.");
        return;
    }
    fetchWeather(value);
});

voiceButton.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
        const city = event.results[0][0].transcript;
        input.value = city;
        fetchWeather(city);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Could not process your voice input. Please try again.");
    };
});

input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        const value = input.value.trim();
        if (!value) {
            alert("Please enter a city name.");
            return;
        }
        fetchWeather(value);
    }
});

async function fetchWeather(city) {
    const currentWeather = await getData(city);
    const forecastData = await getForecast(city);

    if (currentWeather && forecastData) {
        cityName.innerText = `${currentWeather.location.name}, ${currentWeather.location.region} - ${currentWeather.location.country}`;
        cityTime.innerText = currentWeather.location.localtime;
        cityTemp.innerText = `${currentWeather.current.temp_c}°C`;
        nearby.innerText = currentWeather.current.condition.text;
        speed.innerText = `${currentWeather.current.wind_kph} km/h`;
        humidity.innerText = `${currentWeather.current.humidity}%`;
        conditionIcon.src = getConditionIcon(currentWeather.current.condition.text, new Date());

        updateHourlyForecast(forecastData.forecast.forecastday[0].hour, currentWeather.location.localtime);
        updateForecast(forecastData.forecast.forecastday);
    }
}

function getConditionIcon(condition, isDay) {
    const dayIcons = {
        "Sunny": "images/sunny.png",
        "Partly cloudy": "images/partly_cloudy.png",
        "Cloudy": "images/cloudy.png",
        "Rain": "images/rain.png",
        "Snow": "images/snow.png",
        "Wind": "images/wind.png",
        "Fog": "images/fog.png",
        "Thunderstorm": "images/thunderstorm.png",
        "Mist": "images/mist.png",
        "light rain": "images/moderate rain.png"
    };

    const nightIcons = {
        "Clear": "images/clear_night.png",
        "sunny": "images/clear_night.png",
        "Partly cloudy": "images/partly_cloudy_night.png",
        "Cloudy": "images/cloudy_night.png",
        "Rain": "images/rain_night.png",
        "Snow": "images/snow_night.png",
        "Wind": "images/wind_night.png",
        "Fog": "images/fog_night.png",
        "Thunderstorm": "images/thunderstorm_night.png",
        "Mist": "images/mist_night.png",
        "light rain": "images/moderate rain.png"
    };

    const icons = isDay ? dayIcons : nightIcons;
    return icons[condition] || "images/default.png";
}

function updateHourlyForecast(hours, currentTime) {
    const currentHour = new Date(currentTime).getHours();
    hourlyForecastContainer.innerHTML = ''; 

    hours.forEach((hour) => {
        const hourTime = new Date(hour.time).getHours();
        const isDay = hourTime >= 6 && hourTime < 18; 

        if (hourTime >= currentHour) { 
            const hourElement = document.createElement('div');
            hourElement.classList.add('hourly-forecast');

            const isNow = hourTime === currentHour ? 'Now' : `${hourTime}:00`;

            hourElement.innerHTML = `
                <h4>${isNow}</h4>
                <p>${hour.temp_c}°C</p>
            `;

            hourlyForecastContainer.appendChild(hourElement);
        }
    });
}

function updateForecast(forecastDays) {
    forecastContainer.innerHTML = ''; 

    forecastDays.forEach((day) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');

        const icon = getConditionIcon(day.day.condition.text, true);

        dayElement.innerHTML = `
            <h4>${new Date(day.date).toLocaleDateString()}</h4>
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
            <img src="${icon}" alt="${day.day.condition.text}">
        `;
        forecastContainer.appendChild(dayElement);
    });
}
