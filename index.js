import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "63a8f777ff82342a3326056f641f6604"; // Replace with your API key

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
        const result = await axios.get(`${API_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        // Add city to search history
        searchHistory.push(city);

        res.render("index.ejs", { weather: [{ city: result.data.name, temperature: result.data.main.temp, description: result.data.weather[0].description }], error: null, history: searchHistory });
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
                units: "metric",
            },
        });

        // Add city to search history
        searchHistory.push(city);

        res.render("index.ejs", {
            weather: [{ city: weatherResponse.data.name, temperature: weatherResponse.data.main.temp, description: weatherResponse.data.weather[0].description }],
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
