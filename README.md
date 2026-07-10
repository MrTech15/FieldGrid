# FieldGrid
FieldGrid is a modular IoT monitoring platform built around ESP32-S3 sensor nodes, MQTT messaging, and a Python/Flask web dashboard. Each node independently monitors its local environment and streams real-time telemetry to a central dashboard, creating a scalable foundation for distributed environmental monitoring applications.

The project is designed with modularity in mind, allowing additional sensor nodes and sensing capabilities to be integrated with minimal changes to the existing architecture.

Features
Real-time temperature monitoring (DHT11)
Live humidity monitoring
Firewatch monitoring using an analog flame sensor
Shock/vibration event detection
MQTT-based communication
Live Flask + Socket.IO web dashboard
Live JSON payload viewer for debugging
Modular architecture for additional ESP32 nodes

Tech Stack
ESP32-S3
Arduino Framework (c++)
MQTT (Mosquitto)
Python
Flask
Flask-SocketIO
HTML
CSS
JavaScript
JSON
