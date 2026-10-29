/**
 * Impostor Sabotage Engine (3-4 Player Teams)
 * Manages Impostor's private ability dock, countdowns,
 * and handles live synchronization across teammates' open devices.
 */

import { firebaseService } from './firebase-service.js';
import { SABOTAGE_CONFIG, LOCATIONS } from './config.js';
import { showToast, showAlarmBanner } from './app.js';
import { sound } from './sound.js';

class SabotageEngine {
  constructor() {
    this.teamId = null;
    this.playerId = null;
    this.isImpostor = false;
    this.currentTeamData = null;
    this.panelContainer = null;
    this.activeSabotageNotificationShown = new Set();
  }

  init(teamData, userSession) {
    this.teamId = userSession.teamId;
    this.playerId = userSession.playerId;
    this.isImpostor = userSession.role === "impostor";
    this.currentTeamData = teamData;

    if (this.isImpostor) {
      this.renderImpostorDock();
    }
  }

  /**
   * Render the Impostor's private sabotage dock (Floating Among Us Action Bar)
   */
  renderImpostorDock() {
    if (!this.isImpostor) return;

    let dock = document.getElementById("impostor-sabotage-dock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "impostor-sabotage-dock";
      dock.className = "impostor-dock";
      document.body.appendChild(dock);
    }

    const state = this.currentTeamData?.sabotageState || {};
    const used = this.currentTeamData?.sabotageUsed || {};

    const now = Date.now();
    const puzzleSwapActive = state.puzzleSwap?.active && state.puzzleSwap.expiresAt > now;
    const mapScrambleActive = state.mapScramble?.active && state.mapScramble.expiresAt > now;
    const fakeRejectActive = state.fakeReject?.active;

    const puzzleSwapUsed = used.puzzleSwap || (state.puzzleSwap && !puzzleSwapActive && state.puzzleSwap.expiresAt > 0);
    const mapScrambleUsed = used.mapScramble || (state.mapScramble && !mapScrambleActive && state.mapScramble.expiresAt > 0);
    const fakeRejectUsed = used.fakeReject;

    dock.innerHTML = `
      <div class="dock-header">
        <div class="dock-badge">
          <span class="impostor-icon">😈</span>
          <span>IMPOSTOR SABOTAGE PANEL</span>
        </div>
        <button id="dock-toggle-btn" class="dock-collapse-btn" title="Toggle Dock">▼</button>
      </div>

      <div id="dock-body" class="dock-actions">
        <!-- Ability 1: Puzzle Swap -->
        <div class="sabotage-card ${puzzleSwapUsed ? 'is-used' : puzzleSwapActive ? 'is-active' : ''}">
          <div class="sabotage-info">
            <span class="sabotage-ico">${SABOTAGE_CONFIG.puzzleSwap.icon}</span>
            <div>
              <div class="sabotage-name">${SABOTAGE_CONFIG.puzzleSwap.name}</div>
              <div class="sabotage-desc">${SABOTAGE_CONFIG.puzzleSwap.summary}</div>
            </div>
          </div>
          <button 
            class="btn-sabotage btn-swap" 
            id="btn-trigger-swap"
            ${puzzleSwapUsed || puzzleSwapActive ? 'disabled' : ''}>
            ${puzzleSwapActive ? `ACTIVE (${Math.ceil((state.puzzleSwap.expiresAt - now) / 1000)}s)` : puzzleSwapUsed ? 'USED' : 'TRIGGER (90s)'}
          </button>
        </div>

        <!-- Ability 2: Map Scramble -->
        <div class="sabotage-card ${mapScrambleUsed ? 'is-used' : mapScrambleActive ? 'is-active' : ''}">
          <div class="sabotage-info">
            <span class="sabotage-ico">${SABOTAGE_CONFIG.mapScramble.icon}</span>
            <div>
              <div class="sabotage-name">${SABOTAGE_CONFIG.mapScramble.name}</div>
              <div class="sabotage-desc">${SABOTAGE_CONFIG.mapScramble.summary}</div>
            </div>
          </div>
          <button 
            class="btn-sabotage btn-scramble" 
            id="btn-trigger-scramble"
            ${mapScrambleUsed || mapScrambleActive ? 'disabled' : ''}>
            ${mapScrambleActive ? `ACTIVE (${Math.ceil((state.mapScramble.expiresAt - now) / 1000)}s)` : mapScrambleUsed ? 'USED' : 'TRIGGER (120s)'}
          </button>
        </div>

        <!-- Ability 3: Fake Reject -->
        <div class="sabotage-card ${fakeRejectUsed ? 'is-used' : fakeRejectActive ? 'is-active' : ''}">
          <div class="sabotage-info">
            <span class="sabotage-ico">${SABOTAGE_CONFIG.fakeReject.icon}</span>
            <div>
              <div class="sabotage-name">${SABOTAGE_CONFIG.fakeReject.name}</div>
              <div class="sabotage-desc">${SABOTAGE_CONFIG.fakeReject.summary}</div>
            </div>
          </div>
          <button 
            class="btn-sabotage btn-reject" 
            id="btn-trigger-reject"
            ${fakeRejectUsed || fakeRejectActive ? 'disabled' : ''}>
            ${fakeRejectActive ? 'ARMED & READY' : fakeRejectUsed ? 'USED' : 'ARM TRAP'}
          </button>
        </div>
      </div>
    `;

    // Bind event listeners
    const toggleBtn = dock.querySelector("#dock-toggle-btn");
    const dockBody = dock.querySelector("#dock-body");
    toggleBtn.addEventListener("click", () => {
      dockBody.classList.toggle("collapsed");
      toggleBtn.textContent = dockBody.classList.contains("collapsed") ? "▲" : "▼";
    });

    const swapBtn = dock.querySelector("#btn-trigger-swap");
    if (swapBtn && !swapBtn.disabled) {
      swapBtn.addEventListener("click", () => this.triggerPuzzleSwap());
    }

    const scrambleBtn = dock.querySelector("#btn-trigger-scramble");
    if (scrambleBtn && !scrambleBtn.disabled) {
      scrambleBtn.addEventListener("click", () => this.triggerMapScramble());
    }

    const rejectBtn = dock.querySelector("#btn-trigger-reject");
    if (rejectBtn && !rejectBtn.disabled) {
      rejectBtn.addEventListener("click", () => this.triggerFakeReject());
    }
  }

  /**
   * Action 1: Trigger Puzzle Swap (90s)
   */
  async triggerPuzzleSwap() {
    if (!confirm("Are you sure you want to trigger Puzzle Swap? Teammates will see a decoy puzzle for 90 seconds.")) return;

    const expiresAt = Date.now() + (SABOTAGE_CONFIG.puzzleSwap.durationSeconds * 1000);
    const updates = {
      "sabotageState.puzzleSwap": {
        active: true,
        expiresAt: expiresAt,
        triggeredBy: this.playerId,
        startedAt: Date.now()
      },
      "sabotageUsed.puzzleSwap": true
    };

    try {
      await firebaseService.updateTeam(this.teamId, updates);
      await firebaseService.logSabotage(this.teamId, {
        type: "puzzleSwap",
        triggeredBy: "player",
        playerId: this.playerId,
        durationSeconds: SABOTAGE_CONFIG.puzzleSwap.durationSeconds
      });
      showToast("🧩 Puzzle Swap activated! Teammates now see the decoy puzzle.", "success");
      sound.sabotageAlarm();
    } catch (err) {
      showToast("Failed to activate sabotage: " + err.message, "error");
    }
  }

  /**
   * Action 2: Trigger Map Scramble (120s)
   */
  async triggerMapScramble() {
    if (!confirm("Are you sure you want to trigger Map Scramble? The team's radar will point to a misleading pin for 2 minutes.")) return;

    // Pick a wrong location that is NOT the current active one
    const currentLocIndex = this.currentTeamData?.currentLocationIndex || 1;
    const wrongOptions = LOCATIONS.filter(loc => loc.order !== currentLocIndex);
    const fakeLoc = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];

    const expiresAt = Date.now() + (SABOTAGE_CONFIG.mapScramble.durationSeconds * 1000);
    const updates = {
      "sabotageState.mapScramble": {
        active: true,
        fakeLocationId: fakeLoc.id,
        fakeLocationName: fakeLoc.name,
        expiresAt: expiresAt,
        triggeredBy: this.playerId,
        startedAt: Date.now()
      },
      "sabotageUsed.mapScramble": true
    };

    try {
      await firebaseService.updateTeam(this.teamId, updates);
      await firebaseService.logSabotage(this.teamId, {
        type: "mapScramble",
        triggeredBy: "player",
        playerId: this.playerId,
        fakeLocationId: fakeLoc.id,
        durationSeconds: SABOTAGE_CONFIG.mapScramble.durationSeconds
      });
      showToast("🗺️ Map Scramble activated! Teammates are being misdirected.", "success");
      sound.sabotageAlarm();
    } catch (err) {
      showToast("Failed to activate sabotage: " + err.message, "error");
    }
  }

  /**
   * Action 3: Trigger Fake Reject (1 use)
   */
  async triggerFakeReject() {
    if (!confirm("Arm Fake Reject trap? The next correct answer teammates submit will be falsely marked INCORRECT once.")) return;

    const updates = {
      "sabotageState.fakeReject": {
        active: true,
        triggeredBy: this.playerId,
        armedAt: Date.now()
      },
      "sabotageUsed.fakeReject": true
    };

    try {
      await firebaseService.updateTeam(this.teamId, updates);
      await firebaseService.logSabotage(this.teamId, {
        type: "fakeReject",
        triggeredBy: "player",
        playerId: this.playerId
      });
      showToast("❌ Fake Reject trap armed! Next correct answer will be falsely rejected.", "success");
      sound.sabotageAlarm();
    } catch (err) {
      showToast("Failed to arm trap: " + err.message, "error");
    }
  }

  /**
   * Handle updates received from Firestore live onSnapshot
   */
  handleTeamUpdate(teamData) {
    this.currentTeamData = teamData;
    const now = Date.now();
    const state = teamData.sabotageState || {};

    // Auto-revert expired sabotages on client
    if (state.puzzleSwap?.active && state.puzzleSwap.expiresAt <= now) {
      if (this.isImpostor) {
        firebaseService.updateTeam(this.teamId, { "sabotageState.puzzleSwap.active": false });
      }
    }

    if (state.mapScramble?.active && state.mapScramble.expiresAt <= now) {
      if (this.isImpostor) {
        firebaseService.updateTeam(this.teamId, { "sabotageState.mapScramble.active": false });
      }
    }

    // Refresh Impostor dock if rendered
    if (this.isImpostor) {
      this.renderImpostorDock();
    }

    // Visual glitch effect for teammates if sabotage active
    const isAnyActive = (state.puzzleSwap?.active && state.puzzleSwap.expiresAt > now) ||
                        (state.mapScramble?.active && state.mapScramble.expiresAt > now);

    if (isAnyActive) {
      document.body.classList.add("system-interference");
    } else {
      document.body.classList.remove("system-interference");
    }
  }
}

export const sabotageEngine = new SabotageEngine();
