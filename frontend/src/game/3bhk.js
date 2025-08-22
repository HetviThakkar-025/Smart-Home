import Phaser from "phaser";

const POWER_CONFIG = {
  devices: {
    light: { wattage: 40, type: "light", label: "Tube Light" },
    fan: { wattage: 75, type: "fan", label: "Fan" },
    tv: { wattage: 75, type: "appliance", label: "TV" },
    oven: { wattage: 1000, type: "appliance", label: "Microwave Oven" },
    fridge: {
      wattage: 150,
      type: "appliance",
      alwaysOn: true,
      label: "Fridge",
    },
    mirror: { wattage: 10, type: "light", label: "Mirror Light" },
    chimney: { wattage: 200, type: "fan", label: "Kitchen Chimney" },
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
  electricityRate: 6.0, // ₹6 per kWh
  updateInterval: 1000,
  minuteInterval: 60000,
};

class room2bhk extends Phaser.Scene {
  constructor() {
    super("SmartHomeScene");
    this.devices = [];
    this.lamps = [];
    this.deviceLabels = [];
    this.instantPower = 0;
    this.dailyEnergy = 0;
    this.dailyCost = 0;
    this.peakPower = 0;
    this.lastUpdateTime = Date.now();
    this.lastSavedTime = 0;
    this.gameStateKey = "smartHomeFull2";
    this.fridgeCycleState = false;
    this.fridgeCycleTimer = 0;
    this.currentDate = new Date().toDateString();
  }

   preload() {
    this.load.image("int1", "/assets/tilesets/int1.png");
    this.load.image("int2", "/assets/tilesets/int2.png");
    this.load.image("int3", "/assets/tilesets/int3.png");
    this.load.image("tiles2", "/assets/tilesets/tiles2.png");
    this.load.image("tiles3", "/assets/tilesets/tiles3.png");
    this.load.image("tiles", "/assets/tilesets/tiles.png");
    this.load.image("walls", "/assets/tilesets/walls.png");
    this.load.image("walls2", "/assets/tilesets/walls2.png");6
    this.load.image("walls3", "/assets/tilesets/walls3.png");
    this.load.image("walls4", "/assets/tilesets/walls4.png");
    this.load.image("grass", "/assets/tilesets/grass.png");
    this.load.image("carpets", "/assets/tilesets/carpets.png");
    this.load.image("floor", "/assets/tilesets/floor.png");

    this.load.tilemapTiledJSON("map", "/assets/tilemaps/3bhk.tmj");

    this.load.image("tv", "/assets/devices/tv.png");
    this.load.image("table", "/assets/devices/table.png");
    this.load.image("light", "/assets/devices/light.png");
    this.load.image("fan", "/assets/devices/fan.png");
    this.load.image("carpet", "/assets/devices/carpet.png");
    this.load.image("mirror", "/assets/devices/mirror.png");
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
      map.addTilesetImage("int3", "int3"),
      map.addTilesetImage("tiles2", "tiles2"),
      map.addTilesetImage("tiles3", "tiles3"),
      map.addTilesetImage("tiles", "tiles"),
      map.addTilesetImage("walls", "walls"),
      map.addTilesetImage("walls2", "walls2"),
      map.addTilesetImage("walls3", "walls3"),
      map.addTilesetImage("walls4", "walls4"),
      map.addTilesetImage("grass", "grass"),
      map.addTilesetImage("carpets", "carpets"),
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

     const label = this.add.text(
      x,
      y + 40,
      `${deviceConfig.label}: ${initialState ? "ON" : "OFF"}`,
      {
        fontFamily: "Arial",
        fontSize: "20px", // Increased font size
        color: initialState ? "#10B981" : "#EF4444", // Green for ON, Red for OFF
        backgroundColor: "#000000",
        padding: { x: 5, y: 2 },
      }
    )
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
    const currentDate = new Date().toDateString();
    
    // Reset daily metrics if date changed
    if (currentDate !== this.currentDate) {
      this.dailyEnergy = 0;
      this.dailyCost = 0;
      this.peakPower = 0;
      this.currentDate = currentDate;
    }

    const timeElapsed = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update fridge cycle
    this.fridgeCycleTimer += timeElapsed;
    if (this.fridgeCycleTimer >= 1800) {
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

    // Calculate energy consumption
    const energyIncrement = (totalPower * timeElapsed) / 3600000;
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
      lastSavedTime: this.lastSavedTime,
      currentDate: this.currentDate
    };

    localStorage.setItem(this.gameStateKey, JSON.stringify(state));
  }

  loadFullState() {
    const savedState = localStorage.getItem(this.gameStateKey);
    if (!savedState) return;

    try {
      const state = JSON.parse(savedState);
      
      // Check if we need to reset daily metrics (new day)
      const today = new Date().toDateString();
      if (state.currentDate !== today) {
        state.dailyEnergy = 0;
        state.dailyCost = 0;
        state.peakPower = 0;
      }
      
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
      this.currentDate = state.currentDate || today;

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
      timestamp: new Date().toISOString(),
      date: this.currentDate
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
        timestamp: new Date().toISOString(),
        date: this.currentDate
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
  parent: "phaser-container2",
  scene: room2bhk,
  backgroundColor: "#222",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
  
window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  window.gameScene = game.scene.getScene("room2bhk");
});