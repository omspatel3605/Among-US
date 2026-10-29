/**
 * Firebase Firestore Service with Multi-tab Demo Fallback
 * Connects to live Firestore when credentials are set,
 * or gracefully runs in local demo mode so testing works immediately.
 */

import { FIREBASE_CONFIG, isDemoConfig, LOCATIONS } from './config.js';

class FirebaseService {
  constructor() {
    this.db = null;
    this.isLiveFirebase = false;
    this.initPromise = this.init();
    this.listeners = new Map(); // For mock DB listeners
  }

  async init() {
    if (typeof window === 'undefined') return;

    if (!isDemoConfig() && window.firebase && window.firebase.firestore) {
      try {
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.db = window.firebase.firestore();
        this.isLiveFirebase = true;
        console.log("🔥 Connected to Firebase Firestore Live Backend!");
        return;
      } catch (err) {
        console.warn("⚠️ Firebase live init failed, switching to Local Demo DB:", err);
      }
    } else {
      console.log("ℹ️ Running in Local Demo DB mode (Add credentials in js/config.js for live multi-device sync)");
    }

    this.isLiveFirebase = false;
    this.initMockDB();
  }

  // Ensure DB is initialized before operations
  async ready() {
    await this.initPromise;
  }

  // --- MOCK DATABASE (Multi-tab localStorage sync fallback) ---
  initMockDB() {
    // Populate default locations in mock storage if missing
    if (!localStorage.getItem("pdeu_mock_locations")) {
      const locMap = {};
      LOCATIONS.forEach(loc => {
        locMap[loc.id] = { ...loc };
      });
      localStorage.setItem("pdeu_mock_locations", JSON.stringify(locMap));
    }

    // Populate pre-configured demo teams if none exist
    if (!localStorage.getItem("pdeu_mock_teams")) {
      const demoTeams = {
        "TEAM-101": {
          id: "TEAM-101",
          pin: "1234",
          size: 4,
          players: [
            { playerId: "P-101-1", name: "Red", role: "crewmate", joinedAt: Date.now() - 600000 },
            { playerId: "P-101-2", name: "Cyan", role: "impostor", joinedAt: Date.now() - 550000 },
            { playerId: "P-101-3", name: "Lime", role: "crewmate", joinedAt: Date.now() - 500000 }
          ],
          currentLocationIndex: 1,
          progress: {
            "osail-gazebo": { status: "pending", wrongAttempts: 0 }
          },
          sabotageState: {
            puzzleSwap: { active: false, expiresAt: 0 },
            mapScramble: { active: false, fakeLocationId: null, expiresAt: 0 },
            fakeReject: { active: false }
          },
          sabotageEvents: [],
          glitchState: { active: false },
          startTime: Date.now() - 600000,
          finishTime: null,
          score: 1000,
          impostorScore: 0,
          votes: []
        },
        "TEAM-202": {
          id: "TEAM-202",
          pin: "2222",
          size: 2,
          players: [
            { playerId: "P-202-1", name: "Alex", role: "survivor", joinedAt: Date.now() - 400000 },
            { playerId: "P-202-2", name: "Sam", role: "survivor", joinedAt: Date.now() - 350000 }
          ],
          currentLocationIndex: 2,
          progress: {
            "osail-gazebo": { status: "completed", timestamp: Date.now() - 300000, wrongAttempts: 0 },
            "dblock-gazebo": { status: "pending", wrongAttempts: 1 }
          },
          sabotageState: {
            puzzleSwap: { active: false, expiresAt: 0 },
            mapScramble: { active: false, fakeLocationId: null, expiresAt: 0 },
            fakeReject: { active: false }
          },
          sabotageEvents: [
            { type: "aiGlitch", triggeredBy: "system", timestamp: Date.now() - 320000, recoveryTimeSeconds: 14 }
          ],
          glitchState: { active: false },
          startTime: Date.now() - 400000,
          finishTime: null,
          score: 980,
          impostorScore: 0,
          votes: []
        }
      };
      localStorage.setItem("pdeu_mock_teams", JSON.stringify(demoTeams));
    }

    // Listen to storage events from other browser tabs
    window.addEventListener("storage", (e) => {
      if (e.key === "pdeu_mock_teams") {
        try {
          const teams = JSON.parse(e.newValue || "{}");
          this.listeners.forEach((callback, teamId) => {
            if (teams[teamId]) {
              callback(teams[teamId]);
            }
          });
        } catch (err) {}
      }
    });
  }

  // Notify mock listeners within the same tab
  _notifyMockTeam(teamId, teamData) {
    const cb = this.listeners.get(teamId);
    if (cb) cb(teamData);
  }

  // --- TEAM OPERATIONS ---

  /**
   * Get team by ID
   */
  async getTeam(teamId) {
    await this.ready();
    const cleanId = String(teamId).trim().toUpperCase();

    if (this.isLiveFirebase) {
      try {
        const doc = await this.db.collection("teams").doc(cleanId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      } catch (err) {
        console.error("Firestore getTeam error:", err);
        throw err;
      }
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      return teams[cleanId] || null;
    }
  }

  /**
   * Real-time subscription to team changes (crucial for live sabotage & glitch sync)
   * Returns an unsubscribe function.
   */
  subscribeTeam(teamId, onUpdate, onError) {
    const cleanId = String(teamId).trim().toUpperCase();

    if (this.isLiveFirebase) {
      return this.db.collection("teams").doc(cleanId).onSnapshot(
        (doc) => {
          if (doc.exists) {
            onUpdate({ id: doc.id, ...doc.data() });
          } else {
            onUpdate(null);
          }
        },
        (err) => {
          console.error("Firestore subscription error:", err);
          if (onError) onError(err);
        }
      );
    } else {
      // Mock DB subscription
      this.listeners.set(cleanId, onUpdate);
      // Immediately invoke with current state
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      if (teams[cleanId]) {
        setTimeout(() => onUpdate(teams[cleanId]), 10);
      }

      return () => {
        this.listeners.delete(cleanId);
      };
    }
  }

  /**
   * Update team fields in Firestore
   */
  async updateTeam(teamId, updates) {
    await this.ready();
    const cleanId = String(teamId).trim().toUpperCase();

    if (this.isLiveFirebase) {
      try {
        await this.db.collection("teams").doc(cleanId).set(updates, { merge: true });
      } catch (err) {
        console.error("Firestore updateTeam error:", err);
        throw err;
      }
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      if (!teams[cleanId]) {
        teams[cleanId] = { id: cleanId };
      }
      teams[cleanId] = { ...teams[cleanId], ...updates };
      localStorage.setItem("pdeu_mock_teams", JSON.stringify(teams));
      this._notifyMockTeam(cleanId, teams[cleanId]);
    }
  }

  /**
   * Log sabotage audit event
   */
  async logSabotage(teamId, eventData) {
    await this.ready();
    const payload = {
      teamId: String(teamId).trim().toUpperCase(),
      ...eventData,
      timestamp: Date.now()
    };

    if (this.isLiveFirebase) {
      try {
        await this.db.collection("sabotageLog").add(payload);
      } catch (err) {
        console.warn("Sabotage logging failed:", err);
      }
    } else {
      const logs = JSON.parse(localStorage.getItem("pdeu_mock_sabotage_logs") || "[]");
      logs.push(payload);
      localStorage.setItem("pdeu_mock_sabotage_logs", JSON.stringify(logs));
    }
  }

  // --- ADMIN OPERATIONS ---

  /**
   * Fetch all teams (with real-time subscription for admin live table)
   */
  subscribeAllTeams(onUpdate, onError) {
    if (this.isLiveFirebase) {
      return this.db.collection("teams").onSnapshot(
        (snapshot) => {
          const teams = [];
          snapshot.forEach((doc) => {
            teams.push({ id: doc.id, ...doc.data() });
          });
          onUpdate(teams);
        },
        (err) => {
          console.error("Firestore subscribeAllTeams error:", err);
          if (onError) onError(err);
        }
      );
    } else {
      const deliver = () => {
        const teamsObj = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
        onUpdate(Object.values(teamsObj));
      };

      deliver();
      const interval = setInterval(deliver, 1500);
      return () => clearInterval(interval);
    }
  }

  /**
   * Pre-generate multiple teams in batch (Admin tool)
   */
  async batchCreateTeams(teamsList) {
    await this.ready();
    if (this.isLiveFirebase) {
      const batch = this.db.batch();
      teamsList.forEach((team) => {
        const ref = this.db.collection("teams").doc(team.id);
        batch.set(ref, team);
      });
      await batch.commit();
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      teamsList.forEach((team) => {
        teams[team.id] = team;
      });
      localStorage.setItem("pdeu_mock_teams", JSON.stringify(teams));
    }
  }

  /**
   * Get location data from Firestore (or fallback to LOCATIONS config)
   */
  async getLocations() {
    await this.ready();
    if (this.isLiveFirebase) {
      try {
        const snapshot = await this.db.collection("locations").get();
        if (!snapshot.empty) {
          const locs = [];
          snapshot.forEach(doc => locs.push({ id: doc.id, ...doc.data() }));
          locs.sort((a, b) => a.order - b.order);
          return locs;
        }
      } catch (e) {
        console.warn("Could not fetch locations from Firestore, using config defaults:", e);
      }
    }
    // Fallback to config.js defaults
    return LOCATIONS;
  }

  /**
   * Save or update a location in Firestore (Admin tool)
   */
  async saveLocation(locationData) {
    await this.ready();
    if (this.isLiveFirebase) {
      await this.db.collection("locations").doc(locationData.id).set(locationData, { merge: true });
    } else {
      const locMap = JSON.parse(localStorage.getItem("pdeu_mock_locations") || "{}");
      locMap[locationData.id] = locationData;
      localStorage.setItem("pdeu_mock_locations", JSON.stringify(locMap));
    }
  }
}

export const firebaseService = new FirebaseService();
