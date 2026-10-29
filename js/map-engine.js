/**
 * Interactive Pan-Zoom Among Us Campus Map Engine
 * Supports smooth gesture/mouse pan-zoom, dynamic bean pins,
 * walking path rendering, admin calibration mode, and Map Scramble sabotage override.
 */

import { LOCATIONS } from './config.js';
import { sound } from './sound.js';
import { showToast } from './app.js';

export class CampusMapEngine {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.canvasWrapper = null;
    this.pinsContainer = null;
    this.pathSvg = null;

    this.scale = 1;
    this.minScale = 0.6;
    this.maxScale = 3.5;
    this.panX = 0;
    this.panY = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.initialPinchDistance = null;

    this.locations = options.locations || LOCATIONS;
    this.currentLocationIndex = 1;
    this.scrambleOverride = null;
    this.calibrationMode = options.calibrationMode || false;
    this.onCoordinateClick = options.onCoordinateClick || null;

    this.init();
  }

  init() {
    this.container.classList.add("map-viewport");

    // Structure
    this.canvasWrapper = document.createElement("div");
    this.canvasWrapper.className = "map-canvas-wrapper";

    // Campus Map Background (SVG or Image)
    const mapImg = document.createElement("img");
    mapImg.id = "campus-map-img";
    mapImg.className = "map-background-img";
    mapImg.src = "assets/images/campus-map.svg";
    mapImg.alt = "PDEU Campus Masterplan";

    // Fallback error handler: if SVG or PNG fails, keep stylized grid
    mapImg.onerror = () => {
      console.warn("Campus map image not found, using vector fallback background.");
    };

    // SVG Walking Path Overlay
    this.pathSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.pathSvg.setAttribute("class", "map-paths-svg");
    this.pathSvg.setAttribute("viewBox", "0 0 100 100");
    this.pathSvg.setAttribute("preserveAspectRatio", "none");

    // Pins Container
    this.pinsContainer = document.createElement("div");
    this.pinsContainer.className = "map-pins-layer";

    this.canvasWrapper.appendChild(mapImg);
    this.canvasWrapper.appendChild(this.pathSvg);
    this.canvasWrapper.appendChild(this.pinsContainer);
    this.container.appendChild(this.canvasWrapper);

    // Create On-Screen Controls (+, -, Reset, Calibration Toggle)
    this.renderControls();

    // Bind Pan & Zoom Events
    this.bindEvents();

    // Render Initial State
    this.renderPins();
    this.drawWalkingPath();
  }

  renderControls() {
    const controls = document.createElement("div");
    controls.className = "map-floating-controls";
    controls.innerHTML = `
      <button class="map-ctrl-btn" id="btn-zoom-in" title="Zoom In">+</button>
      <button class="map-ctrl-btn" id="btn-zoom-out" title="Zoom Out">−</button>
      <button class="map-ctrl-btn" id="btn-zoom-reset" title="Reset View">⟲</button>
      <button class="map-ctrl-btn ${this.calibrationMode ? 'active' : ''}" id="btn-calibrate-toggle" title="Admin Pin Calibrate">📍</button>
    `;

    this.container.appendChild(controls);

    controls.querySelector("#btn-zoom-in").addEventListener("click", () => this.zoom(0.25));
    controls.querySelector("#btn-zoom-out").addEventListener("click", () => this.zoom(-0.25));
    controls.querySelector("#btn-zoom-reset").addEventListener("click", () => this.resetView());
    controls.querySelector("#btn-calibrate-toggle").addEventListener("click", (e) => {
      this.calibrationMode = !this.calibrationMode;
      e.target.classList.toggle("active", this.calibrationMode);
      showToast(this.calibrationMode ? "📍 Calibration Mode ON: Click anywhere on map to log coordinates!" : "Calibration Mode OFF", "info");
    });
  }

  bindEvents() {
    // Mouse Drag
    this.container.addEventListener("mousedown", (e) => {
      if (e.target.closest(".map-floating-controls")) return;
      this.isDragging = true;
      this.startX = e.clientX - this.panX;
      this.startY = e.clientY - this.panY;
      this.container.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.startX;
      this.panY = e.clientY - this.startY;
      this.applyTransform();
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
      this.container.style.cursor = "grab";
    });

    // Mouse Wheel Zoom
    this.container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
      this.zoom(zoomFactor);
    }, { passive: false });

    // Touch Gestures (Mobile Pan & Pinch Zoom)
    let touchStartDist = 0;
    this.container.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.startX = e.touches[0].clientX - this.panX;
        this.startY = e.touches[0].clientY - this.panY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    }, { passive: true });

    this.container.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        this.panX = e.touches[0].clientX - this.startX;
        this.panY = e.touches[0].clientY - this.startY;
        this.applyTransform();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (dist - touchStartDist) * 0.005;
        this.zoom(factor);
        touchStartDist = dist;
      }
    }, { passive: true });

    this.container.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Map Click (for Admin Pin Calibration)
    this.canvasWrapper.addEventListener("click", (e) => {
      if (!this.calibrationMode) return;
      const rect = this.canvasWrapper.getBoundingClientRect();
      const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
      const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

      console.log(`📍 Calibrated Pin Position: coords: { x: ${xPct}, y: ${yPct} }`);
      const coordStr = `{ x: ${xPct}, y: ${yPct} }`;
      navigator.clipboard?.writeText(coordStr);
      showToast(`Logged coords: ${coordStr} (Copied to clipboard!)`, "info");

      if (this.onCoordinateClick) {
        this.onCoordinateClick({ x: xPct, y: yPct });
      }
    });
  }

  zoom(delta) {
    const prev = this.scale;
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, this.scale + delta));
    this.applyTransform();
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  applyTransform() {
    this.canvasWrapper.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
  }

  /**
   * Update team's current progression and live sabotage scramble state
   */
  updateState({ currentIndex = 1, scrambleState = null, locations = null }) {
    this.currentLocationIndex = currentIndex;
    this.scrambleOverride = scrambleState;
    if (locations) this.locations = locations;
    this.renderPins();
    this.drawWalkingPath();
  }

  /**
   * Render Among Us style bean pins with live radar states
   */
  renderPins() {
    this.pinsContainer.innerHTML = "";

    const activeIndex = this.currentLocationIndex;
    const isScrambled = this.scrambleOverride && this.scrambleOverride.active && this.scrambleOverride.expiresAt > Date.now();
    const fakeLocationId = isScrambled ? this.scrambleOverride.fakeLocationId : null;

    this.locations.forEach((loc) => {
      const pin = document.createElement("div");
      pin.className = "amongus-pin";
      pin.style.left = `${loc.coords.x}%`;
      pin.style.top = `${loc.coords.y}%`;

      let status = "locked"; // 'completed', 'active', 'locked', 'scrambled'

      if (loc.order < activeIndex) {
        status = "completed";
      } else if (loc.order === activeIndex) {
        status = isScrambled ? "locked" : "active"; // Real pin is dimmed during scramble!
      }

      // If this pin is the fake decoy target during Map Scramble sabotage:
      if (isScrambled && loc.id === fakeLocationId) {
        status = "scrambled"; // Deceptively highlighted!
      }

      pin.classList.add(`pin-${status}`);

      // Among Us Bean SVG Marker
      pin.innerHTML = `
        <div class="pin-beacon"></div>
        <div class="pin-marker">
          <svg viewBox="0 0 40 50" class="bean-svg">
            <!-- Backpack -->
            <rect x="2" y="16" width="7" height="20" rx="3" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
            <!-- Body -->
            <path d="M 12 10 C 12 4, 34 4, 34 10 L 34 38 C 34 44, 30 46, 26 46 L 24 46 C 21 46, 21 42, 21 38 L 21 38 C 21 42, 19 46, 16 46 L 14 46 C 10 46, 12 40, 12 36 Z" 
                  class="bean-body" stroke="#ffffff" stroke-width="2.5" />
            <!-- Visor -->
            <ellipse cx="26" cy="18" rx="8" ry="5.5" class="bean-visor" stroke="#ffffff" stroke-width="2"/>
            <ellipse cx="28" cy="16" rx="4" ry="2" fill="#ffffff" opacity="0.6"/>
          </svg>
          <span class="pin-order-badge">${status === 'completed' ? '✓' : loc.order}</span>
        </div>
        <div class="pin-card">
          <div class="pin-name">${status === 'scrambled' ? '⚠️ ' + loc.name + ' (DECIPHERED)' : loc.name}</div>
          <div class="pin-status-text">
            ${status === 'completed' ? 'CLEARED' : status === 'active' ? 'TARGET NEXT' : status === 'scrambled' ? 'RADAR LOCKED' : 'LOCKED'}
          </div>
        </div>
      `;

      pin.addEventListener("click", () => {
        sound.click();
        this.onPinClick(loc, status);
      });

      this.pinsContainer.appendChild(pin);
    });
  }

  onPinClick(loc, status) {
    if (status === "active" || status === "scrambled") {
      showToast(`Current Objective: ${loc.name}. Visit in person and scan the QR code!`, "info");
    } else if (status === "completed") {
      showToast(`Already cleared: ${loc.name}`, "success");
    } else {
      showToast(`Station locked: Visit locations in sequential order!`, "error");
    }
  }

  /**
   * Draw dashed Among Us walking path between sequential locations
   */
  drawWalkingPath() {
    this.pathSvg.innerHTML = "";

    const sorted = [...this.locations].sort((a, b) => a.order - b.order);

    for (let i = 0; i < sorted.length - 1; i++) {
      const from = sorted[i];
      const to = sorted[i + 1];

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", `${from.coords.x}%`);
      line.setAttribute("y1", `${from.coords.y}%`);
      line.setAttribute("x2", `${to.coords.x}%`);
      line.setAttribute("y2", `${to.coords.y}%`);

      const isDone = to.order <= this.currentLocationIndex;
      line.setAttribute("class", isDone ? "path-line path-cleared" : "path-line path-pending");

      this.pathSvg.appendChild(line);
    }
  }
}
