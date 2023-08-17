export enum DeviceType {
  General = "GENERAL", // A device with general functionalities
  Core = "CORE", // A device with base functionalities
  Key = "KEY", // General key?
  Key1 = "KEY1", // 1 Pole key
  Key2 = "KEY2", // 2 Pole key
  Key3 = "KEY3", // 3 Pole key
  Key4 = "KEY4", // 4 Pole key
  Relay = "RELAY", // Relay card
  Relay8 = "RELAY8", // Relay card 8
  Relay12 = "RELAY12", // Relay card 12
  Plug = "PLUG", // Power outlet/wall plug/power socket
  Light = "LIGHT", // Smart Light with colors
  Bell = "BELL", // Bell
  Lock = "LOCK", // Lock
  Door = "DOOR", // Door
  TV = "TV", // Smart TV
  Blinds = "BLINDS", // Window Blinds
  Curtain = "CURTAIN", // Window Curtain
  Thermostat = "THERMOSTAT", // Thermostat
  IRHub = "HUB_IR", // IR_HUB?
  RFHub = "HUB_RF", // RF Translator Hub?
  LocalHub = "HUB_LOCAL", // Local Mini Server
  Dev = "DEV", // Dev device used for development purposes
  ECU = "ECU", // Cars ECU
  // KEY = "KEY",
  // KEY1 = "KEY1",
  // KEY2 = "KEY2",
  // KEY3 = "KEY3",
  // KEY4 = "KEY4",
  // LOCK = "LOCK",
  // BELL = "BELL",
  // TV = "TV",
  // IRHUB = "IRHUB",
  // BLINDS = "BLINDS",
  // DOOR = "DOOR",
  // VEHICLE = "VEHICLE",
}

export type ServerDeviceTypes = {
  [key in DeviceType]: string // [k: DeviceType]: string
}
