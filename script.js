const API_KEY = `4b1e9ed5668439e217adf037d9f292a4`;

const searchTemperature = () => {
    const city = document.getElementById('city-name').value;
    if (!city) {
        alert('Please enter a city name!');
        return;
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => displayTemperature(data))
        .catch(error => console.error('Error fetching weather data:', error));
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast data:', error));
};

const setInnerText = (id, text) => {
    document.getElementById(id).innerText = text;
};

const displayTemperature = (temperature) => {
    setInnerText('city', temperature.name);
    setInnerText('temperature', temperature.main.temp);
    setInnerText('condition', temperature.weather[0].main);
    
    const iconCode = temperature.weather[0].icon;
    const iconUrl = getWeatherIcon(iconCode);
    document.getElementById('weather-icon').innerHTML = iconUrl;
    
    changeTextColor(iconCode);
};

const displayForecast = (forecast) => {
    const forecastData = forecast.list[0];
    setInnerText('forecast', `${forecastData.weather[0].description}, ${forecastData.main.temp}°C`);
};

const changeTextColor = (iconCode) => {
    let color;
    if (iconCode.startsWith("01")) { // Clear sky
        color = "#FFD700";
    } else if (iconCode.startsWith("02") || iconCode.startsWith("03") || iconCode.startsWith("04")) { // Clouds
        color = "#B0C4DE";
    } else if (iconCode.startsWith("09") || iconCode.startsWith("10")) { // Rain
        color = "#4682B4";
    } else if (iconCode.startsWith("11")) { // Thunderstorm
        color = "#8B0000";
    } else if (iconCode.startsWith("13")) { // Snow
        color = "#ADD8E6";
    } else if (iconCode.startsWith("50")) { // Mist/Fog
        color = "#708090";
    } else {
        color = "white";
    }
    
    document.getElementById('city').style.color = color;
    document.getElementById('temperature').style.color = color;
    document.getElementById('condition').style.color = color;
    document.getElementById('forecast').style.color = color;
    document.getElementById('alerts').style.color = color;
};

const getWeatherIcon = (iconCode) => {
    const icons = {
        "01d": `<svg width="100" height="100" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="16" fill="yellow" stroke="orange" stroke-width="4"/></svg>`,
        "02d": `<svg width="100" height="100" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="16" fill="yellow" stroke="orange" stroke-width="4"/><ellipse cx="42" cy="42" rx="20" ry="12" fill="lightgray"/></svg>`,
        "09d": `<svg width="100" height="100" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="20" ry="12" fill="gray"/><line x1="28" y1="44" x2="28" y2="54" stroke="blue" stroke-width="3"/><line x1="36" y1="44" x2="36" y2="54" stroke="blue" stroke-width="3"/></svg>`
    };
    return icons[iconCode] || icons["01d"];
};

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        
        fetch(locationUrl)
            .then(response => response.json())
            .then(data => displayTemperature(data))
            .catch(error => console.error('Error fetching location-based weather:', error));
    });
}