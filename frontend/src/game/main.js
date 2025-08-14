import Phaser from "phaser";

const POWER_CONFIG = {
  devices: {
    light: { wattage: 40, type: "light", label: "Tube Light" }, // Common LED tube light wattage
    fan: { wattage: 75, type: "fan", label: "Fan" }, // Standard ceiling fan wattage
    tv: { wattage: 75, type: "appliance", label: "TV" }, // Modern LED TV wattage
    oven: { wattage: 1000, type: "appliance", label: "Microwave Oven" }, // Typical microwave oven wattage
    fridge: {
      wattage: 150, // Average running wattage, as it cycles
      type: "appliance",
      alwaysOn: true, // Runs 50% of the time
      label: "Fridge",
    },
    mirror: { wattage: 10, type: "light", label: "Mirror Light" }, // Low wattage light
    chimney: { wattage: 200, type: "fan", label: "Kitchen Chimney" }, // Typical kitchen chimney wattage
    washingmachine: {
      wattage: 500, // Common washing machine wattage
      type: "appliance",
      label: "Washing Machine",
    },
    table: { wattage: 0, type: "furniture", label: "Table" },
    carpet: { wattage: 0, type: "furniture", label: "Carpet" },
    bed: { wattage: 0, type: "furniture", label: "Bed" },
    sofa: { wattage: 0, type: "furniture", label: "Sofa" },
  },
  electricityRate: 6.0, // ₹6 per kWh (typical Indian residential electricity rate)
  updateInterval: 1000, // Update every second
  minuteInterval: 60000, // Save every minute
};

class SmartHomeScene extends Phaser.Scene {
  constructor() {
    super("SmartHomeScene");
    this.devices = [];
    this.lamps = [];
    this.deviceLabels = [];
    this.instantPower = 0; // Watts
    this.dailyEnergy = 0; // kWh
    this.dailyCost = 0; // ₹
    this.peakPower = 0; // Watts
    this.lastUpdateTime = Date.now();
    this.lastSavedTime = 0;
    this.gameStateKey = "smartHomeFullState_v4";
    this.fridgeCycleState = false; // Track fridge on/off cycle
    this.fridgeCycleTimer = 0;
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
    this.setupGameWorld();
    this.setupDeviceInteractions();
    this.loadFullState();
    this.startPowerMonitoring();
    window.dispatchEvent(new Event("gameLoaded"));
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

    const zoom = Math.min(
      this.cameras.main.width / map.widthInPixels,
      this.cameras.main.height / map.heightInPixels
    );
    this.cameras.main
      .setZoom(zoom)
      .centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

    this.setupLamps(map);
  }

  setupLamps(map) {
    const lampLayer = map.getObjectLayer("lamps");
    if (!lampLayer) return;

    lampLayer.objects.forEach((obj) => {
      const lamp = this.add
        .zone(obj.x, obj.y, obj.width, obj.height)
        .setOrigin(0)
        .setInteractive({ useHandCursor: true })
        .setData({ state: false, type: "light" });

      lamp.on("pointerdown", () => this.toggleDevice(lamp));
      this.lamps.push(lamp);
    });
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

    const label = this.add.text(x, y + 40, `${deviceConfig.label}: ${initialState ? "ON" : "OFF"}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    })
    .setOrigin(0.5)
    .setDepth(1000);

    this.deviceLabels.push({ device, label });
    this.setupDeviceControls(device, deviceKey, deviceConfig);
    this.devices.push(device);
    this.updatePowerConsumption();
    this.saveFullState();
  }

  setupDeviceControls(device, deviceKey, deviceConfig) {
    const deleteBtn = this.add
      .text(device.x + 30, device.y - 30, "✕", {
        fontFamily: "Arial",
        fontSize: "16px",
        fill: "#ffffff",
        backgroundColor: "#e74c3c",
        padding: { left: 6, right: 6, top: 4, bottom: 4 },
      })
      .setInteractive({ useHandCursor: true })
      .setDepth(1000)
      .setOrigin(0.5)
      .setVisible(false);

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

    deleteBtn.on("pointerdown", (pointer) => {
      pointer.event.stopPropagation();
      this.tweens.add({
        targets: [device, deleteBtn],
        alpha: 0,
        scale: 0.8,
        duration: 200,
        onComplete: () => {
          const labelIndex = this.deviceLabels.findIndex(item => item.device === device);
          if (labelIndex !== -1) {
            this.deviceLabels[labelIndex].label.destroy();
            this.deviceLabels.splice(labelIndex, 1);
          }
          
          this.devices = this.devices.filter((d) => d !== device);
          [device, deleteBtn].forEach((el) => el && el.destroy());
          this.updatePowerConsumption();
          this.saveFullState();
        },
      });
    });

    device.on("drag", (pointer, dragX, dragY) => {
      device.setPosition(dragX, dragY);
      deleteBtn.setPosition(dragX + 30, dragY - 30);
      
      const labelObj = this.deviceLabels.find(item => item.device === device);
      if (labelObj) {
        labelObj.label.setPosition(dragX, dragY + 40);
      }
    });

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

  toggleDevice(device) {
    const key = device.texture?.key || "lamp";
    const config = POWER_CONFIG.devices[key] || { label: "Tube Light" };
    const newState = !device.getData("state");
    device.setData("state", newState);

    const labelObj = this.deviceLabels.find(item => item.device === device);
    if (labelObj) {
      labelObj.label.setText(`${config.label}: ${newState ? "ON" : "OFF"}`);
    }

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

    this.updatePowerConsumption();
    this.saveFullState();
  }

  updatePowerConsumption() {
    const now = Date.now();
    const timeElapsed = (now - this.lastUpdateTime) / 1000; // in seconds
    this.lastUpdateTime = now;

    // Update fridge cycle (runs 50% of time if alwaysOn)
    this.fridgeCycleTimer += timeElapsed;
    if (this.fridgeCycleTimer >= 1800) { // 30 minute cycle
      this.fridgeCycleTimer = 0;
      this.fridgeCycleState = !this.fridgeCycleState;
    }

    let totalPower = 0;
    let deviceDetails = [];

    // Calculate power from lamps
    this.lamps.forEach((lamp) => {
      const isOn = lamp.getData("state");
      const power = isOn ? POWER_CONFIG.devices.light.wattage : 0;
      totalPower += power;
      deviceDetails.push({
        name: "Lamp",
        power,
        state: isOn ? "ON" : "OFF",
        type: "light",
      });
    });

    // Calculate power from devices
    this.devices.forEach((device) => {
      const config = POWER_CONFIG.devices[device.texture.key];
      if (!config) return;

      let isOn = device.getData("state");
      let devicePower = 0;
      let state = isOn ? "ON" : "OFF";

      if (config.alwaysOn) {
        // For always-on devices like fridge
        isOn = this.fridgeCycleState;
        devicePower = isOn ? config.wattage : 0;
        state = isOn ? "RUNNING" : "IDLE";
      } else {
        devicePower = isOn ? config.wattage : 0;
      }

      totalPower += devicePower;
      deviceDetails.push({
        name: config.label,
        power: devicePower,
        state,
        type: config.type,
      });
    });

    // Update power metrics
    this.instantPower = Math.round(totalPower);
    if (totalPower > this.peakPower) this.peakPower = Math.round(totalPower);

    // Calculate energy consumption (kWh = (Watts × hours) / 1000)
    const energyIncrement = (totalPower * timeElapsed) / 3600000; // Convert to kWh
    this.dailyEnergy += energyIncrement;
    this.dailyCost = this.dailyEnergy * POWER_CONFIG.electricityRate;

    // Save periodically
    if (now - this.lastSavedTime > POWER_CONFIG.minuteInterval) {
      this.sendToBackend(deviceDetails);
      this.lastSavedTime = now;
    }

    this.saveFullState();
    this.sendToDashboard(deviceDetails);
  }

  startPowerMonitoring() {
    this.time.addEvent({
      delay: POWER_CONFIG.updateInterval,
      callback: this.updatePowerConsumption,
      callbackScope: this,
      loop: true,
    });
  }

  saveFullState() {
    const state = {
      devices: this.devices.map(device => ({
        key: device.texture.key,
        x: device.x,
        y: device.y,
        state: device.getData("state")
      })),
      lamps: this.lamps.map(lamp => ({
        x: lamp.x,
        y: lamp.y,
        state: lamp.getData("state")
      })),
      instantPower: this.instantPower,
      dailyEnergy: this.dailyEnergy,
      dailyCost: this.dailyCost,
      peakPower: this.peakPower,
      lastUpdateTime: this.lastUpdateTime,
      lastSavedTime: this.lastSavedTime
    };

    localStorage.setItem(this.gameStateKey, JSON.stringify(state));
  }

  loadFullState() {
    const savedState = localStorage.getItem(this.gameStateKey);
    if (!savedState) return;

    try {
      const state = JSON.parse(savedState);
      
      if (state.lamps && this.lamps.length > 0) {
        state.lamps.forEach((savedLamp, index) => {
          if (this.lamps[index]) {
            this.lamps[index].setData("state", savedLamp.state);
          }
        });
      }

      if (state.devices) {
        state.devices.forEach(savedDevice => {
          this.addDevice(
            savedDevice.key, 
            savedDevice.x, 
            savedDevice.y, 
            savedDevice.state
          );
        });
      }

      this.instantPower = state.instantPower || 0;
      this.dailyEnergy = state.dailyEnergy || 0;
      this.dailyCost = state.dailyCost || 0;
      this.peakPower = state.peakPower || 0;
      this.lastUpdateTime = state.lastUpdateTime || Date.now();
      this.lastSavedTime = state.lastSavedTime || 0;

    } catch (error) {
      console.error("Error loading game state:", error);
    }
  }

  sendToDashboard(deviceDetails = []) {
    const payload = {
      power: this.instantPower,
      energy: parseFloat(this.dailyEnergy.toFixed(4)),
      cost: parseFloat(this.dailyCost.toFixed(2)),
      peak: this.peakPower,
      devices: deviceDetails,
      timestamp: new Date().toISOString()
    };

    window.parent.postMessage({
      type: "POWER_UPDATE",
      payload: payload
    }, "*");
  }

  async sendToBackend(deviceDetails) {
    try {
      const payload = {
        power: this.instantPower,
        energy: parseFloat(this.dailyEnergy.toFixed(4)),
        cost: parseFloat(this.dailyCost.toFixed(2)),
        peak: this.peakPower,
        devices: deviceDetails,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Failed to save power data:', await response.text());
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-container",
  scene: SmartHomeScene,
  backgroundColor: "#222",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  window.gameScene = game.scene.getScene("SmartHomeScene");
});