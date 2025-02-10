// import React, { useState, useEffect } from 'react';
// import { Map as ReactMapGL, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
// import axios from 'axios';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import "./App.css"

// const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ'; // Replace with your token

// const MapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [destination, setDestination] = useState('');
//   const [route, setRoute] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [destinationCoords, setDestinationCoords] = useState(null);

//   // Get the user's current location
//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         setCurrentLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (error) => console.error('Error fetching location:', error),
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   // Fetch route from the Flask API
//   const fetchRoute = async (destCoords) => {
//     if (!currentLocation || !destCoords) return;

//     try {
//       // Backend call to get the route
//       const response = await axios.get('http://localhost:5000/api/route', {
//         params: {
//           startLng: currentLocation.longitude,
//           startLat: currentLocation.latitude,
//           endLng: destCoords[0],
//           endLat: destCoords[1],
//         },
//       });
//       setRoute(response.data); // Assuming the first route is chosen
//       setDestinationCoords(destCoords);
//       setSuggestions([]); // Clear suggestions after selecting a destination
//     } catch (error) {
//       console.error('Error fetching route:', error);
//     }
//   };

//   // Fetch place suggestions from Mapbox Geocoding API
//   const fetchSuggestions = async () => {
//     if (!destination) return setSuggestions([]);

//     try {
//       const response = await axios.get(
//         `https://api.mapbox.com/geocoding/v5/mapbox.places/${destination}.json?access_token=${MAPBOX_TOKEN}`
//       );
//       setSuggestions(response.data.features);
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     }
//   };

//   // Handle changes in the destination input
//   const handleDestinationChange = (e) => {
//     setDestination(e.target.value);
//     fetchSuggestions();
//   };

//   // Handle selecting a place from the suggestions list
//   const handleSuggestionClick = (suggestion) => {
//     const coords = suggestion.geometry.coordinates;
//     setDestination(suggestion.place_name);
//     fetchRoute(coords);
//   };

//   return (
//     <div className="map-page">
//       <h1>Live Map with Routing</h1>
//       <div className="map-controls">
//         <input
//           type="text"
//           placeholder="Enter destination"
//           value={destination}
//           onChange={handleDestinationChange}
//         />
//         <div className="suggestions">
//           {suggestions.map((suggestion) => (
//             <div
//               key={suggestion.id}
//               className="suggestion-item"
//               onClick={() => handleSuggestionClick(suggestion)}
//             >
//               {suggestion.place_name}
//             </div>
//           ))}
//         </div>
//         <button onClick={() => fetchRoute(destinationCoords)}>Get Route</button>
//       </div>

//       {/* Map component */}
//       {currentLocation && (
//         <ReactMapGL
//           initialViewState={{
//             latitude: currentLocation.latitude,
//             longitude: currentLocation.longitude,
//             zoom: 14,
//           }}
//           style={{ width: '100%', height: '500px' }}
//           mapStyle="mapbox://styles/mapbox/streets-v11"
//           mapboxAccessToken={MAPBOX_TOKEN}
//         >
//           {/* User's current location marker */}
//           <Marker latitude={currentLocation.latitude} longitude={currentLocation.longitude} color="blue">
//             <div>🔵</div>
//           </Marker>

//           {/* Destination marker */}
//           {destinationCoords && (
//             <Marker latitude={destinationCoords[1]} longitude={destinationCoords[0]} color="red">
//               <div>🔴</div>
//             </Marker>
//           )}

//           {/* Route layer */}
//           {route && (
//             <Source id="route" type="geojson" data={{ type: 'Feature', geometry: route }}>
//               <Layer
//                 id="routeLayer"
//                 type="line"
//                 paint={{
//                   'line-color': '#ff6347',
//                   'line-width': 4,
//                 }}
//               />
//             </Source>
//           )}

//           {/* Navigation control */}
//           <NavigationControl position="top-right" />
//         </ReactMapGL>
//       )}
//     </div>
//   );
// };

// export default MapComponent;

import React, { useState, useEffect } from 'react';
import { Map as ReactMapGL, Marker, NavigationControl, Layer, Source } from 'react-map-gl';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./App.css";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ'; // Replace with your token
// const MAPBOX_TOKEN = "sk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY202ejRlMWU2MDEyczJsc2Y5NTljdnFmdCJ9.XxwWJFdAbtISFcx7nHVODg"  

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Get the user's current location
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

  // Fetch route from the Flask API
  const fetchRoute = async (destCoords) => {
    if (!currentLocation || !destCoords) return;

    try {
      // Backend call to get the route
      const response = await axios.get('http://localhost:5000/api/route', {
        params: {
          startLng: currentLocation.longitude,
          startLat: currentLocation.latitude,
          endLng: destCoords[0],
          endLat: destCoords[1],
        },
      });
      setRoute(response.data); // Assuming the first route is chosen
      setDestinationCoords(destCoords);
      setSuggestions([]); // Clear suggestions after selecting a destination
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Fetch place suggestions from Mapbox Geocoding API
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

  // Handle changes in the destination input
  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
    fetchSuggestions();
  };

  // Handle selecting a place from the suggestions list
  const handleSuggestionClick = (suggestion) => {
    const coords = suggestion.geometry.coordinates;
    setDestination(suggestion.place_name);
    fetchRoute(coords);
  };

  return (
    <div className="map-page">
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

      {/* Map component */}
      {currentLocation && (
        <ReactMapGL
          initialViewState={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            zoom: 14,
          }}
          style={{ width: '100%', height: '500px' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {/* User's current location marker */}
          <Marker latitude={currentLocation.latitude} longitude={currentLocation.longitude} color="blue">
            <div>🔵</div>
          </Marker>

          {/* Destination marker */}
          {destinationCoords && (
            <Marker latitude={destinationCoords[1]} longitude={destinationCoords[0]} color="red">
              <div>🔴</div>
            </Marker>
          )}

          {/* Route layer */}
          {route && (
            <Source id="route" type="geojson" data={{ type: 'Feature', geometry: route }}>
              <Layer
                id="routeLayer"
                type="line"
                paint={{
                  'line-color': '#ff6347',
                  'line-width': 4,
                }}
              />
            </Source>
          )}

          {/* Navigation control */}
          <NavigationControl position="top-right" />
        </ReactMapGL>
      )}
    </div>
  );
};

export default MapComponent;
