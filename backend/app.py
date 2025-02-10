# import requests
# from flask import Flask, request, jsonify

# app = Flask(__name__)

# # Mapbox token
# MAPBOX_TOKEN = "pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ"  # Replace with your Mapbox token

# # Mapbox Geocoding API for place suggestions
# @app.route('/api/suggestions', methods=['GET'])
# def get_suggestions():
#     query = request.args.get('query')
#     if not query:
#         return jsonify({"error": "Query parameter is required"}), 400

#     try:
#         response = requests.get(
#             f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={MAPBOX_TOKEN}"
#         )
#         response_data = response.json()
#         return jsonify(response_data.get("features", []))
#     except Exception as e:
#         print(f"Error fetching suggestions: {e}")
#         return jsonify({"error": "Failed to fetch suggestions"}), 500

# # Mapbox Directions API for routes (Enhanced for source to destination or destination to source)
# @app.route('/api/route', methods=['GET'])
# def get_route():
#     start_lng = request.args.get('startLng')
#     start_lat = request.args.get('startLat')
#     end_lng = request.args.get('endLng')
#     end_lat = request.args.get('endLat')
#     reverse = request.args.get('reverse', 'false').lower() == 'true'  # Check if reverse route is requested

#     if not start_lng or not start_lat or not end_lng or not end_lat:
#         return jsonify({"error": "All coordinates are required"}), 400

#     if reverse:
#         start_lng, end_lng = end_lng, start_lng
#         start_lat, end_lat = end_lat, start_lat

#     try:
#         # Request the directions from Mapbox
#         response = requests.get(
#             f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_lng},{start_lat};{end_lng},{end_lat}?geometries=geojson&access_token={MAPBOX_TOKEN}"
#         )
#         response_data = response.json()

#         # Check if routes exist in the response
#         if response_data['routes']:
#             return jsonify(response_data['routes'][0]['geometry'])
#         else:
#             return jsonify({"error": "No route found"}), 404
#     except Exception as e:
#         print(f"Error fetching route: {e}")
#         return jsonify({"error": "Failed to fetch route"}), 500

# if __name__ == '__main__':
#     app.run(debug=True)






import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

# Mapbox token
MAPBOX_TOKEN = "pk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY201ZjM4NXl3MmEyYzJrcjczbWc3a243NCJ9.yUinVTqWdA4XnlpH45TpBQ"  # Replace with your Mapbox token
# MAPBOX_TOKEN = "sk.eyJ1IjoiaGV0a290aGFyaTIwMDUiLCJhIjoiY202ejRlMWU2MDEyczJsc2Y5NTljdnFmdCJ9.XxwWJFdAbtISFcx7nHVODg"  # Replace with your Mapbox token


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

# Mapbox Directions API for routes (Enhanced for source to destination or destination to source)
@app.route('/api/route', methods=['GET'])
def get_route():
    start_lng = request.args.get('startLng')
    start_lat = request.args.get('startLat')
    end_lng = request.args.get('endLng')
    end_lat = request.args.get('endLat')
    reverse = request.args.get('reverse', 'false').lower() == 'true'  # Check if reverse route is requested

    # If the source location is not provided, use the user's current location (use default coordinates)
    if not start_lng or not start_lat:
        start_lng, start_lat = "default_longitude", "default_latitude"  # Replace with your logic for getting current location
    
    if not end_lng or not end_lat:
        return jsonify({"error": "Destination coordinates are required"}), 400

    if reverse:
        start_lng, end_lng = end_lng, start_lng
        start_lat, end_lat = end_lat, start_lat

    try:
        # Request the directions from Mapbox
        response = requests.get(
            f"https://api.mapbox.com/directions/v5/mapbox/driving/{start_lng},{start_lat};{end_lng},{end_lat}?geometries=geojson&access_token={MAPBOX_TOKEN}"
        )
        response_data = response.json()

        # Check if routes exist in the response
        if response_data['routes']:
            return jsonify(response_data['routes'][0]['geometry'])
        else:
            return jsonify({"error": "No route found"}), 404
    except Exception as e:
        print(f"Error fetching route: {e}")
        return jsonify({"error": "Failed to fetch route"}), 500

if __name__ == '__main__':
    app.run(debug=True)
