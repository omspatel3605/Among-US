/**
 * Interactive Pan-Zoom Campus Radar Map Engine
 * Displays the high-resolution PDEU Campus Masterplan (2000x1438),
 * sleek glowing radar location markers, smooth touch/mouse gesture pan-zoom,
 * and handles progressive station unlock & Impostor Map Scramble sabotage.
 */

import { LOCATIONS } from './config.js';
import { sound } from './sound.js';
import { showToast } from './app.js';

export class CampusMapEngine {
  constructor(containerEl, options = {}) {
    this.container = containerEl;
    this.canvasWrapper = null;
    this.pinsContainer = null;

    this.naturalWidth = 2000;
    this.naturalHeight = 1438;

    this.scale = 1;
    this.minScale = 0.25;
    this.maxScale = 3.5;
    this.panX = 0;
    this.panY = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.locations = options.locations || LOCATIONS;
    this.currentLocationIndex = 1;
    this.scrambleOverride = null;
    this.calibrationMode = options.calibrationMode || false;
    this.onCoordinateClick = options.onCoordinateClick || null;

    this.init();
  }

  init() {
    this.container.classList.add("map-viewport");

    // Canvas Wrapper
    this.canvasWrapper = document.createElement("div");
    this.canvasWrapper.className = "map-canvas-wrapper";

    // Campus Map Background (New Official Masterplan: 2000x1438)
    const mapImg = document.createElement("img");
    mapImg.id = "campus-map-img";
    mapImg.className = "map-background-img";
    mapImg.src = "assets/images/Osail Gazebo.png";
    mapImg.alt = "PDEU Campus Masterplan";

    // Fallback if needed
    mapImg.onerror = () => {
      console.warn("Campus map image failed to load, falling back to encoded path.");
      mapImg.src = "assets/images/Osail%20Gazebo.png";
    };

    // Location Pins Layer
    this.pinsContainer = document.createElement("div");
    this.pinsContainer.className = "map-pins-layer";

    this.canvasWrapper.appendChild(mapImg);
    this.canvasWrapper.appendChild(this.pinsContainer);
    this.container.appendChild(this.canvasWrapper);

    // Create On-Screen Controls (+, -, Reset)
    this.renderControls();

    // Bind Pan & Zoom Events
    this.bindEvents();

    // Render Initial Pins & Fit View
    this.renderPins();
    this.resetView();

    // Re-adjust view on window resize
    window.addEventListener("resize", () => {
      this.resetView();
    });
  }

  renderControls() {
    const controls = document.createElement("div");
    controls.className = "map-floating-controls";
    controls.innerHTML = `
      <button class="map-ctrl-btn" id="btn-zoom-in" title="Zoom In">+</button>
      <button class="map-ctrl-btn" id="btn-zoom-out" title="Zoom Out">−</button>
      <button class="map-ctrl-btn" id="btn-zoom-reset" title="Recenter Map">⟲</button>
    `;

    this.container.appendChild(controls);

    controls.querySelector("#btn-zoom-in").addEventListener("click", (e) => {
      e.stopPropagation();
      this.zoom(0.25);
    });
    controls.querySelector("#btn-zoom-out").addEventListener("click", (e) => {
      e.stopPropagation();
      this.zoom(-0.25);
    });
    controls.querySelector("#btn-zoom-reset").addEventListener("click", (e) => {
      e.stopPropagation();
      this.resetView();
    });
  }

  bindEvents() {
    // Mouse Drag
    this.container.addEventListener("mousedown", (e) => {
      if (e.target.closest(".map-floating-controls") || e.target.closest(".location-radar-marker")) return;
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

    // Coordinate logging for admin calibration if enabled
    this.canvasWrapper.addEventListener("click", (e) => {
      if (!this.calibrationMode) return;
      const rect = this.canvasWrapper.getBoundingClientRect();
      const xPct = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
      const yPct = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

      const coordStr = `{ x: ${xPct}, y: ${yPct} }`;
      navigator.clipboard?.writeText(coordStr);
      showToast(`Logged coords: ${coordStr} (Copied!)`, "info");

      if (this.onCoordinateClick) {
        this.onCoordinateClick({ x: xPct, y: yPct });
      }
    });
  }

  zoom(delta) {
    const prevScale = this.scale;
    const newScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale + delta));
    if (newScale === prevScale) return;

    const containerW = this.container.clientWidth || window.innerWidth;
    const containerH = this.container.clientHeight || window.innerHeight;
    const centerX = containerW / 2;
    const centerY = containerH / 2;

    this.panX = centerX - (centerX - this.panX) * (newScale / prevScale);
    this.panY = centerY - (centerY - this.panY) * (newScale / prevScale);
    this.scale = newScale;
    this.applyTransform();
  }

  resetView() {
    const containerW = this.container.clientWidth || window.innerWidth;
    const containerH = this.container.clientHeight || window.innerHeight;

    // Auto-fit 2000x1438 image to container
    const fitScale = Math.max(0.2, Math.min(containerW / this.naturalWidth, containerH / this.naturalHeight));
    this.scale = fitScale;
    this.panX = (containerW - this.naturalWidth * this.scale) / 2;
    this.panY = (containerH - this.naturalHeight * this.scale) / 2;
    this.applyTransform();
  }

  applyTransform() {
    this.canvasWrapper.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
  }

  /**
   * Update team progression and sabotage state
   */
  updateState({ currentIndex = 1, scrambleState = null, locations = null }) {
    this.currentLocationIndex = currentIndex;
    this.scrambleOverride = scrambleState;
    if (locations) this.locations = locations;
    this.renderPins();
  }

  /**
   * Render Sleek Sci-Fi Location Radar Markers
   * NOTE: Future stations are completely HIDDEN until team solves the previous puzzle!
   */
  renderPins() {
    this.pinsContainer.innerHTML = "";

    const activeIndex = this.currentLocationIndex;
    const isScrambled = this.scrambleOverride && this.scrambleOverride.active && this.scrambleOverride.expiresAt > Date.now();
    const fakeLocationId = isScrambled ? this.scrambleOverride.fakeLocationId : null;

    this.locations.forEach((loc) => {
      let status = "locked";

      if (loc.order < activeIndex) {
        status = "completed";
      } else if (loc.order === activeIndex) {
        status = isScrambled ? "locked" : "active";
      }

      // If this pin is the fake decoy target during Map Scramble sabotage:
      if (isScrambled && loc.id === fakeLocationId) {
        status = "scrambled";
      }

      // HIDE ALL FUTURE STATIONS:
      // Players must figure out the path themselves through puzzles!
      if (loc.order > activeIndex && status !== "scrambled" && !this.calibrationMode) {
        return; // Do NOT render future pins!
      }

      const marker = document.createElement("div");
      marker.className = `location-radar-marker marker-${status}`;
      marker.style.left = `${loc.coords.x}%`;
      marker.style.top = `${loc.coords.y}%`;

      const colorGradient = status === 'completed'
        ? 'linear-gradient(135deg, #50ef39, #117f2d)'
        : status === 'scrambled'
        ? 'linear-gradient(135deg, #ef7d0e, #c51111)'
        : 'linear-gradient(135deg, #38fedc, #0284c7)';

      marker.innerHTML = `
        <div class="location-pulse-ring"></div>
        <div class="location-pulse-ring ring-delay"></div>
        <div class="location-beacon-halo"></div>
        
        <div class="location-marker-pin" style="background:${colorGradient};">
          <svg viewBox="0 0 24 24" class="marker-pin-svg">
            <path fill="#ffffff" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span class="location-order-badge">${status === 'completed' ? '✓' : loc.order}</span>
        </div>

        <div class="marker-label-card">
          <div class="marker-label-name">${status === 'scrambled' ? '⚠️ RADAR ANOMALY' : (this.calibrationMode ? loc.name : `SECTOR ${loc.order}`)}</div>
          <div class="marker-label-status">
            ${status === 'completed' ? 'CLEARED' : status === 'active' ? 'ACTIVE TARGET' : status === 'scrambled' ? 'RADAR LOCKED' : 'LOCKED'}
          </div>
        </div>
      `;

      marker.addEventListener("click", (e) => {
        e.stopPropagation();
        sound.click();
        this.onMarkerClick(loc, status);
      });

      this.pinsContainer.appendChild(marker);
    });
  }

  onMarkerClick(loc, status) {
    if (status === "active" || status === "scrambled") {
      showToast(`Active Target: Sector ${loc.order}. Follow the radar beacon and tap SCAN QR!`, "info");
    } else if (status === "completed") {
      showToast(`Sector ${loc.order} Cleared!`, "success");
    }
  }
}
