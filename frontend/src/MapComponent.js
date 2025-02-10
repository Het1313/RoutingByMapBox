import React, { useEffect, useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_ACCESS_TOKEN = "sk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY202ejRlMWU2MDEyczJsc2Y5NTljdnFmdCJ9.XxwWJFdAbtISFcx7nHVODg"

const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: 37.7749,  // Default location (San Francisco)
    longitude: -122.4194,
    zoom: 12,
  });

  const [routes, setRoutes] = useState([]);
  const [liveLocation, setLiveLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setLiveLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchRoutes = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_routes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_lat: liveLocation?.latitude || 37.7749,
        start_lng: liveLocation?.longitude || -122.4194,
        end_lat: 37.7849,  // Example destination
        end_lng: -122.4094,
        mode: "driving",
      }),
    });

    const data = await response.json();
    setRoutes(data);
  };

  return (
    <div>
      <button onClick={fetchRoutes}>Find Routes</button>
      <Map
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        {liveLocation && (
          <Marker latitude={liveLocation.latitude} longitude={liveLocation.longitude} color="blue" />
        )}

        {routes.map((route, index) => (
          <Source key={index} type="geojson" data={{ type: "Feature", geometry: route.geometry }}>
            <Layer
              id={`route-${index}`}
              type="line"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": index === 0 ? "#ff0000" : "#0000ff", "line-width": 5 }}
            />
          </Source>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
