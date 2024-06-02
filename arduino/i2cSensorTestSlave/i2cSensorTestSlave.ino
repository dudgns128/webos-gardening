#include <Wire.h>
#include "DHT.h"

#define DHT_PIN 2
#define DHT_TYPE DHT11
#define CDS_PIN A0
#define WL_PIN A1
#define SM_PIN A2

DHT dht(DHT_PIN, DHT_TYPE);
uint8_t sensor_data[10];
int mode;

void setup() {
  Wire.begin(1);
  Wire.onReceive(onReceiveCallback);
  Wire.onRequest(onRequestCallback);
  Serial.begin(9600);
}

void loop() {
  
}

void onReceiveCallback(int parameter) {
  Serial.print(Wire.read());
  Serial.print(" ");
  mode = Wire.read();
  Serial.println(mode);
  readSensors();
  printSensorData();
}

void onRequestCallback() {
  for (int i = 0; i < 10; i++) {
    Wire.write(sensor_data[i]);
  }
}

void readSensors() {
  dht.readRawBytes(sensor_data);
  processAnalogData(CDS_PIN, 4);
  processAnalogData(WL_PIN, 6);
  processAnalogData(SM_PIN, 8);
}

void processAnalogData(uint8_t pin, int start) {
  int data = analogRead(pin);
  sensor_data[start] = (data & 0x0000FF00) >> 8;
  sensor_data[start + 1] = data & 0x000000FF;
}

void printSensorData() {
  printBytes("DHT:", 0, 4);
  printBytes("CDS:", 4, 2);
  printBytes("WL:", 6, 2);
  printBytes("SM:", 8, 2);
}

void printBytes(const char* label, int start, int n) {
  Serial.print(label);
  for (int i = start; i < start + n; i++) {
    Serial.print(" ");
    Serial.print(sensor_data[i]);
  }
  Serial.println();
}