/**
 * Shared Application Utilities, Session Management & Mobile Haptics
 */

import { sound } from './sound.js';

// LocalStorage Keys
const SESSION_KEY = "pdeu_player_session";
const DAYLIGHT_KEY = "pdeu_daylight_mode";

export const session = {
  get() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  set(userData) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
  },

  clear() {
    localStorage.removeItem(SESSION_KEY);
  },

  requireAuth(redirectUrl = "index.html") {
    const user = this.get();
    if (!user || !user.teamId || !user.playerId) {
      const current = encodeURIComponent(window.location.href);
      window.location.href = `${redirectUrl}?returnUrl=${current}`;
      return null;
    }
    return user;
  }
};

// Mobile Haptics (Vibration API)
export function vibrate(pattern = [50]) {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
}

// Format milliseconds or seconds to mm:ss or hh:mm:ss
export function formatDuration(ms) {
  if (isNaN(ms) || ms <= 0) return "00:00";
  const totalSecs = Math.floor(ms / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Generate friendly random Player ID
export function generatePlayerId(teamId) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `P-${teamId}-${rand}`;
}

// Daylight / High Contrast Outdoor Mode (Essential for bright midday sun on campus)
export const displayMode = {
  isDaylight() {
    return localStorage.getItem(DAYLIGHT_KEY) === "true";
  },
  toggle() {
    const isDay = !this.isDaylight();
    localStorage.setItem(DAYLIGHT_KEY, String(isDay));
    this.apply();
    return isDay;
  },
  apply() {
    if (typeof document === 'undefined') return;
    if (this.isDaylight()) {
      document.documentElement.classList.add("daylight-mode");
    } else {
      document.documentElement.classList.remove("daylight-mode");
    }
  }
};

// UI Notification Toast (Mobile Thumb-friendly, Bottom-Centered)
export function showToast(message, type = "info", duration = 3200) {
  if (typeof document === 'undefined') return;

  let toastEl = document.getElementById("pdeu-toast");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.id = "pdeu-toast";
    toastEl.className = "toast-container";
    document.body.appendChild(toastEl);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : '📢'}</span>
    <span class="toast-text">${message}</span>
  `;

  toastEl.appendChild(toast);

  if (type === "error") {
    sound.error();
    vibrate([100, 50, 100]);
  } else if (type === "success") {
    sound.success();
    vibrate([40, 20, 60]);
  } else {
    sound.click();
    vibrate([30]);
  }

  setTimeout(() => {
    toast.classList.add("toast-fadeout");
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// Among Us Emergency / Sabotage Alarm Banner Modal
export function showAlarmBanner(title, message, isSabotage = true) {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById("pdeu-alarm-banner");
  if (existing) existing.remove();

  const banner = document.createElement("div");
  banner.id = "pdeu-alarm-banner";
  banner.className = `alarm-banner ${isSabotage ? 'alarm-sabotage' : 'alarm-meeting'}`;
  banner.innerHTML = `
    <div class="alarm-content">
      <div class="alarm-header">
        <span class="alarm-siren">🚨</span>
        <h2 class="alarm-title">${title}</h2>
        <span class="alarm-siren">🚨</span>
      </div>
      <p class="alarm-desc">${message}</p>
    </div>
  `;

  document.body.appendChild(banner);
  sound.sabotageAlarm();
  vibrate([150, 75, 150, 75, 300]);

  setTimeout(() => {
    banner.classList.add("alarm-dismiss");
    setTimeout(() => banner.remove(), 450);
  }, 4200);
}

// Initial script execution
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    displayMode.apply();
  });
}
