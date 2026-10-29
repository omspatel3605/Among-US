/**
 * Firebase Firestore Service with Room Code Lobbies & Multi-Tab Fallback
 * Connects to live Firestore when credentials are set,
 * or runs in local mock mode so testing works immediately.
 */

import { FIREBASE_CONFIG, isDemoConfig, LOCATIONS, AMONG_US_COLORS } from './config.js';

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
        "SKELD1": {
          id: "SKELD1",
          hostPlayerId: "P-SKELD1-1001",
          size: 4,
          maxSize: 4,
          status: "playing",
          players: [
            { playerId: "P-SKELD1-1001", name: "Red", role: "crewmate", joinedAt: Date.now() - 600000 },
            { playerId: "P-SKELD1-1002", name: "Cyan", role: "impostor", joinedAt: Date.now() - 550000 },
            { playerId: "P-SKELD1-1003", name: "Lime", role: "crewmate", joinedAt: Date.now() - 500000 }
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
          sabotageUsed: {},
          sabotageEvents: [],
          glitchState: { active: false },
          startTime: Date.now() - 600000,
          finishTime: null,
          score: 1000,
          impostorScore: 0,
          votes: []
        },
        "ROGUE2": {
          id: "ROGUE2",
          hostPlayerId: "P-ROGUE2-2001",
          size: 2,
          maxSize: 2,
          status: "playing",
          players: [
            { playerId: "P-ROGUE2-2001", name: "Alex", role: "survivor", joinedAt: Date.now() - 400000 },
            { playerId: "P-ROGUE2-2002", name: "Sam", role: "survivor", joinedAt: Date.now() - 350000 }
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
          sabotageUsed: {},
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

  _notifyMockTeam(teamId, teamData) {
    const cb = this.listeners.get(teamId);
    if (cb) cb(teamData);
  }

  // --- TEAM CREATION & OPERATIONS ---

  /**
   * Create a new team with room code (Host action)
   */
  async createTeam(roomCode, hostPlayer, teamSize = 4) {
    await this.ready();
    const cleanId = String(roomCode).trim().toUpperCase();

    const colorObj = hostPlayer.color || AMONG_US_COLORS[0];
    const initialPlayer = {
      ...hostPlayer,
      color: colorObj.hex || colorObj,
      colorName: colorObj.name || "Red",
      location: { x: 46.5, y: 41.0, updatedAt: Date.now() } // Default to OSAIL Gazebo
    };

    const teamData = {
      id: cleanId,
      hostPlayerId: hostPlayer.playerId,
      size: teamSize,
      maxSize: teamSize,
      status: "lobby", // 'lobby' -> 'playing' -> 'finished'
      players: [initialPlayer],
      currentLocationIndex: 1,
      progress: {},
      sabotageState: {
        puzzleSwap: { active: false, expiresAt: 0 },
        mapScramble: { active: false, fakeLocationId: null, expiresAt: 0 },
        fakeReject: { active: false }
      },
      sabotageUsed: {},
      sabotageEvents: [],
      glitchState: { active: false },
      startTime: null,
      finishTime: null,
      score: 1000,
      impostorScore: 0,
      votes: []
    };

    if (this.isLiveFirebase) {
      await this.db.collection("teams").doc(cleanId).set(teamData);
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      teams[cleanId] = teamData;
      localStorage.setItem("pdeu_mock_teams", JSON.stringify(teams));
      this._notifyMockTeam(cleanId, teamData);
    }

    return teamData;
  }

  /**
   * Start expedition: assign secret roles and set status to "playing"
   */
  async startGame(teamId) {
    await this.ready();
    const cleanId = String(teamId).trim().toUpperCase();
    const team = await this.getTeam(cleanId);
    if (!team) throw new Error("Team not found");

    const players = [...(team.players || [])];
    const teamSize = team.maxSize || team.size || players.length;

    // Assign roles
    if (teamSize === 2) {
      // 2 players: Rogue AI mode, both are survivors
      players.forEach(p => { p.role = "survivor"; });
    } else {
      // 3-4 players: Exactly 1 Impostor, rest Crewmates
      const impostorIndex = Math.floor(Math.random() * players.length);
      players.forEach((p, idx) => {
        p.role = idx === impostorIndex ? "impostor" : "crewmate";
      });
    }

    const updates = {
      status: "playing",
      players: players,
      startTime: Date.now()
    };

    await this.updateTeam(cleanId, updates);
    return updates;
  }

  /**
   * Get team by ID / Room Code
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
      this.listeners.set(cleanId, onUpdate);
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
   * Real-time GPS location broadcast
   * Throttled to avoid overwhelming Firestore writes
   */
  async updatePlayerLocation(teamId, playerId, coords) {
    if (!teamId || !playerId || !coords) return;
    const cleanId = String(teamId).trim().toUpperCase();

    // Check last update time to throttle (once every 3 seconds per player)
    const now = Date.now();
    if (this._lastLocationUpdate && (now - this._lastLocationUpdate < 2800)) {
      return;
    }
    this._lastLocationUpdate = now;

    try {
      const team = await this.getTeam(cleanId);
      if (!team || !team.players) return;

      const players = team.players.map(p => {
        if (p.playerId === playerId) {
          return {
            ...p,
            location: {
              x: coords.x,
              y: coords.y,
              lat: coords.lat,
              lng: coords.lng,
              updatedAt: now
            }
          };
        }
        return p;
      });

      await this.updateTeam(cleanId, { players });
    } catch (err) {
      console.warn("Location sync failed:", err);
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
   * Delete a team / room
   */
  async deleteTeam(teamId) {
    await this.ready();
    const cleanId = String(teamId).trim().toUpperCase();

    if (this.isLiveFirebase) {
      try {
        await this.db.collection("teams").doc(cleanId).delete();
      } catch (err) {
        console.error("Firestore deleteTeam error:", err);
        throw err;
      }
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      delete teams[cleanId];
      localStorage.setItem("pdeu_mock_teams", JSON.stringify(teams));
      this._notifyMockTeam(cleanId, null);
    }
  }

  /**
   * Bulk delete rooms by filter (e.g. 'all', 'finished', 'lobby')
   */
  async deleteTeamsByFilter(filter = "finished") {
    await this.ready();
    let count = 0;

    if (this.isLiveFirebase) {
      const snapshot = await this.db.collection("teams").get();
      const batch = this.db.batch();

      snapshot.forEach(doc => {
        const data = doc.data();
        let shouldDelete = false;

        if (filter === "all") {
          shouldDelete = true;
        } else if (filter === "finished") {
          shouldDelete = !!data.finishTime || (data.currentLocationIndex || 1) > LOCATIONS.length;
        } else if (filter === "lobby") {
          shouldDelete = data.status === "lobby";
        }

        if (shouldDelete) {
          batch.delete(doc.ref);
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
      }
      return count;
    } else {
      const teams = JSON.parse(localStorage.getItem("pdeu_mock_teams") || "{}");
      Object.keys(teams).forEach(id => {
        const data = teams[id];
        let shouldDelete = false;

        if (filter === "all") {
          shouldDelete = true;
        } else if (filter === "finished") {
          shouldDelete = !!data.finishTime || (data.currentLocationIndex || 1) > LOCATIONS.length;
        } else if (filter === "lobby") {
          shouldDelete = data.status === "lobby";
        }

        if (shouldDelete) {
          delete teams[id];
          count++;
        }
      });

      localStorage.setItem("pdeu_mock_teams", JSON.stringify(teams));
      return count;
    }
  }

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
    return LOCATIONS;
  }

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
