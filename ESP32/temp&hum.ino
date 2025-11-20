#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTPIN 20
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

// --- WiFi ---
const char* ssid = "DefoNotABomb";

// --- MQTT ---
const char* mqtt_server = "10.42.0.1";
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, NULL);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("Connencting wifi.");
    delay(500);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32-dht22")) {
      // Connected
    } else {
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("in setup.");
  setup_wifi();
  Serial.println("connencting server.");
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    Serial.println("Client stuck.");
    reconnect();
  }
  client.loop();

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (!isnan(h) && !isnan(t)) {
    char tempStr[8];
    dtostrf(t, 1, 2, tempStr);
    client.publish("home/sensor/temperature", tempStr);

    char humStr[8];
    dtostrf(h, 1, 2, humStr);
    client.publish("home/sensor/humidity", humStr);

    Serial.print("Temp: "); Serial.print(t);
    Serial.print(" °C, Humidity: "); Serial.println(h);
  }

  delay(5000);
}
