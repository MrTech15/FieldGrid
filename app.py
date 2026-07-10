
"""
FieldGrid
Main Flask application.

Handles MQTT communication, receives live sensor data from ESP32 nodes,
and broadcasts updates to the dashboard via Socket.IO.
"""

from flask import Flask, render_template
from flask_socketio import SocketIO
import paho.mqtt.client as mqtt
import json

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
#enter your IP adress here 
MQTT_BROKER = "10.0.0.199"
MQTT_PORT = 1883
MQTT_TOPIC = "field/node01/data"

latest_data = {}

@app.route("/")
def index():
    return render_template("index.html")

def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT with result code:", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    global latest_data

    try:
        payload = msg.payload.decode()
        data = json.loads(payload)

        latest_data = data

        print("Received:", data)

        socketio.emit("sensor_update", data)

    except Exception as e:
        print("MQTT message error:", e)

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
