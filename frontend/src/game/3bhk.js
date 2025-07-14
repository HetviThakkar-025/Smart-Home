import Phaser from "phaser";

class room2bhk extends Phaser.Scene {
  constructor() {
    super("MyGame");
    this.lamps = [];
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

    map.layers.forEach((layer) => {
      map.createLayer(layer.name, tilesets, 0, 0);
    });

    const zoom = Math.min(
      this.sys.game.config.width / map.widthInPixels,
      this.sys.game.config.height / map.heightInPixels
    );
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);

    const lampLayer = map.getObjectLayer("lamps");
    if (lampLayer) {
      lampLayer.objects.forEach((obj) =>
        this.createLampZone(obj.x, obj.y, obj.width, obj.height)
      );
    }

    window.addEventListener("message", (event) => {
      if (event.data.type === "ADD_DEVICE") {
        this.addDraggableDevice(event.data.device);
      }
    });

    this.input.dragDistanceThreshold = 5;

    // Load saved devices
    this.loadDevices();
  }

  saveDevices() {
    const devices = [];
    this.children.each((child) => {
      if (
        child instanceof Phaser.GameObjects.Image &&
        ["tv", "table", "light", "fan", "carpet"].includes(child.texture.key)
      ) {
        devices.push({
          key: child.texture.key,
          x: child.x,
          y: child.y,
          state: child.getData("state") || false,
        });
      }
    });
    localStorage.setItem("savedDevices", JSON.stringify(devices));
  }

  loadDevices() {
    const savedDevices = localStorage.getItem("savedDevices");
    if (savedDevices) {
      JSON.parse(savedDevices).forEach((deviceData) => {
        this.addSavedDevice(deviceData);
      });
    }
  }

  addSavedDevice(deviceData) {
    const device = this.add
      .image(deviceData.x, deviceData.y, deviceData.key)
      .setInteractive({ draggable: true })
      .setDepth(500)
      .setScale(1.2);

    device.setData("state", deviceData.state);
    this.setupDeviceInteractions(device);

    if (deviceData.key === "light" || deviceData.key === "fan") {
      this.createDeviceLabel(device, deviceData);
    }
  }

  createDeviceLabel(device, deviceData) {
    const isLight = deviceData.key === "light";
    const labelText = isLight
      ? deviceData.state
        ? "Light ON"
        : "Light OFF"
      : deviceData.state
      ? "Fan ON"
      : "Fan OFF";

    const label = this.add
      .text(device.x, device.y + 40, labelText, {
        fontFamily: "Arial",
        fontSize: "14px",
        fill: deviceData.state ? "#00ff41" : "#ffffff",
        backgroundColor: deviceData.state ? "#0a2a0a" : "#1a1a1a",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: deviceData.state ? "#00aa00" : "#333333",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setDepth(1000);

    if (isLight) {
      device.lightLabel = label;
    } else {
      device.fanLabel = label;
      if (deviceData.state) {
        this.tweens.add({
          targets: device,
          angle: 360,
          duration: 800,
          repeat: -1,
        });
      }
    }
  }

  createLampZone(x, y, width = 32, height = 32) {
    const label = this.add
      .text(x + 10, y - 10, "Lamp OFF", {
        fontFamily: "Arial",
        fontSize: "14px",
        fill: "#ffffff",
        backgroundColor: "#1a1a1a",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        stroke: "#333",
        strokeThickness: 1,
      })
      .setOrigin(0.5)
      .setDepth(1000);

    label.setScale(0.8);
    label.setAlpha(0);
    this.tweens.add({
      targets: label,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: "Back.easeOut",
    });

    const zone = this.add
      .zone(x, y, width, height)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });
    zone.setData("label", label);
    zone.setData("state", false);

    zone.on("pointerdown", () => {
      const newState = !zone.getData("state");
      zone.setData("state", newState);
      label.setText(newState ? "Lamp ON" : "Lamp OFF");
      label.setStyle({
        fill: newState ? "#00ff41" : "#ffffff",
        backgroundColor: newState ? "#0a2a0a" : "#1a1a1a",
        stroke: newState ? "#00aa00" : "#333333",
      });

      this.tweens.add({
        targets: label,
        scale: 0.9,
        duration: 100,
        yoyo: true,
        ease: "Power2",
      });
    });

    this.lamps.push(zone);
  }

  addDraggableDevice(deviceKey) {
    const x = 100;
    const y = 100;
    const device = this.add
      .image(x, y, deviceKey)
      .setInteractive({ draggable: true })
      .setDepth(500);
    device.setScale(1.2);
    this.input.setDraggable(device);

    const deleteBtn = this.add
      .text(x + 30, y - 30, "✕", {
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

    let clickTimer = null;
    let clickCount = 0;

    device.on("pointerdown", () => {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = this.time.delayedCall(250, () => {
        if (clickCount === 2) {
          deleteBtn.setVisible(!deleteBtn.visible);
        }
        clickCount = 0;
      });
    });

    deleteBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [device, deleteBtn],
        scale: 0.8,
        alpha: 0.5,
        duration: 150,
        onComplete: () => {
          device.removeAllListeners();
          deleteBtn.removeAllListeners();

          device.destroy();
          deleteBtn.destroy();

          if (device.lightLabel) device.lightLabel.destroy();
          if (device.fanLabel) device.fanLabel.destroy();

          this.saveDevices();
        },
      });
    });

    device.on("drag", (pointer, dragX, dragY) => {
      device.setPosition(dragX, dragY);
      deleteBtn.setPosition(dragX + 30, dragY - 30);

      if (device.lightLabel) device.lightLabel.setPosition(dragX, dragY + 40);
      if (device.fanLabel) device.fanLabel.setPosition(dragX, dragY + 40);
    });

    device.on("dragend", () => {
      this.saveDevices();
    });

    if (deviceKey === "light") {
      const lightLabel = this.add
        .text(x, y + 40, "Light OFF", {
          fontFamily: "Arial",
          fontSize: "14px",
          fill: "#ffffff",
          backgroundColor: "#1a1a1a",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          stroke: "#333333",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setDepth(1000);

      lightLabel.setAlpha(0);
      this.tweens.add({ targets: lightLabel, alpha: 1, duration: 300 });

      device.setData("state", false);
      device.lightLabel = lightLabel;

      device.on("pointerup", () => {
        const newState = !device.getData("state");
        device.setData("state", newState);
        lightLabel.setText(newState ? "Light ON" : "Light OFF");
        lightLabel.setStyle({
          fill: newState ? "#00ff41" : "#ffffff",
          backgroundColor: newState ? "#0a2a0a" : "#1a1a1a",
          stroke: newState ? "#00aa00" : "#333333",
        });

        this.tweens.add({
          targets: lightLabel,
          scale: 0.95,
          duration: 100,
          yoyo: true,
        });

        this.saveDevices();
      });
    }

    if (deviceKey === "fan") {
      const fanLabel = this.add
        .text(x, y + 40, "Fan OFF", {
          fontFamily: "Arial",
          fontSize: "14px",
          fill: "#ffffff",
          backgroundColor: "#1a1a1a",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
          stroke: "#333333",
          strokeThickness: 1,
        })
        .setOrigin(0.5)
        .setDepth(1000);

      fanLabel.setAlpha(0);
      this.tweens.add({ targets: fanLabel, alpha: 1, duration: 300 });

      device.setData("state", false);
      device.fanLabel = fanLabel;

      device.on("pointerup", () => {
        const newState = !device.getData("state");
        device.setData("state", newState);

        fanLabel.setText(newState ? "Fan ON" : "Fan OFF");
        fanLabel.setStyle({
          fill: newState ? "#00ff41" : "#ffffff",
          backgroundColor: newState ? "#0a2a0a" : "#1a1a1a",
          stroke: newState ? "#00aa00" : "#333333",
        });

        if (newState) {
          this.tweens.add({
            targets: device,
            angle: 360,
            duration: 800,
            repeat: -1,
          });
        } else {
          device.angle = 0;
          this.tweens.killTweensOf(device);
        }

        this.tweens.add({
          targets: fanLabel,
          scale: 0.95,
          duration: 100,
          yoyo: true,
        });

        this.saveDevices();
      });
    }

    this.saveDevices();
  }

  setupDeviceInteractions(device) {
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

    let clickTimer = null;
    let clickCount = 0;

    device.on("pointerdown", () => {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = this.time.delayedCall(250, () => {
        if (clickCount === 2) {
          deleteBtn.setVisible(!deleteBtn.visible);
        }
        clickCount = 0;
      });
    });

    deleteBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [device, deleteBtn],
        scale: 0.8,
        alpha: 0.5,
        duration: 150,
        onComplete: () => {
          device.removeAllListeners();
          deleteBtn.removeAllListeners();

          device.destroy();
          deleteBtn.destroy();

          if (device.lightLabel) device.lightLabel.destroy();
          if (device.fanLabel) device.fanLabel.destroy();

          this.saveDevices();
        },
      });
    });

    device.on("drag", (pointer, dragX, dragY) => {
      device.setPosition(dragX, dragY);
      deleteBtn.setPosition(dragX + 30, dragY - 30);

      if (device.lightLabel) device.lightLabel.setPosition(dragX, dragY + 40);
      if (device.fanLabel) device.fanLabel.setPosition(dragX, dragY + 40);
    });

    device.on("dragend", () => {
      this.saveDevices();
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-container2",
  scene: room2bhk,
  backgroundColor: "#222",
};

window.addEventListener("load", () => {
  new Phaser.Game(config);
});
