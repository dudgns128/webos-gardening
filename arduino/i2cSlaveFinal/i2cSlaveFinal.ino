#include <Wire.h>
#include "DHT.h"
#include <Adafruit_NeoPixel.h>

#define NEOPIXEL_PIN 3
#define NEOPIXEL_CNT 24

#define PUMP_PIN 4

#define DHT_PIN 2
#define DHT_TYPE DHT11
#define CDS_PIN A0
#define WL_PIN A1
#define SM_PIN A2

// uncomment to debug print
// #define DEBUG_PRINT

Adafruit_NeoPixel neopixel(NEOPIXEL_CNT, NEOPIXEL_PIN, NEO_GRB | NEO_KHZ800);
DHT dht(DHT_PIN, DHT_TYPE);
uint8_t sensor_data[10];
int mode = -1;
bool reading = false;

void setup()
{
  Wire.begin(1);
  Wire.onReceive(onReceiveCallback);
  Wire.onRequest(onRequestCallback);

  neopixel.begin();

  pinMode(PUMP_PIN, OUTPUT);

#ifdef DEBUG_PRINT
  Serial.begin(9600);
#endif
}

void loop()
{
  if (reading)
  {
    readSensors();
    reading = false;
  }
  delay(1);
}

void onReceiveCallback(int parameter)
{
  if (mode == -1)
  {
    Wire.read();
    mode = Wire.read();
#ifdef DEBUG_PRINT
    Serial.print("mode: ");
    Serial.println(mode);
#endif
    if (mode == 2)
    {
      reading = true;
      mode = -1;
    }
  }
  else if (mode == 0)
  {
    uint8_t br = Wire.read();
    controlNeopixel(br);
    mode = -1;
  }
  else if (mode == 1)
  {
    uint8_t pump_on = Wire.read();
    controlPump(pump_on);
    mode = -1;
  }
}

void onRequestCallback()
{
  for (int i = 0; i < 10; i++)
  {
    Wire.write(sensor_data[i]);
  }
}

void controlNeopixel(uint8_t br)
{
  br = br * 255 / 100.0;
#ifdef DEBUG_PRINT
  Serial.print("br: ");
  Serial.println(br);
#endif
  for (int i = 0; i < NEOPIXEL_CNT; i++)
  {
    neopixel.setPixelColor(i, neopixel.Color(br, br, br));
  }
  neopixel.show();
}

void controlPump(uint8_t pump_on)
{
#ifdef DEBUG_PRINT
  Serial.print("pump_on: ");
  Serial.println(pump_on);
#endif
  if (pump_on == 0)
  {
    digitalWrite(PUMP_PIN, LOW);
  }
  else
  {
    digitalWrite(PUMP_PIN, HIGH);
  }
}

void readSensors()
{
  dht.readRawBytes(sensor_data);
  processAnalogData(CDS_PIN, 4);
  processAnalogData(WL_PIN, 6);
  processAnalogData(SM_PIN, 8);
#ifdef DEBUG_PRINT
  printSensorData();
#endif
}

void processAnalogData(uint8_t pin, int start)
{
  int data = analogRead(pin);
  sensor_data[start] = (data & 0x0000FF00) >> 8;
  sensor_data[start + 1] = data & 0x000000FF;
}

void printSensorData()
{
  printBytes("DHT:", 0, 4);
  printBytes("CDS:", 4, 2);
  printBytes("WL:", 6, 2);
  printBytes("SM:", 8, 2);
}

void printBytes(const char *label, int start, int n)
{
  Serial.print(label);
  for (int i = start; i < start + n; i++)
  {
    Serial.print(" ");
    Serial.print(sensor_data[i]);
  }
  Serial.println();
}