#include "DHT.h"

#define DHT_PIN 2
#define DHT_TYPE DHT11

#define CDS_PIN A0
#define WL_PIN A1
// #define SM_PIN A2

DHT dht(DHT_PIN, DHT_TYPE);

uint8_t bytes[10];

void setup() {
  dht.begin();
  pinMode(CDS_PIN, INPUT);
  pinMode(WL_PIN, INPUT);
  // pinMode(SM_PIN, INPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long startTime = micros();
  dht.readRawBytes(bytes);
  processAnalogData(CDS_PIN, 4);
  processAnalogData(WL_PIN, 6);
  processAnalogData(WL_PIN, 8);
  // processAnalogData(SM_PIN, 8);
  unsigned long endTime = micros();
  Serial.print("measure Time: ");
  Serial.print(endTime - startTime);
  Serial.println("us");

  Serial.println("read Data:");
  printBytes("DHT:", 0, 4);
  printBytes("CDS:", 4, 2);
  printBytes("WL:", 6, 2);
  printBytes("SM:", 8, 2);

  delay(2000);
}

void processAnalogData(uint8_t pin, int start) {
  int data = analogRead(pin);
  bytes[start] = (data & 0x0000FF00) >> 8;
  bytes[start + 1] = data & 0x000000FF;
}

void printBytes(const char* label, int start, int n) {
  Serial.print(label);
  for (int i = start; i < start + n; i++) {
    Serial.print(" ");
    Serial.print(bytes[i]);
  }
  Serial.println();
}
