import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.API_KEY;;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let searchHistory = []; // Initialize search history array

app.get("/", (req, res) => {
    try {
        res.render("index.ejs", { weather: [], error: null, history: searchHistory });
    } catch (error) {
        console.error(error);
        res.render("index.ejs", { weather: [], error: "Error loading page", history: searchHistory });
    }
});

app.post("/get-weather", async (req, res) => {
    const { city } = req.body;
    try {
        // Fetch current weather data
        const result = await axios.get(`${API_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'imperial'
            }
        });
        // Fetch 5-day forecast data
        const forecast = await axios.get(`${API_URL}/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        // Check if it will rain tomorrow
        const rainTomorrow = forecast.data.list.some(item => {
            const forecastDate = new Date(item.dt * 1000);
            return forecastDate.getDate() === new Date().getDate() + 1 && item.weather.some(w => w.main === 'Rain');
        });

        // Fetch UV index data
        const lat = result.data.coord.lat;
        const lon = result.data.coord.lon;
        const uvIndexResponse = await axios.get(`${API_URL}/uvi`, {
            params: {
                lat,
                lon,
                appid: API_KEY
            }
        });

        // Check if sunscreen is needed
        const uvIndex = uvIndexResponse.data.value;
        const sunscreenNeeded = uvIndex > 3;

        // Add city to search history
        searchHistory.push(city);

        res.render("index.ejs", {
            weather: [{
                city: result.data.name,
                temperature: result.data.main.temp,
                description: result.data.weather[0].description,
                icon: result.data.weather[0].icon,
                rainTomorrow,
                sunscreenNeeded
            }],
            error: null,
            history: searchHistory
        });
    } catch (error) {
        console.error(error);
        res.render("index.ejs", { weather: [], error: "Could not fetch weather data", history: searchHistory });
    }
});

// Route to fetch weather data for the current location
app.get("/current-location", async (req, res) => {
    try {
        // Fetch the user's IP address using an external service
        const ipResponse = await axios.get("https://api.ipify.org?format=json");
        const ip = ipResponse.data.ip;

        // Get the location based on the IP address
        const locationResponse = await axios.get(`https://ipinfo.io/${ip}/geo`);
        const city = locationResponse.data.city;

        // Fetch weather data for the identified city
        const weatherResponse = await axios.get(`${API_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: "imperial",
            },
        });

        // Fetch 5-day forecast data
        const forecastResponse = await axios.get(`${API_URL}/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units: "metric",
            },
        });

        // Check if it will rain tomorrow
        const rainTomorrow = forecastResponse.data.list.some(item => {
            const forecastDate = new Date(item.dt * 1000);
            return forecastDate.getDate() === new Date().getDate() + 1 && item.weather.some(w => w.main === 'Rain');
        });

        // Fetch UV index data
        const lat = weatherResponse.data.coord.lat;
        const lon = weatherResponse.data.coord.lon;
        const uvIndexResponse = await axios.get(`${API_URL}/uvi`, {
            params: {
                lat,
                lon,
                appid: API_KEY
            }
        });

        // Check if sunscreen is needed
        const uvIndex = uvIndexResponse.data.value;
        const sunscreenNeeded = uvIndex > 3;

        // Add city to search history
        searchHistory.push(city);

        res.render("index.ejs", {
            weather: [{
                city: weatherResponse.data.name,
                temperature: weatherResponse.data.main.temp,
                description: weatherResponse.data.weather[0].description,
                icon: weatherResponse.data.weather[0].icon,
                rainTomorrow,
                sunscreenNeeded
            }],
            error: null,
            history: searchHistory,
        });
    } catch (error) {
        console.error(error);
        res.render("index.ejs", { weather: [], error: "Could not fetch location data", history: searchHistory });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});