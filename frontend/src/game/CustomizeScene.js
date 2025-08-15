import Phaser from "phaser";

export default class CustomizeScene extends Phaser.Scene {
    constructor() {
        super("CustomizeScene");
    }

    preload() {
        // Add load error handling
        this.load.on('loaderror', (file) => {
            console.error("Failed to load:", file.key);
        });

        this.load.tilemapTiledJSON("map", "/assets/tilemaps/blank_custom.tmj");
        this.load.image("walls", "/assets/tilesets/walls.png");
        this.load.image("int1", "/assets/tilesets/int1.png");
    }

    create() {
        try {
            console.log("Attempting to create tilemap...");
            
            // Create with debug output
            const map = this.make.tilemap({ 
                key: "map",
                tileWidth: 32,    // Add your actual tile dimensions
                tileHeight: 32   // Add your actual tile dimensions
            });
            
            if (!map) {
                throw new Error("Tilemap creation failed");
            }

            console.log("Tilemap created, tilesets:", map.tilesets);

            const wallsTileset = map.addTilesetImage("walls", "walls");
            const int1Tileset = map.addTilesetImage("int1", "int1");

            if (!wallsTileset || !int1Tileset) {
                console.warn("Available tilesets:", map.tilesets);
                throw new Error("Tileset not found");
            }

            console.log("Creating layers...");
            const lowerLayer = map.createLayer("Lower", wallsTileset, 0, 0);
            const upperLayer = map.createLayer("Upper", int1Tileset, 0, 0);

            if (!lowerLayer || !upperLayer) {
                console.warn("Available layers:", map.layers);
                throw new Error("Layer creation failed");
            }

            console.log("Scene setup complete");
        } catch (error) {
            console.error("Fatal error in create():", error);
            this.scene.stop();
        }
    }
}