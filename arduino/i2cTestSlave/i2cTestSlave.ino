#include <Wire.h>

uint8_t data[10] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
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
  delayMicroseconds(22500);
}

void onRequestCallback() {
  for (int i = 0; i < 10; i++) {
    Wire.write(data[i]);
  }
}