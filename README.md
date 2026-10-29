# 🚀 PDEU Campus Treasure Hunt: "Among Us" Edition

An interactive, web-based campus treasure hunt game designed specifically for **Pandit Deendayal Energy University (PDEU)** campus. Built with pure vanilla HTML5, CSS3, and modern JavaScript (ES Modules) — zero frameworks, zero build tools, 100% static hosting on **GitHub Pages**, backed by **Google Firebase Firestore** (free tier) for instant real-time synchronization across all players' screens.

---

## 🌟 The Game Concept

Teams of 2–4 players register with an organizer-assigned **Team ID** and **4-digit PIN** at physical check-in. Teams navigate through 6 sequential campus checkpoints by scanning physical QR codes to unlock cryptographic station puzzles.

### 👥 For Teams of 3–4 Players (Hidden Human Impostor)
- One player is secretly assigned as the **IMPOSTOR**.
- **The Impostor does NOT act in real life.** All sabotage happens **wirelessly through the website itself**, live, directly onto their teammates' phones in real time!
- **3 Single-Use Digital Sabotage Abilities:**
  1. 🧩 **Puzzle Swap (90s):** Teammates silently receive a decoy puzzle instead of the real station question. Answers submitted to the decoy are auto-rejected.
  2. 🗺️ **Map Scramble (120s):** Scrambles the team's radar map to deceptively highlight a wrong location pin as the next target, dimming the real one.
  3. ❌ **Fake Reject:** Traps the next attempt — when teammates submit the real correct answer, the system falsely reports it as "INCORRECT" once, costing them a wasted attempt and confusion.
- **Finish Voting:** Once station 6 is cleared, crewmates vote from their phones on who the Impostor was. Reveals if the crew caught the saboteur or if the Impostor got away!

### 🤖 For Teams of 2 Players (Rogue AI Anomaly)
- Since a 2-person team would make deducing a human saboteur trivial, 2-player teams experience a **"ROGUE AI"** mechanic: the ship's navigation computer itself glitches out!
- 2–3 times during their run, an emergency **CRITICAL MALFUNCTION** overlay strikes both players' phones at the exact same second.
- Both players must cooperate to solve an Among Us-style recovery mini-challenge (Sequence Memory, Power Bus Calibration, or Logic Decryption) within 30 seconds to restore their radar screen.
- Scored on total glitch recovery speed, earning the **"Debugged the Ship ⚡"** passport badge!

---

## 📍 The 6 Campus Locations (Fixed Sequence)

The locations array is centralized in [`js/config.js`](file:///js/config.js) as `LOCATIONS` for easy modification:

1. **OSAIL Gazebo** (`osail-gazebo`) — Student Activity Centre lawn.
2. **D Block Gazebo** (`dblock-gazebo`) — Engineering corridor pavilion.
3. **C Block Gazebo** (`cblock-gazebo`) — Petroleum & Science wing courtyard.
4. **A Block Seating** (`ablock-seating`) — Curved amphitheater concrete benches outside A Block.
5. **Ness 1 Float** (`ness1-float`) — Architectural canopy float near high-rise residences.
6. **Gemini Stage** (`gemini-stage`) — Final amphitheater stage & mission conclusion.

---

## 📁 Project Architecture

```
joyful-noether/
├── index.html                 # Player Login & Check-in Screen
├── role.html                  # Confidential Role Reveal (Crewmate / Impostor / Rogue AI)
├── map.html                   # Interactive Pan-Zoom Among Us Campus Radar
├── scan.html                  # Station Terminal & Cryptographic Puzzle Solver
├── scan/                      # Subfolder support for QR code links
│   └── index.html             # Parameter forwarder to scan.html
├── finish.html                # Mission Debrief, Impostor Voting, Score & Souvenir Stamp
├── admin.html                 # Organizer Dashboard, Live Monitor, QR Generator & Puzzle Editor
├── firestore.rules            # Security rules for Google Firestore
├── css/
│   ├── style.css              # Main Among Us sci-fi theme & outdoor daylight contrast
│   ├── map.css                # Pan-zoom viewport, bean-shaped markers & radar beacons
│   └── admin.css              # Live dashboard table & printable QR sheets
├── js/
│   ├── config.js              # Central Locations array, default puzzles, Firebase config, admin passcode
│   ├── firebase-service.js    # Real-time Firestore sync (with automatic local multi-tab mock fallback)
│   ├── sound.js               # Web Audio API synthesizer (alarms, victory chimes, glitch SFX)
│   ├── map-engine.js          # Pan-zoom gestures, Among Us pins & admin coordinate calibration
│   ├── sabotage-engine.js     # Impostor private ability dock & countdown timers
│   ├── rogue-ai-engine.js     # 2-player Rogue AI mini-games & auto-glitch manager
│   ├── app.js                 # Shared UI helpers, session auth & toast alerts
│   └── vendor/
│       └── qrcode.min.js      # Bundled QR code generator
└── assets/
    └── images/
        └── campus-map.svg     # Stylized PDEU campus masterplan with labeled blocks & gazebos
```

---

## ⚙️ Setup & Deployment Guide

### 1. Firebase Project Setup (Free Tier)
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Create a project**.
2. Name it e.g. `pdeu-amongus-hunt` (Google Analytics is optional).
3. In the left sidebar, click **Build > Firestore Database** and click **Create Database**.
   - Choose a nearby region (e.g. `asia-south1` Mumbai).
   - Start in **Production mode**.
4. In the Firestore tabs, click **Rules** and paste the contents of [`firestore.rules`](file:///firestore.rules), then click **Publish**.
5. In project settings (gear icon at top left), scroll to **Your apps**, click the **Web icon (`</>`)**, register the app name, and copy the `firebaseConfig` object.
6. Open [`js/config.js`](file:///js/config.js) in this project and replace `FIREBASE_CONFIG` with your credentials:
   ```javascript
   export const FIREBASE_CONFIG = {
     apiKey: "AIzaSy...",
     authDomain: "pdeu-amongus-hunt.firebaseapp.com",
     projectId: "pdeu-amongus-hunt",
     storageBucket: "pdeu-amongus-hunt.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

> [!NOTE]
> **Immediate Offline / Local Demo Mode:** If the credentials remain on defaults or if you test without internet, the site automatically switches to an internal multi-tab Mock DB with pre-loaded demo teams (`TEAM-101` and `TEAM-202`) so everything can be tested immediately in separate browser windows!

---

### 2. GitHub Pages Deployment (Free 1-Click Hosting)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for PDEU Among Us treasure hunt"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/joyful-noether.git
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, choose **Deploy from a branch**.
4. Select `main` (or `master`) and folder `/(root)`, then click **Save**.
5. Within 60 seconds, your site is live at:
   `https://YOUR_USERNAME.github.io/joyful-noether/`

---

## 🛠️ Organizer Dashboard (`admin.html`)

Access the organizer dashboard at `https://YOUR_USERNAME.github.io/joyful-noether/admin.html`.
- **Default Passcode:** `pdeu2026` (changeable in `js/config.js`).

### Features:
1. **Live Monitor & Leaderboard:**
   - Real-time Firestore stream showing Team ID, joined players, secret role assignments, active checkpoint, elapsed time, wrong attempts, sabotages triggered, and current score.
   - Leaderboard sorting by overall team score, Impostor score, or checkpoint progress.
2. **Team Pre-Generator:**
   - Enter desired number of teams (e.g. 10) and team size (2, 3, or 4 players).
   - Generates unique Team IDs (`TEAM-101`, `TEAM-102`...) and random 4-digit PINs.
   - Saves empty team records to Firestore in bulk.
   - Outputs printable physical check-in slips with rules and login instructions.
3. **QR Code Generator:**
   - Input your deployed GitHub Pages URL once.
   - Auto-generates high-contrast QR codes for all 6 stations with embedded security tokens:
     `https://YOUR_USERNAME.github.io/joyful-noether/scan.html?loc=dblock-gazebo&token=DG519K2`
   - Download individual high-res PNGs or click **Print All QR Sheets** to print clean sheets with location names and instructions for volunteers to tape at the gazebos.
4. **Emergency Overrides:**
   - **Force Unlock Next Station:** If a QR code is damaged by rain or a team gets stuck, organizers can unlock their next pin with 1 click.
   - **Force Sabotage / Glitch:** Allows organizers to test and preview the sabotage animations on any team live.
5. **Real-Time Puzzle Editor:**
   - Edit questions, answers, hints, and decoy questions directly in Firestore tonight without re-pushing code.

---

## 🗺️ Customizing Campus Map & Pin Coordinates

### Replacing with Your Real Campus Map Image:
If you have an aerial photo or masterplan image of PDEU campus, simply save it to:
`assets/images/campus-map.png` or `assets/images/campus-map.jpg`
and change line 31 of [`js/map-engine.js`](file:///js/map-engine.js) to reference your image file.

### Fine-Tuning Pin Positions (Admin Calibration Tool):
1. Open [`map.html`](file:///map.html) on any device.
2. In the floating controls at the bottom right, tap the **📍** button to activate **Pin Calibration Mode**.
3. Click or tap anywhere on the campus map where a gazebo or stage is located.
4. The exact coordinates `{ x: 53.0, y: 62.5 }` will be displayed on screen and automatically copied to your clipboard!
5. Paste those coordinates into `LOCATIONS` inside [`js/config.js`](file:///js/config.js).

---

## 🧮 Official Scoring Formula

$$\text{Final Score} = 1000 - (\text{Total Minutes}) - (10 \times \text{Wrong Attempts}) - (5 \times \text{Sabotages Faced}) + \text{Bonus}$$

- **2-Player Teams:** Fast Glitch Recovery Bonus ($+20\text{ pts}$ per glitch solved under 25 seconds).
- **Impostor Score:**
  - **$+300\text{ pts}$** if the Impostor escapes unaccused at the final finish vote.
  - **$+100\text{ pts}$** if caught by the crew.
- **Physical Souvenir Stamp:** The finish page provides a unique redemption code (e.g. `PDEU-CREW-A74B` or `PDEU-IMPO-8291`) matching physical stickers at the finish desk:
  - 🏆 *Caught the Impostor*
  - 😈 *Got Away With It*
  - 🛡️ *Survived the Skeld*
  - ⚡ *Debugged the Ship*
