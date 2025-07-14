import Phaser from "phaser";

const POWER_CONFIG = {
  devices: {
    light: { wattage: 60, type: "light", label: "Tube Light" },
    fan: { wattage: 75, type: "fan", label: "Fan" },
    tv: { wattage: 100, type: "appliance", label: "TV" },
    oven: { wattage: 1200, type: "appliance", label: "Oven" },
    fridge: {
      wattage: 150,
      type: "appliance",
      alwaysOn: true,
      dutyCycle: 0.7,
      label: "Fridge",
    },
    mirror: { wattage: 10, type: "light", label: "Mirror Light" },
    chimney: { wattage: 50, type: "fan", label: "Chimney" },
    washingmachine: {
      wattage: 500,
      type: "appliance",
      label: "Washing Machine",
    },
    table: { wattage: 0, type: "furniture", label: "Table" },
    carpet: { wattage: 0, type: "furniture", label: "Carpet" },
    bed: { wattage: 0, type: "furniture", label: "Bed" },
    sofa: { wattage: 0, type: "furniture", label: "Sofa" },
  },
  electricityRate: 0.15,
  updateInterval: 1000, // 1 second updates
  minuteInterval: 60000, // 1 minute updates
};

class SmartHomeScene extends Phaser.Scene {
  constructor() {
    super("SmartHomeScene");
    this.devices = [];
    this.lamps = [];
    this.instantPower = 0;
    this.dailyEnergy = 0;
    this.dailyCost = 0;
    this.peakPower = 0;
    this.minuteCost = 0;
    this.lastUpdateTime = Date.now();
    this.deviceCounts = {};
    this.activeDevices = {};
  }

  preload() {
    this.load.image("int1", "/assets/tilesets/int1.png");
    this.load.image("int2", "/assets/tilesets/int2.png");
    this.load.image("tiles2", "/assets/tilesets/tiles2.png");
    this.load.image("tiles3", "/assets/tilesets/tiles3.png");
    this.load.image("walls", "/assets/tilesets/walls.png");
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/map.tmj");

    Object.keys(POWER_CONFIG.devices).forEach((device) => {
      this.load.image(device, `/assets/devices/${device}.png`);
    });
  }

  create() {
    // Initialize device counts
    Object.keys(POWER_CONFIG.devices).forEach((device) => {
      this.deviceCounts[device] = 0;
      this.activeDevices[device] = 0;
    });

    // Load saved data
    this.loadSavedData();

    // Setup game world
    this.setupGameWorld();

    // Setup power meter
    this.setupPowerUI();

    // Setup device interactions
    this.setupDeviceInteractions();

    // Start monitoring
    this.startPowerMonitoring();
    window.dispatchEvent(new Event("gameLoaded"));
  }

  loadSavedData() {
    const savedPowerData = localStorage.getItem("powerData");
    if (savedPowerData) {
      try {
        const { energy, cost, peak, devices } = JSON.parse(savedPowerData);
        this.dailyEnergy = energy || 0;
        this.dailyCost = cost || 0;
        this.peakPower = peak || 0;

        if (devices) {
          this.deviceCounts = devices.counts || {};
          this.activeDevices = devices.active || {};
        }
      } catch (e) {
        console.error("Error loading power data:", e);
      }
    }

    const savedDevices = localStorage.getItem("savedDevices");
    if (savedDevices) {
      try {
        JSON.parse(savedDevices).forEach((deviceData) => {
          this.addDevice(
            deviceData.key,
            deviceData.x,
            deviceData.y,
            deviceData.state
          );
        });
      } catch (e) {
        console.error("Error loading saved devices:", e);
      }
    }
  }

  setupGameWorld() {
    const map = this.make.tilemap({ key: "map" });
    const tilesets = [
      map.addTilesetImage("int1", "int1"),
      map.addTilesetImage("int2", "int2"),
      map.addTilesetImage("tiles2", "tiles2"),
      map.addTilesetImage("tiles3", "tiles3"),
      map.addTilesetImage("walls", "walls"),
    ];

    map.layers.forEach((layer) => map.createLayer(layer.name, tilesets));

    // Setup camera
    const zoom = Math.min(
      this.cameras.main.width / map.widthInPixels,
      this.cameras.main.height / map.heightInPixels
    );
    this.cameras.main
      .setZoom(zoom)
      .centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

    // Create lamps
    this.setupLamps(map);
  }

  setupLamps(map) {
    const lampLayer = map.getObjectLayer("lamps");
    if (!lampLayer) return;

    const savedLampStates = JSON.parse(
      localStorage.getItem("lampStates") || "[]"
    );

    lampLayer.objects.forEach((obj, index) => {
      const lamp = this.add
        .zone(obj.x, obj.y, obj.width, obj.height)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })
        .setData({ state: savedLampStates[index] || false, type: "light" });

      const label = this.add
        .text(obj.x + obj.width / 2, obj.y - 15, "", {
          fontSize: "14px",
          fill: "#fff",
          backgroundColor: "#1a1a1a",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
        .setOrigin(0.5)
        .setDepth(1000);

      lamp.setData("label", label);
      lamp.on("pointerdown", () => this.toggleDevice(lamp));
      this.lamps.push(lamp);

      // Initialize label text and style based on saved state
      this.updateLampLabel(lamp);
    });
  }

  setupPowerUI() {
    this.powerText = this.add
      .text(10, 10, "Power: 0W", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.minuteCostText = this.add
      .text(10, 40, "Minute Cost: $0.00", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }

  setupDeviceInteractions() {
    window.addEventListener("message", (event) => {
      if (event.data?.type === "ADD_DEVICE") {
        this.addDevice(event.data.device);
      }
    });
    this.input.dragDistanceThreshold = 5;
  }

  addDevice(deviceKey, x = 100, y = 100, initialState = false) {
    const deviceConfig = POWER_CONFIG.devices[deviceKey];
    if (!deviceConfig) return;

    // Update device count
    this.deviceCounts[deviceKey] = (this.deviceCounts[deviceKey] || 0) + 1;
    if (initialState)
      this.activeDevices[deviceKey] = (this.activeDevices[deviceKey] || 0) + 1;

    const device = this.add
      .image(x, y, deviceKey)
      .setInteractive({ draggable: true })
      .setDepth(500)
      .setScale(1.2)
      .setData({
        state: initialState,
        type: deviceConfig.type,
        key: deviceKey,
      });

    this.setupDeviceControls(device, deviceKey, deviceConfig);
    this.devices.push(device);
    this.updatePowerConsumption();
  }

  setupDeviceControls(device, deviceKey, deviceConfig) {
    // Delete button
    const deleteBtn = this.add
      .text(device.x + 30, device.y - 30, "✕", {
        fontFamily: "Arial",
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#e74c3c",
        padding: { left: 6, right: 6, top: 4, bottom: 4 },
        stroke: "#c0392b",
        strokeThickness: 1,
      })
      .setInteractive({ useHandCursor: true })
      .setDepth(1000)
      .setOrigin(0.5)
      .setVisible(false);

    // Double click to show delete button
    let clickCount = 0;
    device.on("pointerdown", () => {
      clickCount++;
      if (clickCount === 1) {
        this.time.delayedCall(300, () => {
          if (clickCount === 2) {
            deleteBtn.setVisible(!deleteBtn.visible);
          }
          clickCount = 0;
        });
      }
    });

    // Delete device
    deleteBtn.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      const wasOn = device.getData("state");
      const deviceKey = device.texture.key;

      this.tweens.add({
        targets: [device, deleteBtn, device.label],
        alpha: 0,
        scale: 0.8,
        duration: 200,
        onComplete: () => {
          this.devices = this.devices.filter((d) => d !== device);
          this.deviceCounts[deviceKey]--;
          if (wasOn) this.activeDevices[deviceKey]--;

          [device, deleteBtn, device.label].forEach((el) => el && el.destroy());
          this.saveDevices();
          this.updatePowerConsumption();
        },
      });
    });

    // Drag handling
    device.on("drag", (pointer, dragX, dragY) => {
      device.setPosition(dragX, dragY);
      deleteBtn.setPosition(dragX + 30, dragY - 30);
      if (device.label) device.label.setPosition(dragX, dragY + 40);
    });

    device.on("dragend", () => this.saveDevices());

    // Device label
    if (
      deviceConfig.type === "light" ||
      deviceConfig.type === "fan" ||
      deviceConfig.type === "appliance"
    ) {
      const labelText = `${deviceConfig.label} ${
        device.getData("state") ? "ON" : "OFF"
      }`;
      device.label = this.add
        .text(device.x, device.y + 40, labelText, {
          fontFamily: "Arial",
          fontSize: "14px",
          fill: device.getData("state") ? "#00ff41" : "#ffffff",
          backgroundColor: device.getData("state") ? "#0a2a0a" : "#1a1a1a",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          stroke: device.getData("state") ? "#00aa00" : "#333333",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setDepth(1000);

      device.on("pointerup", () => {
        this.toggleDevice(device);
      });

      if (deviceConfig.type === "fan" && device.getData("state")) {
        this.tweens.add({
          targets: device,
          angle: 360,
          duration: 800,
          repeat: -1,
        });
      }
    }
  }

  toggleDevice(device) {
    const key = device.texture?.key || "lamp"; // fallback to "lamp" for zones
    const config = POWER_CONFIG.devices[key] || { label: "Tube Light" };
    const newState = !device.getData("state");
    device.setData("state", newState);

    // Update active count if applicable
    if (key !== "lamp") {
      if (newState) this.activeDevices[key]++;
      else this.activeDevices[key]--;
    }

    // Update label UI
    if (device.label) {
      device.label.setText(`${config.label} ${newState ? "ON" : "OFF"}`);
      device.label.setFill(newState ? "#00ff41" : "#fff");
      device.label.setBackgroundColor(newState ? "#0a2a0a" : "#1a1a1a");
    }

    // Handle fan animation
    if (config.type === "fan" && device.texture?.key) {
      if (newState) {
        device.rotation = 0;
        this.tweens.add({
          targets: device,
          angle: 360,
          duration: 800,
          repeat: -1,
        });
      } else {
        this.tweens.killTweensOf(device);
        device.angle = 0;
      }
    }

    // Save changes
    this.updatePowerConsumption();
    this.saveDevices();

    // Save lamp state specifically
    if (device.getData("type") === "light" && !device.texture?.key) {
      this.updateLampLabel(device);
    }
  }
  saveLampStates() {
    const lampStates = this.lamps.map((lamp) => lamp.getData("state"));
    localStorage.setItem("lampStates", JSON.stringify(lampStates));
  }

  updatePowerConsumption() {
    const now = Date.now();
    const timeElapsed = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    let totalPower = 0;
    let deviceDetails = [];

    // Calculate from lamps
    this.lamps.forEach((lamp) => {
      if (lamp.getData("state")) {
        totalPower += 60;
        deviceDetails.push({
          name: "Lamp",
          power: 60,
          state: "ON",
          type: "light",
        });
      } else {
        deviceDetails.push({
          name: "Lamp",
          power: 0,
          state: "OFF",
          type: "light",
        });
      }
    });

    // Calculate from devices
    this.devices.forEach((device) => {
      const config = POWER_CONFIG.devices[device.texture.key];
      if (!config) return;

      const isOn = device.getData("state") || config.alwaysOn;
      const devicePower =
        config.wattage * (config.alwaysOn ? config.dutyCycle : 1);

      if (isOn) totalPower += devicePower;

      deviceDetails.push({
        name: config.label,
        power: isOn ? devicePower : 0,
        state: isOn ? "ON" : config.alwaysOn ? "AUTO" : "OFF",
        type: config.type,
      });
    });

    this.instantPower = Math.round(totalPower);
    if (totalPower > this.peakPower) this.peakPower = Math.round(totalPower);

    // Update energy and cost
    const energyIncrement = (totalPower * timeElapsed) / 3600;
    this.dailyEnergy += energyIncrement;
    this.dailyCost = (this.dailyEnergy / 1000) * POWER_CONFIG.electricityRate;
    this.minuteCost += (energyIncrement / 1000) * POWER_CONFIG.electricityRate;

    // Update UI
    this.updatePowerUI();
    this.sendToDashboard(deviceDetails);

    // Save state every minute
    if (now % POWER_CONFIG.minuteInterval < POWER_CONFIG.updateInterval) {
      this.minuteCost = 0; // Reset minute cost after reporting
      this.savePowerData();
    }
  }

  updatePowerUI() {
    const color =
      this.instantPower > 1000
        ? "#ff5555"
        : this.instantPower > 500
        ? "#ffaa00"
        : "#55ff55";

    this.powerText.setText(`Power: ${this.instantPower}W`).setColor(color);
    this.minuteCostText.setText(`Minute Cost: $${this.minuteCost.toFixed(4)}`);
  }

  startPowerMonitoring() {
    // Real-time updates
    this.time.addEvent({
      delay: POWER_CONFIG.updateInterval,
      callback: this.updatePowerConsumption,
      callbackScope: this,
      loop: true,
    });

    // Minute updates
    this.time.addEvent({
      delay: POWER_CONFIG.minuteInterval,
      callback: () => {
        this.minuteCost = 0;
      },
      callbackScope: this,
      loop: true,
    });
  }

  savePowerData() {
    localStorage.setItem(
      "powerData",
      JSON.stringify({
        energy: this.dailyEnergy,
        cost: this.dailyCost,
        peak: this.peakPower,
        devices: {
          counts: this.deviceCounts,
          active: this.activeDevices,
        },
      })
    );
  }

  saveDevices() {
    const devices = this.devices.map((device) => ({
      key: device.texture.key,
      x: device.x,
      y: device.y,
      state: device.getData("state"),
    }));
    localStorage.setItem("savedDevices", JSON.stringify(devices));
    this.savePowerData();
  }

  sendToDashboard(deviceDetails = []) {
    const payload = {
      power: this.instantPower,
      energy: parseFloat(this.dailyEnergy.toFixed(2)),
      cost: parseFloat(this.dailyCost.toFixed(2)),
      peak: this.peakPower,
      minuteCost: parseFloat(this.minuteCost.toFixed(4)),
      lastUpdate: new Date().toLocaleTimeString(),
      devices: deviceDetails,
      deviceCounts: this.deviceCounts,
      activeDevices: this.activeDevices,
    };

    [window.parent, window].forEach((target) => {
      target?.postMessage(
        {
          type: "POWER_UPDATE",
          payload,
        },
        "*"
      );
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-container",
  scene: SmartHomeScene,
  backgroundColor: "#222",
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  window.gameScene = game.scene.getScene("SmartHomeScene");
});
