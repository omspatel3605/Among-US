# 🚀 PDEU Campus Treasure Hunt: "Among Us" Mobile Edition

An authentic, mobile-first **"Among Us"-themed campus treasure hunt** designed for **Pandit Deendayal Energy University (PDEU)**.
Built with pure vanilla HTML5, CSS3, and modern JavaScript (ES Modules) — zero frameworks, zero build step, hosted directly on **GitHub Pages**, backed by **Google Firebase Firestore** (free tier) with instant real-time synchronization across all players' smartphones.

---

## 📱 Designed for Walk-Up "Come and Play" on Smartphones

- **NO Player PINs or Pre-Registration Hassle:** Players simply open the website on their phones, tap **"CREATE CREW"** or **"JOIN CREW"**, and enter a 6-letter room code (e.g. `SKELDX`).
- **Mobile-First UI & Haptics:** Thumb-friendly 54px touch targets, chunky Among Us buttons with tactile vibration feedback (`vibrate`), Google Fonts (`Bungee`, `Space Grotesk`, `Share Tech Mono`), and zero horizontal overflow.
- **Outdoor Daylight Mode:** Instant high-contrast toggle (`☀️`) so players can easily read clues and maps under bright afternoon sun on the PDEU campus.

---

## 🎮 Game Concept & Roles

Teams physically visit 6 campus checkpoints in sequence, scanning physical QR codes to reveal location puzzles.

### 👥 For Teams of 3–4 Players (Human Impostor)
- When the host taps **"START EXPEDITION"**, the system secretly designates one player as the **IMPOSTOR**.
- **The Impostor does NOT act in real life.** All sabotage happens **wirelessly through the website itself**, live, directly onto teammates' screens in real time:
  1. 🧩 **Puzzle Swap (90s):** Teammates silently receive an unsolvable decoy question. Answers to the decoy are auto-rejected.
  2. 🗺️ **Map Scramble (120s):** Misdirects the team radar to highlight a deceptive wrong pin as the next target and dims the real one.
  3. ❌ **Fake Reject:** Traps the next submission — when teammates enter the correct answer, the system falsely reports it as "INCORRECT" once, consuming the charge and wasting an attempt.
- **Finish Accusation Vote:** After station 6, crewmates cast an emergency private accusation vote on their phones. Reveals if the crew caught the saboteur or if the Impostor got away!

### 🤖 For Teams of 2 Players (Rogue AI Anomaly)
- For duos, there is no human saboteur. Instead, the ship's navigation computer itself suffers a **ROGUE AI MALFUNCTION**.
- 2–3 times during their run, an emergency red malfunction overlay strikes both players' phones simultaneously.
- Both players must cooperate to solve an Among Us-style recovery mini-challenge (Sequence Memory, Power Bus Balancing, or Logic Decryption) within 30 seconds to restore radar guidance.
- Awarded the **"Debugged the Ship ⚡"** passport badge!

---

## 📍 6 Sequential PDEU Locations (`LOCATIONS`)

Defined in [`js/config.js`](file:///js/config.js) in fixed order:
1. **OSAIL Gazebo** (`osail-gazebo`) — Student Activity Centre lawn.
2. **D Block Gazebo** (`dblock-gazebo`) — Engineering corridor pavilion.
3. **C Block Gazebo** (`cblock-gazebo`) — Petroleum & Science courtyard.
4. **A Block Seating** (`ablock-seating`) — Curved amphitheater concrete benches outside A Block.
5. **Ness 1 Float** (`ness1-float`) — Architectural canopy float near high-rise residences.
6. **Gemini Stage** (`gemini-stage`) — Final amphitheater stage & mission conclusion.

Attempting to scan stations out of order displays an `ACCESS DENIED: Sequence Violation` error.

---

## 🔐 Organizer Command Center (`admin.html`)

Access the organizer dashboard at `https://YOUR_USERNAME.github.io/joyful-noether/admin.html`.

- **Admin ID:** `admin`
- **Password:** `pdeu@amongus2026`
- *(Or quick passcode `pdeu2026`)*

### Organizer Controls:
1. **Live Table:** Real-time stream of all room codes, connected players, secret roles, active checkpoint, elapsed time, errors, and live scores.
2. **QR Code Generator:** Input your deployed GitHub Pages URL once to render high-contrast QR codes for all 6 stations with embedded security tokens (`scan.html?loc=dblock-gazebo&token=DG519K2`). Includes 1-click **Download PNG** and a **Print Sheets** layout to tape at the gazebos.
3. **Emergency Overrides:** One-click manual unlock for any stuck team, and manual sabotage/glitch test triggers.
4. **Station Puzzles Editor:** Edit questions, answers, and decoy questions directly in Firestore without redeploying code.

---

## ⚙️ Setup & Deployment

### 1. Firebase Firestore Setup (Free Tier)
1. In the [Firebase Console](https://console.firebase.google.com/), create a project (e.g. `pdeu-amongus-hunt`).
2. Go to **Build > Firestore Database > Create Database** in **Production mode**.
3. Under the **Rules** tab, paste the contents of [`firestore.rules`](file:///firestore.rules) and click **Publish**.
4. In Project Settings (gear icon), register a Web App (`</>`) and copy your `firebaseConfig`.
5. Open [`js/config.js`](file:///js/config.js) and paste your credentials into `FIREBASE_CONFIG`.

> [!NOTE]
> **Immediate Offline Demo Mode:** If default placeholder credentials remain, the site automatically activates an internal multi-tab Mock DB (`SKELD1` for 4p Impostor/Crewmate, `ROGUE2` for 2p Rogue AI) so you can test immediately in separate browser windows without internet!

### 2. GitHub Pages Deployment (Free 1-Click Hosting)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Optimize for mobile, walk-up room codes, and Among Us UI"
   git push origin main
   ```
2. In GitHub repository **Settings > Pages**, choose **Deploy from a branch**, select `main` (or `master`), and click **Save**.
3. Your site is live at: `https://YOUR_USERNAME.github.io/joyful-noether/`

---

## 🧮 Official Scoring Formula

$$\text{Final Score} = 1000 - (\text{Total Minutes}) - (10 \times \text{Wrong Attempts}) - (5 \times \text{Sabotages Faced}) + \text{Bonus}$$

- **Fast Glitch Recovery Bonus (2-Player):** $+20\text{ pts}$ per glitch solved under 25 seconds.
- **Impostor Score (3-4 Player):** $+300\text{ pts}$ if the Impostor escapes unaccused; $+100\text{ pts}$ if caught.
- **Physical Souvenir Stamp Code:** The finish page outputs a unique passport code (e.g. `PDEU-CREW-A74B` or `PDEU-IMPO-8291`) matching physical stickers at the finish desk (*Caught the Impostor*, *Got Away With It*, *Survived*, *Debugged the Ship*).
