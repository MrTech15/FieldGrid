#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Enter widi, password and IP Address
const char* ssid = "";
const char* password = "";
const char* mqtt_server = "";
// dht11 sensor - pin 4
//flame sensor - pin 5
//vibration sensor - pin 6
#define DHTPIN 4 
#define DHTTYPE DHT11

#define FLAME_ANALOG_PIN 5
#define VIBRATION_PIN 6

const int flameThreshold = 3800;

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi() {
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT... ");

    if (client.connect("ESP32S3_Node01")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(3000);

  dht.begin();

  pinMode(VIBRATION_PIN, INPUT);

  setup_wifi();

  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }

  client.loop();

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  int flameValue = analogRead(FLAME_ANALOG_PIN);
  int vibrationState = digitalRead(VIBRATION_PIN);

  bool flameDetected = flameValue < flameThreshold;
  bool vibrationDetected = vibrationState == HIGH;

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT11 read failed");
    delay(2000);
    return;
  }

  StaticJsonDocument<300> doc;

  doc["node_id"] = "node_01";
  doc["status"] = "online";

  doc["temperature_c"] = temperature;
  doc["humidity_percent"] = humidity;

  doc["flame_analog"] = flameValue;
  doc["flame_detected"] = flameDetected;
  doc["flame_threshold"] = flameThreshold;

  doc["vibration_state"] = vibrationState;
  doc["vibration_detected"] = vibrationDetected;

  doc["uptime_ms"] = millis();

  char payload[300];
  serializeJson(doc, payload);

  client.publish("field/node01/data", payload);

  Serial.println(payload);

  delay(1000);
}
