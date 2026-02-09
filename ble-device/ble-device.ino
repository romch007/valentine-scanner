#include <BLE2902.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define BUTTON_PRESS_CHAR_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define BUTTON_PIN 11

BLEServer* pServer = NULL;
BLECharacteristic* pButtonPressChar = NULL;

bool deviceConnected = false;
bool oldDeviceConnected = false;
bool lastButtonState = HIGH;
bool dirty = 0;

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Client connected");
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Client disconnected");
  }
};

void setup() {
  Serial.begin(115200);

  pinMode(BUTTON_PIN, INPUT_PULLUP);

  Serial.println("Starting BLE Scanner Server...");

  BLEDevice::init("ValentineScanner");

  // Create BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create BLE Service
  BLEService* pService = pServer->createService(BLEUUID(SERVICE_UUID), 25);

  // Temperature Characteristic (READ + NOTIFY)
  pButtonPressChar = pService->createCharacteristic(
      BUTTON_PRESS_CHAR_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  pButtonPressChar->addDescriptor(new BLE2902());

  pService->start();

  // Start advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);
  BLEDevice::startAdvertising();

  Serial.println("BLE Server is now advertising...");
  Serial.println("Press button to proceed scan");
}

void loop() {
  bool buttonState = digitalRead(BUTTON_PIN);

  static unsigned long lastButtonPressMs = 0;
  if (lastButtonState == LOW && buttonState == HIGH && deviceConnected) {
      lastButtonPressMs = millis();
      pButtonPressChar->setValue((uint8_t*)&buttonState, 1);
      pButtonPressChar->notify();
      dirty = 1;
  }

  lastButtonState = buttonState;

  if (dirty && millis() - lastButtonPressMs > 500) {
    dirty = 0;

    pButtonPressChar->setValue((uint8_t*)&buttonState, 0);
  }

  // Handle disconnection
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Start advertising again");
    oldDeviceConnected = deviceConnected;
  }

  // Handle connection
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}
