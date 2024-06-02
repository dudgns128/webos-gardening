#include <Wire.h>

uint8_t data[10];

void setup() {
  Wire.begin();
  Serial.begin(9600);
}

void loop() {
  Wire.beginTransmission(1);
  Wire.write(0);
  Wire.write(2);
  Wire.endTransmission();

  delayMicroseconds(23000);

  Wire.requestFrom(1, 10);
  for (int i = 0; i < 10; i++) {
    data[i] = Wire.read();
  }

  for (int i = 0; i < 10; i++) {
    Serial.print(data[i]);
    Serial.print(" ");
  }
  Serial.println();

  delay(2000);
}
