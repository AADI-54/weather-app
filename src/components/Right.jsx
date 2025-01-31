import { useEffect, useState } from "react";

const Right = () => {
  const [searchLoc, setSearchLoc] = useState("");
  const [searchtime, setsearchtime] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce effect to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setsearchtime(searchLoc);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchLoc]);

  // Fetch weather data
  const fetchLocation = async (city) => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      console.log("Fetching weather for:", city);
      console.log("Using API Key:", import.meta.env.VITE_APP_ID);

      const url = `http://api.weatherapi.com/v1/forecast.json?key=9a77b077cc1340999c2100659253101&q=${city}&days=1&aqi=yes&alerts=yes`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data); // Debugging

      if (data.error) {
        setError(data.error.message);
        setWeatherData(null);
      } else {
        setWeatherData(data);
      }
    } catch (error) {
      console.error("Error while fetching location:", error);
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Call API when searchtime updates
  useEffect(() => {
    if (searchtime) {
      fetchLocation(searchtime);
    }
  }, [searchtime]);

  return (
    <div className="right">
      <div className="search_bar">
        <input
          type="text"
          placeholder="Search"
          value={searchLoc}
          onChange={(e) => setSearchLoc(e.target.value)}
        />

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {weatherData && (
          <>
            <h1 className="place">Location: {weatherData.location.name}</h1>
            <h2 className="info humidity">Humidity: {weatherData.current.humidity}%</h2>
            <h2 className="info temp">
              Temperature: {weatherData.current.temp_c}&#176;C
            </h2>
            <h2 className="info visibility">
              Visibility: {weatherData.current.vis_km} km
            </h2>
            <h2 className="info windspeed">
              Windspeed: {weatherData.current.wind_kph} km/h
            </h2>
          </>
        )}
      </div>
    </div>
  );
};

export default Right;
