import requests
from flask import Flask, request, jsonify
from flask_cors import CORS  # Allow frontend to communicate with Flask

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Mapbox token
MAPBOX_TOKEN = "pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ"  # Replace with your token

# Mapbox Geocoding API for place suggestions
@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        response = requests.get(
            f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={MAPBOX_TOKEN}"
        )
        response_data = response.json()
        return jsonify(response_data.get("features", []))
    except Exception as e:
        print(f"Error fetching suggestions: {e}")
        return jsonify({"error": "Failed to fetch suggestions"}), 500

# Mapbox Directions API for routes
@app.route('/api/route', methods=['GET'])
def get_route():
    start_lng = request.args.get('startLng')
    start_lat = request.args.get('startLat')
    end_lng = request.args.get('endLng')
    end_lat = request.args.get('endLat')

    if not start_lng or not start_lat or not end_lng or not end_lat:
        return jsonify({"error": "All coordinates are required"}), 400

    try:
        # Fetch directions from Mapbox API
        response = requests.get(
            f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_lng},{start_lat};{end_lng},{end_lat}?geometries=geojson&access_token={MAPBOX_TOKEN}"
        )
        response_data = response.json()

        print("Mapbox Route API Response:", response_data)  # Debugging

        if "routes" in response_data and len(response_data["routes"]) > 0:
            # Convert the response to GeoJSON FeatureCollection
            geojson_route = {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": response_data["routes"][0]["geometry"],
                        "properties": {},
                    }
                ],
            }
            return jsonify(geojson_route)
        else:
            return jsonify({"error": "No route found"}), 404
    except Exception as e:
        print(f"Error fetching route: {e}")
        return jsonify({"error": "Failed to fetch route"}), 500

if __name__ == '__main__':
    app.run(debug=True)


