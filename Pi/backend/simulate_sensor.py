import paho.mqtt.client as mqtt
import time
import random
import json

BROKER = "localhost"
TOPIC_TEMP = "home/sensor/temperature"
TOPIC_HUM = "home/sensor/humidity"

client = mqtt.Client()

try:
    client.connect(BROKER, 1883, 60)
    print("Connected to MQTT Broker")
except Exception as e:
    print(f"Could not connect to MQTT Broker: {e}")
    exit(1)

print("Simulating sensor data... Press Ctrl+C to stop.")

try:
    while True:
        temp = round(random.uniform(20.0, 25.0), 2)
        hum = round(random.uniform(40.0, 60.0), 2)

        client.publish(TOPIC_TEMP, str(temp))
        client.publish(TOPIC_HUM, str(hum))

        print(f"Published: Temp={temp}, Hum={hum}")
        time.sleep(2)
except KeyboardInterrupt:
    print("Stopping simulation.")
    client.disconnect()
