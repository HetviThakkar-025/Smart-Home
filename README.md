# 🏡 Home Automation System (React + Phaser + Tiled)

An interactive 2D smart home automation system built using **Phaser 3**, **Tiled**, and **React**. This project allows users to simulate and control home appliances like **lights, fans, TVs, and tables** on a virtual 2BHK map with **drag-and-drop**, **ON/OFF toggles**, and **device animations**.

## 🚀 Features

- 🗺️ Interactive 2D map created with **Tiled** (.tmj format)
- ⚡ Real-time ON/OFF toggles for lights and fans
- 🌪️ Fan spinning animation when turned ON
- 📺 Drag-and-drop device placement (TV, Light, Fan, Table)
- 🗑️ Delete devices with a click
- 🧩 Phaser embedded in a React frontend using an `<iframe>`
- 🎨 Devices loaded from Phaser assets folder (`/assets/devices/`)
- 📦 MERN stack structure with Vite for React

## 🏗️ Project Structure

my-home-automation/
├── client/ # React frontend
│ ├── public/
│ │ ├── assets/
│ │ │ ├── devices/ # Device images: light.png, fan.png, tv.png, table.png
│ │ │ ├── tilemaps/ # map.tmj
│ │ │ └── tilesets/ # floor.png
│ └── src/
│ ├── game/ # Phaser 3 logic (main.js, index.js)
│ └── components/ # React components
├── server/ # Express.js backend (optional for future APIs)
└── README.md # You are here



## 🧰 Technologies Used

- **Phaser 3**
- **Tiled Map Editor**
- **React (Vite)**
- **JavaScript (ES6+)**
- **Node.js + Express** (for future device state persistence)
- **HTML5 Canvas**

## 📦 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/your-username/home-automation.git
cd home-automation
cd client
npm install

npm run dev

