import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import CustomizeScene from "../game/CustomizeScene";

export default function Customize() {
    const gameRef = useRef(null);
    const gameInstance = useRef(null);

    useEffect(() => {
        if (!gameRef.current || gameInstance.current) return;

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: "#87ceeb",
            parent: gameRef.current,
            scene: [CustomizeScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        };

        gameInstance.current = new Phaser.Game(config);

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Customize Your Map</h1>
            <div
                ref={gameRef}
                className="border-4 border-gray-300 rounded-lg shadow-lg w-[800px] h-[600px]"
            />
        </div>
    );
}