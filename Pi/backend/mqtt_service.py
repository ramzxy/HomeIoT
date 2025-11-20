import paho.mqtt.client as mqtt
import json
from database import SessionLocal, Reading
from datetime import datetime

import os

MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = 1883
MQTT_TOPIC = "home/sensor/#"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode()
        topic = msg.topic
        print(f"Received: {topic} -> {payload}")
        
        # Attempt to parse value as float
        try:
            value = float(payload)
        except ValueError:
            print(f"Could not parse payload as float: {payload}")
            return

        db = SessionLocal()
        reading = Reading(topic=topic, value=value, timestamp=datetime.now())
        db.add(reading)
        db.commit()
        db.close()
    except Exception as e:
        print(f"Error processing message: {e}")

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        print("MQTT Client Started")
    except Exception as e:
        print(f"Failed to connect to MQTT Broker: {e}")
