import React, { useState, useEffect } from 'react';
import { Map as ReactMapGL, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ';

// MapComponent that handles map-related logic
const MapComponent = ({ isDarkMode, toggleTheme }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error('Error fetching location:', error),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchRoute = async (destCoords) => {
    if (!currentLocation || !destCoords) return;

    try {
      const response = await axios.get('http://localhost:5000/api/route', {
        params: {
          startLng: currentLocation.longitude,
          startLat: currentLocation.latitude,
          endLng: destCoords[0],
          endLat: destCoords[1],
        },
      });

      if (response.data.features) {
        setRoute(response.data);
      } else {
        console.error("Invalid route data received");
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  const fetchSuggestions = async () => {
    if (!destination) return setSuggestions([]);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${destination}.json?access_token=${MAPBOX_TOKEN}`
      );
      setSuggestions(response.data.features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions();
  };

  const handleSuggestionClick = (suggestion) => {
    const coords = suggestion.geometry.coordinates;
    setDestination(suggestion.place_name);
    setDestinationCoords(coords);
    fetchRoute(coords);
  };

  return (
    <div className={`map-page ${isDarkMode ? 'dark' : 'light'}`}>
      <h1>Live Map with Routing</h1>
      <div className="map-controls">
        <input
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={handleDestinationChange}
        />
        <div className="suggestions">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
        <button onClick={() => fetchRoute(destinationCoords)}>Get Route</button>
      </div>

      {currentLocation && (
        <ReactMapGL
          initialViewState={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            zoom: 14,
          }}
          style={{ width: '100%', height: '500px' }}
          mapStyle={isDarkMode ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10'}
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Marker latitude={currentLocation.latitude} longitude={currentLocation.longitude}>
            <div className="user-marker">📌</div>
          </Marker>

          {destinationCoords && (
            <Marker latitude={destinationCoords[1]} longitude={destinationCoords[0]}>
              <div className="destination-marker">🟡</div>
            </Marker>
          )}

          {route && (
            <Source id="routeSource" type="geojson" data={route}>
              <Layer
                id="routeLayer"
                type="line"
                layout={{ "line-join": "round", "line-cap": "round" }}
                paint={{
                  "line-color": [
                    "interpolate",
                    ["linear"],
                    ["line-progress"],
                    0, "#00c6ff",
                    0.5, "#0072ff",
                    1, "#ff00ff"
                  ],
                  "line-width": 6,
                  "line-opacity": 0.85,
                }}
              />
            </Source>
          )}

          <NavigationControl position="top-right" />
        </ReactMapGL>
      )}
    </div>
  );
};

// App component that includes the ThemeToggle functionality
const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  };

  return (
    <div className="App">
      <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <MapComponent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
};

// ThemeToggle component
const ThemeToggle = ({ toggleTheme, isDarkMode }) => {
  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      {isDarkMode ? '🌙' : '🌞'}
    </div>
  );
};

export default App;
