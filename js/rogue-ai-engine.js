/**
 * Rogue AI Engine (2-Player Teams)
 * Simulates ship AI malfunctions striking both players simultaneously.
 * Displays interactive emergency mini-challenges to restore screen systems.
 */

import { firebaseService } from './firebase-service.js';
import { sound } from './sound.js';
import { showToast } from './app.js';

class RogueAIEngine {
  constructor() {
    this.teamId = null;
    this.currentTeamData = null;
    this.modalEl = null;
    this.timerInterval = null;
    this.activeChallenge = null;
    this.checkInterval = null;
    this.isHandlingGlitch = false;
  }

  init(teamData, userSession) {
    this.teamId = userSession.teamId;
    this.currentTeamData = teamData;

    // Only activate for 2-player teams
    if (teamData.size !== 2) return;

    // Start background auto-trigger monitor
    this.startGlitchMonitor();
  }

  /**
   * Monitor periodically if an AI glitch should self-trigger
   * Fires 2-3 times during the run if not already triggered by admin
   */
  startGlitchMonitor() {
    if (this.checkInterval) clearInterval(this.checkInterval);

    this.checkInterval = setInterval(() => {
      this.evaluateGlitchTrigger();
    }, 15000); // Check every 15 seconds
  }

  evaluateGlitchTrigger() {
    if (!this.currentTeamData || this.currentTeamData.finishTime) return;

    const glitches = (this.currentTeamData.sabotageEvents || []).filter(e => e.type === "aiGlitch");
    const glitchCount = glitches.length;

    // Max 3 glitches per 2-player run
    if (glitchCount >= 3) return;

    const glitchState = this.currentTeamData.glitchState || {};
    if (glitchState.active) return; // Glitch already running

    const startTime = this.currentTeamData.startTime || Date.now();
    const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);
    const lastGlitch = glitches[glitches.length - 1];
    const minutesSinceLast = lastGlitch ? (Date.now() - lastGlitch.timestamp) / (1000 * 60) : elapsedMinutes;

    // Trigger condition:
    // Glitch 1: after > 2.5 minutes
    // Glitch 2: after > 7.0 minutes (or > 4 minutes since glitch 1)
    // Glitch 3: after > 12.0 minutes
    const shouldTrigger = (glitchCount === 0 && elapsedMinutes >= 2.5) ||
                          (glitchCount === 1 && minutesSinceLast >= 4.0) ||
                          (glitchCount === 2 && minutesSinceLast >= 5.0);

    if (shouldTrigger && !this.isHandlingGlitch) {
      this.triggerSystemGlitch();
    }
  }

  /**
   * Trigger an AI Glitch across the team
   */
  async triggerSystemGlitch(challengeType = null) {
    if (this.isHandlingGlitch) return;
    this.isHandlingGlitch = true;

    const types = ["sequence", "divertPower", "codeDecryption"];
    const chosenType = challengeType || types[Math.floor(Math.random() * types.length)];

    const glitchPayload = {
      active: true,
      type: chosenType,
      startedAt: Date.now(),
      targetDuration: 30
    };

    try {
      await firebaseService.updateTeam(this.teamId, { glitchState: glitchPayload });
    } catch (e) {
      console.error("Failed to set glitch state:", e);
    } finally {
      this.isHandlingGlitch = false;
    }
  }

  /**
   * Handle incoming team updates from Firestore onSnapshot
   */
  handleTeamUpdate(teamData) {
    this.currentTeamData = teamData;
    if (teamData.size !== 2) return;

    const glitchState = teamData.glitchState || {};

    if (glitchState.active) {
      this.showGlitchModal(glitchState);
    } else {
      this.dismissGlitchModal();
    }
  }

  /**
   * Display fullscreen Malfunction overlay with interactive mini-challenge
   */
  showGlitchModal(glitchState) {
    if (document.getElementById("rogue-ai-glitch-modal")) return;

    sound.glitch();

    this.modalEl = document.createElement("div");
    this.modalEl.id = "rogue-ai-glitch-modal";
    this.modalEl.className = "rogue-glitch-overlay";

    let challengeContent = "";
    const type = glitchState.type || "sequence";

    if (type === "sequence") {
      challengeContent = `
        <p class="challenge-hint">Reactor Memory Desync! Tap the colored fuel cells in sequence:</p>
        <div class="sequence-display" id="seq-target-display">
          <span class="seq-token" style="background:#ef4444">1</span>
          <span class="seq-token" style="background:#3b82f6">2</span>
          <span class="seq-token" style="background:#eab308">3</span>
          <span class="seq-token" style="background:#22c55e">4</span>
        </div>
        <div class="sequence-grid">
          <button class="seq-btn" data-val="3" style="background:#eab308">YELLOW</button>
          <button class="seq-btn" data-val="1" style="background:#ef4444">RED</button>
          <button class="seq-btn" data-val="4" style="background:#22c55e">GREEN</button>
          <button class="seq-btn" data-val="2" style="background:#3b82f6">BLUE</button>
        </div>
      `;
    } else if (type === "divertPower") {
      challengeContent = `
        <p class="challenge-hint">Auxiliary Power Overload! Set all three breakers into the green zones:</p>
        <div class="power-sliders">
          <div class="slider-group">
            <label>ENGINE BUS (Aim 80%)</label>
            <input type="range" class="power-slider" id="slider-1" min="0" max="100" value="20">
            <span class="slider-val" id="val-1">20%</span>
          </div>
          <div class="slider-group">
            <label>OXYGEN PUMP (Aim 50%)</label>
            <input type="range" class="power-slider" id="slider-2" min="0" max="100" value="85">
            <span class="slider-val" id="val-2">85%</span>
          </div>
          <div class="slider-group">
            <label>RADAR DISH (Aim 90%)</label>
            <input type="range" class="power-slider" id="slider-3" min="0" max="100" value="30">
            <span class="slider-val" id="val-3">30%</span>
          </div>
        </div>
      `;
    } else {
      challengeContent = `
        <p class="challenge-hint">System Logic Lockout! Solve security checksum:</p>
        <div class="math-challenge">
          <div class="math-expr">14 × 3 + 8 = ?</div>
          <input type="number" id="math-input" class="cyber-input" placeholder="Enter answer..." autocomplete="off">
          <button id="math-submit" class="cyber-btn">OVERRIDE LOCK</button>
        </div>
      `;
    }

    this.modalEl.innerHTML = `
      <div class="glitch-window">
        <div class="glitch-header">
          <span class="glitch-siren">⚠️</span>
          <div>
            <h2 class="glitch-title">CRITICAL SYSTEM MALFUNCTION</h2>
            <div class="glitch-sub">THE SHIP'S AI IS UNSTABLE — WORK TOGETHER TO RESTORE</div>
          </div>
          <span class="glitch-siren">⚠️</span>
        </div>
        
        <div class="glitch-timer-bar">
          <div class="glitch-progress" id="glitch-timer-progress"></div>
        </div>
        <div class="glitch-timer-text" id="glitch-timer-label">Stabilization Window: 30s</div>

        <div class="glitch-body">
          ${challengeContent}
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Setup challenge logic & countdown
    this.bindChallengeLogic(type, glitchState.startedAt || Date.now());
  }

  bindChallengeLogic(type, startedAt) {
    const timerProgress = this.modalEl.querySelector("#glitch-timer-progress");
    const timerLabel = this.modalEl.querySelector("#glitch-timer-label");
    const totalSeconds = 30;

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      const pct = (remaining / totalSeconds) * 100;

      if (timerProgress) timerProgress.style.width = `${pct}%`;
      if (timerLabel) timerLabel.textContent = `Stabilization Window: ${remaining}s`;

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        // Time expired, auto-resolve with timeout penalty
        this.resolveGlitch(startedAt, false);
      }
    }, 500);

    // Bind specific challenge interactive events
    if (type === "sequence") {
      let expected = 1;
      const buttons = this.modalEl.querySelectorAll(".seq-btn");
      buttons.forEach(btn => {
        btn.addEventListener("click", () => {
          sound.click();
          const val = parseInt(btn.dataset.val, 10);
          if (val === expected) {
            btn.classList.add("btn-pressed-ok");
            expected++;
            if (expected > 4) {
              sound.success();
              this.resolveGlitch(startedAt, true);
            }
          } else {
            sound.error();
            // Reset
            expected = 1;
            buttons.forEach(b => b.classList.remove("btn-pressed-ok"));
            showToast("Sequence broken! Resetting...", "error");
          }
        });
      });
    } else if (type === "divertPower") {
      const s1 = this.modalEl.querySelector("#slider-1");
      const s2 = this.modalEl.querySelector("#slider-2");
      const s3 = this.modalEl.querySelector("#slider-3");
      const v1 = this.modalEl.querySelector("#val-1");
      const v2 = this.modalEl.querySelector("#val-2");
      const v3 = this.modalEl.querySelector("#val-3");

      const checkSliders = () => {
        v1.textContent = s1.value + "%";
        v2.textContent = s2.value + "%";
        v3.textContent = s3.value + "%";

        const ok1 = Math.abs(parseInt(s1.value) - 80) <= 6;
        const ok2 = Math.abs(parseInt(s2.value) - 50) <= 6;
        const ok3 = Math.abs(parseInt(s3.value) - 90) <= 6;

        s1.style.accentColor = ok1 ? "#22c55e" : "#ef4444";
        s2.style.accentColor = ok2 ? "#22c55e" : "#ef4444";
        s3.style.accentColor = ok3 ? "#22c55e" : "#ef4444";

        if (ok1 && ok2 && ok3) {
          sound.success();
          this.resolveGlitch(startedAt, true);
        }
      };

      [s1, s2, s3].forEach(sl => sl.addEventListener("input", checkSliders));
    } else if (type === "codeDecryption") {
      const input = this.modalEl.querySelector("#math-input");
      const submitBtn = this.modalEl.querySelector("#math-submit");

      const checkMath = () => {
        if (input.value.trim() === "50") {
          sound.success();
          this.resolveGlitch(startedAt, true);
        } else {
          sound.error();
          input.classList.add("input-shake");
          setTimeout(() => input.classList.remove("input-shake"), 400);
          showToast("Invalid security checksum!", "error");
        }
      };

      submitBtn.addEventListener("click", checkMath);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkMath();
      });
    }
  }

  /**
   * Complete recovery and log metrics to Firestore
   */
  async resolveGlitch(startedAt, isSuccess) {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const recoveryTimeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    const events = [...(this.currentTeamData?.sabotageEvents || [])];
    events.push({
      type: "aiGlitch",
      triggeredBy: "system",
      timestamp: Date.now(),
      recoveryTimeSeconds: recoveryTimeSeconds,
      success: isSuccess
    });

    try {
      await firebaseService.updateTeam(this.teamId, {
        glitchState: { active: false },
        sabotageEvents: events
      });
      await firebaseService.logSabotage(this.teamId, {
        type: "aiGlitch",
        triggeredBy: "system",
        recoveryTimeSeconds
      });
      showToast(`⚡ Systems Restored in ${recoveryTimeSeconds}s!`, "success");
    } catch (e) {
      console.error("Error resolving glitch:", e);
    }

    this.dismissGlitchModal();
  }

  dismissGlitchModal() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const existing = document.getElementById("rogue-ai-glitch-modal");
    if (existing) {
      existing.classList.add("glitch-fadeout");
      setTimeout(() => existing.remove(), 400);
    }
  }
}

export const rogueAIEngine = new RogueAIEngine();
