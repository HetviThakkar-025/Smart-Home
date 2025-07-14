import Phaser from "phaser";

const POWER_CONFIG = {
  devices: {
    light: { wattage: 60, type: 'light' },
    fan: { wattage: 75, type: 'fan' },
    tv: { wattage: 100, type: 'appliance' },
    oven: { wattage: 1200, type: 'appliance' },
    fridge: { wattage: 150, type: 'appliance', alwaysOn: true, dutyCycle: 0.7 },
    mirror: { wattage: 10, type: 'light' },
    chimney: { wattage: 50, type: 'fan' },
    washingmachine: { wattage: 500, type: 'appliance' },
    table: { wattage: 0, type: 'furniture' },
    carpet: { wattage: 0, type: 'furniture' }
  },
  electricityRate: 0.15,
  updateInterval: 5000 // 5 second updates
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
    this.lastUpdateTime = Date.now();
  }

  preload() {
    this.load.image("int1", "/assets/tilesets/int1.png");
    this.load.image("int2", "/assets/tilesets/int2.png");
    this.load.image("tiles2", "/assets/tilesets/tiles2.png");
    this.load.image("tiles3", "/assets/tilesets/tiles3.png");
    this.load.image("walls", "/assets/tilesets/walls.png");
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/map.tmj");

    Object.keys(POWER_CONFIG.devices).forEach(device => {
      this.load.image(device, `/assets/devices/${device}.png`);
    });
  }

  create() {
    // Load saved data
    const savedPowerData = localStorage.getItem('powerData');
    if (savedPowerData) {
      try {
        const { energy, cost, peak } = JSON.parse(savedPowerData);
        this.dailyEnergy = energy || 0;
        this.dailyCost = cost || 0;
        this.peakPower = peak || 0;
      } catch (e) {
        console.error("Error loading power data:", e);
      }
    }

    // Setup game world
    const map = this.make.tilemap({ key: "map" });
    const tilesets = [
      map.addTilesetImage("int1", "int1"),
      map.addTilesetImage("int2", "int2"),
      map.addTilesetImage("tiles2", "tiles2"),
      map.addTilesetImage("tiles3", "tiles3"),
      map.addTilesetImage("walls", "walls"),
    ];

    map.layers.forEach(layer => map.createLayer(layer.name, tilesets));
    
    // Setup camera
    const zoom = Math.min(
      this.cameras.main.width / map.widthInPixels,
      this.cameras.main.height / map.heightInPixels
    );
    this.cameras.main.setZoom(zoom).centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

    // Create lamps
    const lampLayer = map.getObjectLayer("lamps");
    if (lampLayer) {
      lampLayer.objects.forEach(obj => {
        const lamp = this.add.zone(obj.x, obj.y, obj.width, obj.height)
          .setOrigin(0)
          .setInteractive({ useHandCursor: true })
          .setData({ state: false });
        
        const label = this.add.text(obj.x + obj.width/2, obj.y - 15, "Lamp OFF", {
          fontFamily: "Arial",
          fontSize: "14px",
          fill: "#ffffff",
          backgroundColor: "#1a1a1a",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          stroke: "#333333",
          strokeThickness: 1
        }).setOrigin(0.5).setDepth(1000);
        
        lamp.setData('label', label);
        lamp.on("pointerdown", () => this.toggleLamp(lamp));
        this.lamps.push(lamp);
      });
    }

    // Setup power meter
    this.powerText = this.add.text(10, 10, "Power: 0W", {
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setScrollFactor(0).setDepth(1000);

    // Setup device interactions
    window.addEventListener("message", event => {
      if (event.data?.type === "ADD_DEVICE") {
        this.addDevice(event.data.device);
      }
    });
    this.input.dragDistanceThreshold = 5;
    
    // Load saved devices
    const savedDevices = localStorage.getItem("savedDevices");
    if (savedDevices) {
      try {
        JSON.parse(savedDevices).forEach(deviceData => {
          this.addDevice(deviceData.key, deviceData.x, deviceData.y, deviceData.state);
        });
      } catch (e) {
        console.error("Error loading saved devices:", e);
      }
    }

    // Send initial data and start monitoring
    this.sendInitialData();
    this.startPowerMonitoring();
    window.dispatchEvent(new Event('gameLoaded'));
  }

  addDevice(deviceKey, x = 100, y = 100, initialState = false) {
    const device = this.add.image(x, y, deviceKey)
      .setInteractive({ draggable: true })
      .setDepth(500)
      .setScale(1.2)
      .setData({ state: initialState });

    const deleteBtn = this.add.text(x + 30, y - 30, "✕", {
      fontFamily: "Arial",
      fontSize: "16px",
      fill: "#ffffff",
      backgroundColor: "#e74c3c",
      padding: { left: 6, right: 6, top: 4, bottom: 4 },
      stroke: "#c0392b",
      strokeThickness: 1
    }).setInteractive({ useHandCursor: true })
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
      const elementsToRemove = [device, deleteBtn];
      if (device.label) elementsToRemove.push(device.label);
      
      this.tweens.add({
        targets: elementsToRemove,
        alpha: 0,
        scale: 0.8,
        duration: 200,
        onComplete: () => {
          this.devices = this.devices.filter(d => d !== device);
          elementsToRemove.forEach(el => el.destroy());
          this.saveDevices();
          this.updatePowerConsumption();
        }
      });
    });

    // Drag handling
    device.on("drag", (pointer, dragX, dragY) => {
      device.setPosition(dragX, dragY);
      deleteBtn.setPosition(dragX + 30, dragY - 30);
      if (device.label) device.label.setPosition(dragX, dragY + 40);
    });

    device.on("dragend", () => this.saveDevices());

    // Setup device label if applicable
    const deviceConfig = POWER_CONFIG.devices[deviceKey];
    if (deviceConfig.type === 'light' || deviceConfig.type === 'fan') {
      const labelText = `${deviceKey.charAt(0).toUpperCase() + deviceKey.slice(1)} ${initialState ? 'ON' : 'OFF'}`;
      device.label = this.add.text(x, y + 40, labelText, {
        fontFamily: "Arial",
        fontSize: "14px",
        fill: initialState ? "#00ff41" : "#ffffff",
        backgroundColor: initialState ? "#0a2a0a" : "#1a1a1a",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: initialState ? "#00aa00" : "#333333",
        strokeThickness: 1
      }).setOrigin(0.5).setDepth(1000);
      
      device.on("pointerup", () => {
        const newState = !device.getData('state');
        device.setData('state', newState);
        device.label.setText(`${deviceKey.charAt(0).toUpperCase() + deviceKey.slice(1)} ${newState ? 'ON' : 'OFF'}`)
             .setStyle({
               fill: newState ? "#00ff41" : "#ffffff",
               backgroundColor: newState ? "#0a2a0a" : "#1a1a1a",
               stroke: newState ? "#00aa00" : "#333333"
             });

        if (deviceConfig.type === 'fan') {
          if (newState) {
            this.tweens.add({ targets: device, angle: 360, duration: 800, repeat: -1 });
          } else {
            device.angle = 0;
            this.tweens.killTweensOf(device);
          }
        }
        this.updatePowerConsumption();
      });

      if (deviceConfig.type === 'fan' && initialState) {
        this.tweens.add({ targets: device, angle: 360, duration: 800, repeat: -1 });
      }
    }

    this.devices.push(device);
    this.updatePowerConsumption();
  }

  toggleLamp(lamp) {
    const newState = !lamp.getData("state");
    lamp.setData("state", newState);
    
    const label = lamp.getData('label');
    label.setText(newState ? "Lamp ON" : "Lamp OFF")
         .setStyle({
           fill: newState ? "#00ff41" : "#ffffff",
           backgroundColor: newState ? "#0a2a0a" : "#1a1a1a",
           stroke: newState ? "#00aa00" : "#333333"
         });
    this.updatePowerConsumption();
  }

  updatePowerConsumption() {
    const now = Date.now();
    const timeElapsed = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    let totalPower = 0;
    
    // Calculate from lamps
    this.lamps.forEach(lamp => {
      if (lamp.getData('state')) totalPower += 60;
    });

    // Calculate from devices
    this.devices.forEach(device => {
      const config = POWER_CONFIG.devices[device.texture.key];
      if (device.getData('state') || config.alwaysOn) {
        totalPower += config.wattage * (config.alwaysOn ? config.dutyCycle : 1);
      }
    });

    this.instantPower = Math.round(totalPower);
    if (totalPower > this.peakPower) this.peakPower = Math.round(totalPower);
    
    // Update energy and cost
    this.dailyEnergy += (totalPower * timeElapsed) / 3600;
    this.dailyCost = (this.dailyEnergy / 1000) * POWER_CONFIG.electricityRate;

    // Update power text
    const color = this.instantPower > 1000 ? '#ff5555' : 
                 this.instantPower > 500 ? '#ffaa00' : '#55ff55';
    this.powerText.setText(`Power: ${this.instantPower}W`).setColor(color);

    this.sendToDashboard();
  }

  startPowerMonitoring() {
    this.time.addEvent({
      delay: POWER_CONFIG.updateInterval,
      callback: this.updatePowerConsumption,
      callbackScope: this,
      loop: true
    });
  }

  sendInitialData() {
    const payload = {
      power: this.instantPower,
      energy: parseFloat(this.dailyEnergy.toFixed(2)),
      cost: parseFloat(this.dailyCost.toFixed(2)),
      peak: this.peakPower,
      lastUpdate: new Date().toLocaleTimeString(),
      isInitialData: true
    };

    [window.parent, window].forEach(target => {
      target?.postMessage({
        type: "POWER_UPDATE",
        payload
      }, '*');
    });
  }

  sendToDashboard() {
    const payload = {
      power: this.instantPower,
      energy: parseFloat(this.dailyEnergy.toFixed(2)),
      cost: parseFloat(this.dailyCost.toFixed(2)),
      peak: this.peakPower,
      lastUpdate: new Date().toLocaleTimeString()
    };

    // Save to localStorage
    localStorage.setItem('powerData', JSON.stringify({
      energy: this.dailyEnergy,
      cost: this.dailyCost,
      peak: this.peakPower
    }));

    // Send to dashboard
    [window.parent, window].forEach(target => {
      target?.postMessage({
        type: "POWER_UPDATE",
        payload
      }, '*');
    });
  }

  saveDevices() {
    const devices = this.devices.map(device => ({
      key: device.texture.key,
      x: device.x,
      y: device.y,
      state: device.getData('state')
    }));
    localStorage.setItem("savedDevices", JSON.stringify(devices));
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-container",
  scene: SmartHomeScene,
  backgroundColor: "#222"
};

window.addEventListener("load", () => {
  const game = new Phaser.Game(config);
  window.gameScene = game.scene.getScene("SmartHomeScene");
});