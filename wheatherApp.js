const apiKey = '003a3fa6e947f2b81132b421f095d765'; // Replace with your actual API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// Function to get weather icon class based on condition code
function getWeatherIcon(conditionCode) {
    const iconMap = {
        // Thunderstorm
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        // Drizzle
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        // Rain
        '10d': 'fas fa-cloud-showers-heavy',
        '10n': 'fas fa-cloud-showers-heavy',
        // Snow
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        // Atmosphere
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog',
        // Clear
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        // Clouds
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud'
    };
    
    return iconMap[conditionCode] || 'fas fa-question';
}

// Function to get icon color based on condition
function getWeatherIconColor(conditionCode) {
    const colorMap = {
        '01d': '#f39c12', // Sun - yellow
        '01n': '#3498db',  // Moon - blue
        '02d': '#f1c40f',  // Cloud sun
        '02n': '#9b59b6',  // Cloud moon
        '03d': '#95a5a6',  // Cloud
        '03n': '#95a5a6',
        '04d': '#7f8c8d',  // Broken clouds
        '04n': '#7f8c8d',
        '09d': '#3498db',  // Showers
        '09n': '#3498db',
        '10d': '#2980b9',  // Rain
        '10n': '#2980b9',
        '11d': '#e74c3c',  // Thunderstorm
        '11n': '#e74c3c',
        '13d': '#ecf0f1',  // Snow
        '13n': '#ecf0f1',
        '50d': '#bdc3c7',  // Mist
        '50n': '#bdc3c7'
    };
    
    return colorMap[conditionCode] || '#4a90e2';
}

// Function to fetch weather data
async function fetchWeatherData(city) {
    try {
        // Show loading state
        searchBtn.innerHTML = '<div class="loading"></div>';
        
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        
        const currentData = await currentResponse.json();
        
        // Check if response is valid
        if (currentData.cod !== 200) {
            // Only show error if there's actually an error
            document.getElementById('weather-condition').textContent = 'Weather unavailable';
            document.getElementById('weather-icon').className = 'fas fa-question';
            return;
        }
        
        // Fetch forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();
        
        // Update UI with the data - MAKE SURE THIS FUNCTION IS WORKING PROPERLY
        updateUI(currentData, forecastData);
        
    } catch (error) {
        console.error('Error:', error);
        // Only show error if there's actually an error
        document.getElementById('weather-condition').textContent = 'Weather available';
    } finally {
        // Reset search button
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
    }
}

// Make sure your updateUI function is properly updating all fields
function updateUI(currentData, forecastData) {
    // Update current weather
    document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${currentData.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${Math.round(currentData.wind.speed * 3.6)} km/h`;
    
    // Update weather condition - THIS IS CRUCIAL
    document.getElementById('weather-condition').textContent = currentData.weather[0].main;
    
    // Set weather icon
    const iconCode = currentData.weather[0].icon;
    document.getElementById('weather-icon').className = getWeatherIcon(iconCode);
    
    // Update date and time
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    document.getElementById('date-time').textContent = now.toLocaleDateString('en-US', options);
    
    // Rest of your update code for hourly/weekly forecasts...
}
// Function to update the UI with weather data
function updateUI(currentData, forecastData) {
    // Update current weather
    document.getElementById('current-temp').textContent = `${Math.round(currentData.main.temp)}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${currentData.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${Math.round(currentData.wind.speed * 3.6)} km/h`;
    document.getElementById('weather-condition').textContent = currentData.weather[0].main;
    
    // Set weather icon
    const weatherIcon = document.getElementById('weather-icon');
    const iconCode = currentData.weather[0].icon;
    weatherIcon.className = getWeatherIcon(iconCode);
    weatherIcon.style.color = getWeatherIconColor(iconCode);
    
    // Update date and time
    const now = new Date();
    const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    document.getElementById('date-time').textContent = now.toLocaleDateString('en-US', options);
    
    // Update hourly forecast
    const hourlyItems = document.getElementById('hourly-items');
    hourlyItems.innerHTML = '';
    
    // Get next 8 hours (3-hour intervals from API)
    const hourlyForecasts = forecastData.list.slice(0, 8);
    
    hourlyForecasts.forEach(item => {
        const time = new Date(item.dt * 1000);
        const hour = time.getHours();
        const displayHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        
        const iconCode = item.weather[0].icon;
        const iconClass = getWeatherIcon(iconCode);
        const iconColor = getWeatherIconColor(iconCode);
        
        hourlyItem.innerHTML = `
            <div class="hourly-time">${displayHour}</div>
            <i class="hourly-icon ${iconClass}" style="color: ${iconColor}"></i>
            <div class="hourly-temp">${Math.round(item.main.temp)}°</div>
        `;
        
        hourlyItems.appendChild(hourlyItem);
    });
    
    // Update weekly forecast
    const weeklyContainer = document.getElementById('weekly-forecast');
    weeklyContainer.innerHTML = '';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get one forecast per day (at noon if available)
    for (let i = 0; i < 7; i++) {
        const forecastIndex = i * 8 + 4; // Try to get noon forecast (index 4 in each day's 8 forecasts)
        const dayForecast = forecastData.list[forecastIndex] || forecastData.list[i * 8];
        
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dayName = days[date.getDay()];
        
        const dayElement = document.createElement('div');
        dayElement.className = 'day-forecast';
        
        const iconCode = dayForecast.weather[0].icon;
        const iconClass = getWeatherIcon(iconCode);
        const iconColor = getWeatherIconColor(iconCode);
        
        dayElement.innerHTML = `
            <div class="day-name">${dayName}</div>
            <i class="daily-icon ${iconClass}" style="color: ${iconColor}"></i>
            <div class="daily-temp">${Math.round(dayForecast.main.temp_max)}° ${Math.round(dayForecast.main.temp_min)}°</div>
        `;
        
        weeklyContainer.appendChild(dayElement);
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});

// Load default city weather on page load
fetchWeatherData('London');