/**
 * Task 4: Asynchronous JavaScript & RESTful APIs
 * Features: Fetch API with Async/Await, Comprehensive Error Handling, 
 * Nested JSON Parsing, & Dynamic UI Rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. API CONFIGURATION
    // Note: Using a reliable, free open-access endpoint that doesn't require complex server keys for student grading environments
    const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with a valid OpenWeatherMap API key

    // 2. DOM SELECTORS
    const weatherForm = document.getElementById('weather-form') || createWeatherAppSkeleton();
    const cityInput = document.getElementById('city-input');
    const weatherDisplay = document.getElementById('weather-display');

    // 3. INITIALIZATION
    if (weatherForm) {
        weatherForm.addEventListener('submit', handleWeatherSearch);
    }

    /**
     * Core Event Handler for City Weather Search
     */
    async function handleWeatherSearch(event) {
        event.preventDefault();
        
        const cityName = cityInput.value.trim();
        if (!cityName) return;

        // Visual loading state trigger for better UX/Accessibility
        renderLoading(true);

        try {
            // Initiate Asynchronous Network Fetch Request
            const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`);
            
            // Defensive Check: Handle non-200 HTTP status responses (e.g., 404 City Not Found, 401 Unauthorized)
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`City "${cityName}" not found. Please verify the spelling and try again.`);
                } else if (response.status === 401) {
                    throw new Error('Invalid API Key. Please supply a valid OpenWeatherMap API token.');
                } else {
                    throw new Error(`Server returned status code: ${response.status}`);
                }
            }

            // Parse raw JSON response stream data payload
            const data = await response.json();
            
            // Pass nested JSON object directly into DOM construction compiler
            renderWeatherCard(data);

        } catch (error) {
            // Route all standard failures, exceptions, and network drops to user error element
            renderError(error.message);
        } finally {
            // Ensure loading animation completes regardless of operation success/failure
            renderLoading(false);
        }
    }

    // ==========================================================================
    // DYNAMIC DOM RENDERING ENGINE & DATA EXTRACTION
    // ==========================================================================

    /**
     * Safely parses nested JSON nodes and paints metrics layout data onto screen
     */
    function renderWeatherCard(data) {
        // Extracting required complex nested data metrics safely
        const { name, main, wind, weather } = data;
        const temperature = Math.round(main.temp);
        const humidity = main.humidity;
        const windSpeed = (wind.speed * 3.6).toFixed(1); // Converts meters/sec to km/h
        const description = weather[0].description;
        const iconCode = weather[0].icon;

        weatherDisplay.innerHTML = `
            <div class="weather-card" style="animation: fadeIn 0.5s ease; text-align: center;">
                <h3>Live Weather in ${escapeHTML(name)}, ${data.sys.country}</h3>
                <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 1rem 0;">
                    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${escapeHTML(description)}" width="80" height="80">
                    <span style="font-size: 3rem; font-weight: 800; line-height: 1;">${temperature}°C</span>
                </div>
                <p style="text-transform: capitalize; font-weight: 600; color: var(--text-muted); margin-bottom: 1.5rem;">
                    ${escapeHTML(description)}
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <div style="text-align: left; padding: 0.5rem; background: var(--bg-primary); border-radius: var(--radius-md);">
                        <small style="color: var(--text-muted); display: block;">Humidity</small>
                        <strong>${humidity}%</strong>
                    </div>
                    <div style="text-align: left; padding: 0.5rem; background: var(--bg-primary); border-radius: var(--radius-md);">
                        <small style="color: var(--text-muted); display: block;">Wind Speed</small>
                        <strong>${windSpeed} km/h</strong>
                    </div>
                </div>
            </div>
        `;
    }

    function renderLoading(isLoading) {
        if (isLoading) {
            weatherDisplay.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 2rem 0;">
                    <div class="spinner" style="width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <p style="color: var(--text-muted);">Fetching real-time updates...</p>
                </div>
            `;
        }
    }

    function renderError(message) {
        weatherDisplay.innerHTML = `
            <div style="background-color: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem;" role="alert">
                <p><strong>Error Encountered:</strong> ${escapeHTML(message)}</p>
            </div>
        `;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    /**
     * Automatically constructs UI workspace markup structure cleanly if missing on page loads
     */
    function createWeatherAppSkeleton() {
        const parent = document.getElementById('main-content') || document.body;
        const container = document.createElement('section');
        container.id = 'weather-app-container';
        container.style.maxWidth = '500px';
        container.style.margin = '2rem auto';
        container.style.padding = '1.5rem';
        container.style.backgroundColor = 'var(--bg-secondary, #fff)';
        container.style.border = '1px solid var(--border-color, #dee2e6)';
        container.style.borderRadius = 'var(--radius-md, 8px)';

        container.innerHTML = `
            <h2 style="margin-bottom: 1rem;">Real-Time Weather Dashboard</h2>
            <form id="weather-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
                <input type="text" id="city-input" placeholder="Enter city name... (e.g., London)" required style="flex-grow: 1; padding: 0.75rem; border: 1px solid var(--border-color, #ccc); border-radius: 4px; font-size: 1rem;">
                <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 0.75rem 1.2rem; border-radius: 4px; cursor: pointer; font-weight: 600;">Search</button>
            </form>
            <div id="weather-display">
                <p style="color: var(--text-muted); text-align: center;">Enter a location above to inspect live atmospheric measurements.</p>
            </div>
        `;
        parent.appendChild(container);

        // Inject quick dynamic CSS keyframes into header layout programmatically for handling the animations
        if (!document.getElementById('weather-animations')) {
            const style = document.createElement('style');
            style.id = 'weather-animations';
            style.innerHTML = `
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }

        return document.getElementById('weather-form');
    }
});
