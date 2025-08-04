import { useState } from "react";
import type { ChangeEvent } from "react";
import "./App.css";
import { degToCompass } from "./windDirection";

const API_KEY = "49f63961b39032a8f5fd79479f8c42bb";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

function Weather() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          setWeather(data);
        } catch (error) {
          console.error("Failed to fetch weather by location:", error);
        }
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="container">
      <h1>Enter the name of the city</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      <div style={{ marginTop: "10px" }}>
        <button onClick={fetchWeatherByLocation}>
          Get My Location Weather
        </button>
      </div>

      {weather && (
        <div className="weather-info">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>{weather.weather[0].description}</p>
          <p>🌡️ Temperature: {weather.main.temp} °C</p>
          <p>
            💨 Wind: {weather.wind.speed} km/h ({degToCompass(weather.wind.deg)}
            )
          </p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🧭 Pressure: {weather.main.pressure} mb</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}

export default Weather;
