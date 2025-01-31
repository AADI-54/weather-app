import { useGeolocated } from "react-geolocated";
import { useEffect, useState } from "react";

const Left = () => {
    const { coords } = useGeolocated({
        positionOptions: { enableHighAccuracy: false },
        userDecisionTimeout: 5000,
    });

    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch Weather Data
    const fetchLocation = async () => {
        if (!coords) {
            console.log("Waiting for location data...");
            return;
        }

        try {
            console.log(`Fetching weather for lat: ${coords.latitude}, lon: ${coords.longitude}`);
            const url = `http://api.weatherapi.com/v1/current.json?key=9a77b077cc1340999c2100659253101&q=${coords.latitude},${coords.longitude}&aqi=no`;
            
            const res = await fetch(url);
            const data = await res.json();
            console.log("API Response:", data);

            if (data.error) {
                setError(data.error.message);
                setWeatherData(null);
            } else {
                setWeatherData(data);
            }
        } catch (error) {
            console.error("Error while fetching location:", error);
            setError("Failed to fetch weather data.");
        }
    };

    useEffect(() => {
        if (coords) {
            fetchLocation();
        }
    }, [coords]);

    // Update Time Every Second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format Date and Time
    const formatTime = (time) => String(time).padStart(2, "0");
    const hours = formatTime(currentTime.getHours());
    const minutes = formatTime(currentTime.getMinutes());
    const seconds = formatTime(currentTime.getSeconds());
    const day = currentTime.toLocaleString("en", { weekday: "long" });
    const date = currentTime.getDate();
    const month = currentTime.toLocaleString("en", { month: "long" });
    const year = currentTime.getFullYear();

    return (
        <div className="left">
            <h1>Your location</h1>
            {weatherData ? (
                <h2 className="location">In {weatherData.location.name}, {weatherData.location.country}</h2>
            ) : (
                <h2 className="location">Fetching location...</h2>
            )}
            
            {error && <p className="error">{error}</p>}

            <div className="bottom">
                <div>
                    <div className="watch">
                        <ul className="list">
                            <li className="hr">{hours}</li>
                            <li className="min">{minutes}</li>
                            <li className="sec">{seconds}</li>
                        </ul>
                    </div>
                    <div className="date">
                        <ul className="today">
                            <li>{day}</li>
                            <li>{date}</li>
                            <li>{month}</li>
                            <li>{year}</li>
                        </ul>
                    </div>
                </div>
                <div className="tempdegree">
                    <h2>{weatherData ? `${weatherData.current.temp_c}°C` : "Loading..."}</h2>
                </div>
            </div>
        </div>
    );
};

export default Left;
