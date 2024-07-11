# Weather Dashboard

## Overview

The Weather Dashboard is a web application that allows users to check the current weather for a specified city, get weather updates for their current location, see if it will rain tomorrow, and determine if sunscreen is needed today. The application is built using Node.js, Express.js, and EJS, and it fetches weather data from the OpenWeatherMap API.

## Features

- Current Weather for any city
- Current Location Weather
- Rain Prediction for tomorrow
- Sunscreen Alert for today
- Search History

## Technologies Used

- Node.js
- Express.js
- EJS
- Bootstrap
- OpenWeatherMap API
- IPify API
- IPinfo API

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- OpenWeatherMap API key

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/weather-dashboard.git
    cd weather-dashboard
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create an `.env` file in the root directory and add your OpenWeatherMap API key:
    ```env
    API_KEY=your_openweathermap_api_key
    ```

4. Run the application:
    ```bash
    npm start
    ```

5. Open your browser and navigate to:
    ```bash
    http://localhost:3000
    ```

## Usage

1. Enter a City: Type the name of a city and click "Get Weather".
2. Current Location: Click "Get Weather for Current Location".
3. Rain Tomorrow: Check if it will rain tomorrow.
4. Sunscreen Alert: Check if sunscreen is needed today.
5. Search History: View previously searched cities.

## License

This project is licensed under the MIT License.
