/**
 * AMONG US: PDEU CAMPUS TREASURE HUNT
 * Central Game Configuration, Locations, Scoring & Admin Credentials
 */

// Firebase Configuration (Live Credentials)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyACNKAgM-0Zojv9S1aOLYuM1iQVJ4nSRSg",
  authDomain: "pdeu-amongus-hunt.firebaseapp.com",
  projectId: "pdeu-amongus-hunt",
  storageBucket: "pdeu-amongus-hunt.firebasestorage.app",
  messagingSenderId: "1082067419012",
  appId: "1:1082067419012:web:8a4e981d08295d4dd9e7d1",
  measurementId: "G-PP03420Q8T"
};

export const isDemoConfig = () => {
  return !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.includes("DEMO_REPLACE");
};

// Organizer / Admin Login Credentials
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "pdeu@amongus2026"
};

export const ADMIN_PASSCODE = "pdeu2026";

// Scoring Parameters
export const SCORING = {
  baseline: 1000,
  minutePenalty: 1,
  wrongAttemptPenalty: 10,
  sabotagePenalty: 5,
  fastRecoveryBonus: 20,
  impostorEscapeBonus: 300,
  impostorCaughtBonus: 100
};

// 12 Authentic Among Us Crewmate Colors
export const AMONG_US_COLORS = [
  { id: 'red', name: 'Red', hex: '#c51111', visor: '#38fedc' },
  { id: 'blue', name: 'Blue', hex: '#132ed1', visor: '#38fedc' },
  { id: 'green', name: 'Green', hex: '#117f2d', visor: '#50ef39' },
  { id: 'pink', name: 'Pink', hex: '#ed54ba', visor: '#ffffff' },
  { id: 'orange', name: 'Orange', hex: '#ef7d0e', visor: '#f5f558' },
  { id: 'yellow', name: 'Yellow', hex: '#f5f558', visor: '#ffffff' },
  { id: 'black', name: 'Black', hex: '#3f474e', visor: '#38fedc' },
  { id: 'white', name: 'White', hex: '#d6e0f0', visor: '#38fedc' },
  { id: 'purple', name: 'Purple', hex: '#6b2fbc', visor: '#38fedc' },
  { id: 'brown', name: 'Brown', hex: '#71491e', visor: '#38fedc' },
  { id: 'cyan', name: 'Cyan', hex: '#38fedc', visor: '#ffffff' },
  { id: 'lime', name: 'Lime', hex: '#50ef39', visor: '#ffffff' }
];

// Real PDEU Campus Ground-Truth GPS Calibration Reference Points:
// 1. Center of Mess: 23.15704505788152, 72.66602395231996 -> { x: 50.54%, y: 21.85% }
// 2. Center of Girls Hostel: 23.156768229375167, 72.66692721223068 -> { x: 66.50%, y: 18.50% }
// 3. Center of E Block: 23.1555730266912, 72.66454480443679 -> { x: 39.50%, y: 72.20% }
export const CAMPUS_GEO_CALIBRATION = {
  landmarks: {
    mess: { lat: 23.15704505788152, lng: 72.66602395231996, x: 50.54, y: 21.85 },
    girlsHostel: { lat: 23.156768229375167, lng: 72.66692721223068, x: 66.50, y: 18.50 },
    eBlock: { lat: 23.1555730266912, lng: 72.66454480443679, x: 39.50, y: 72.20 }
  },
  // Affine Transformation parameters (rotates -25.4° to align campus masterplan with real-world orientation):
  affine: {
    a: 15266.43055613,
    b: -7840.39666869,
    c: -927739.84952994,
    d: -10850.23959197,
    e: -23301.74204268,
    f: 1328065.11048814
  }
};

export const CAMPUS_GPS_BOUNDS = {
  north: 23.1585,
  south: 23.1520,
  west: 72.6640,
  east: 72.6720
};

// Convert device GPS (lat, lng) to high-precision percentage coords (x%, y%) on 1024x707 college map
export function gpsToCampusCoords(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return { x: 50.0, y: 50.0 };
  }

  const { a, b, c, d, e, f } = CAMPUS_GEO_CALIBRATION.affine;
  const rawX = a * lng + b * lat + c;
  const rawY = d * lng + e * lat + f;

  // Clamp within visible map limits (3% to 97%)
  const clampedX = Math.max(3, Math.min(97, rawX));
  const clampedY = Math.max(3, Math.min(97, rawY));

  return {
    x: Number(clampedX.toFixed(1)),
    y: Number(clampedY.toFixed(1))
  };
}

// Sabotage Abilities for Impostors (3-4 player teams)
export const SABOTAGE_CONFIG = {
  puzzleSwap: {
    id: "puzzleSwap",
    name: "Puzzle Swap",
    durationSeconds: 90,
    icon: "🧩",
    color: "#a855f7",
    summary: "Silently swaps teammates' puzzle with an impossible decoy question for 90s. Decoy submissions are auto-rejected."
  },
  mapScramble: {
    id: "mapScramble",
    name: "Map Scramble",
    durationSeconds: 120,
    icon: "🗺️",
    color: "#eab308",
    summary: "Scrambles the map radar for 2 minutes: falsely highlights a wrong pin as 'next' and dims the real one."
  },
  fakeReject: {
    id: "fakeReject",
    name: "Fake Reject",
    durationSeconds: 0,
    icon: "❌",
    color: "#ef4444",
    summary: "Traps the next puzzle attempt: falsely marks the team's first correct submission as 'INCORRECT' once."
  }
};

/**
 * 6 Fixed Sequential PDEU Campus Locations
 * Puzzles answer reveals the next destination!
 */
export const LOCATIONS = [
  {
    id: "osail-gazebo",
    order: 1,
    name: "OSAIL Gazebo",
    shortName: "OSAIL Gazebo",
    coords: { x: 46.5, y: 41.0 },
    gps: { lat: 23.156481, lng: 72.665470 },
    token: "OG842X1",
    clue: "Start at Osail Gazebo pavilion beside the Cricket Ground.",
    puzzle: {
      question: "Search the area around OSAIL Gazebo. A cryptic transmission points to the next sector: Where engineering students gather near the substation, shaded between the academic blocks. Enter the destination name:",
      type: "text",
      answer: "D Block",
      hint: "Head east towards D Block Gazebo (between D Block and C Block)."
    },
    acceptedAnswers: [
      "dblock", "d block", "dgazebo", "d gazebo", "d-block", "dbock", "dblockgazebo", "d", "d block gazebo"
    ],
    decoyPuzzle: {
      question: "Enter the serial number etched onto the electrical conduit beneath the central canopy lamp: [HEX-CODE]",
      type: "text",
      hint: "Look straight up into the ceiling rafters."
    }
  },
  {
    id: "dblock-gazebo",
    order: 2,
    name: "D Block Gazebo",
    shortName: "D Gazebo",
    coords: { x: 69.8, y: 60.5 },
    gps: { lat: 23.155232, lng: 72.666355 },
    token: "DG519K2",
    clue: "Navigate east between D Block and C Block. Find D Gazebo.",
    puzzle: {
      question: "Decode the beacon at D Block Gazebo: Follow the pathway into the sheltered courtyard of the chemical and petroleum wing. Enter the next destination:",
      type: "text",
      answer: "C Block",
      hint: "The next station is C Block Gazebo in the adjacent courtyard."
    },
    acceptedAnswers: [
      "cblock", "c block", "cgazebo", "c gazebo", "c-block", "cbock", "cblockgazebo", "c", "c block gazebo"
    ],
    decoyPuzzle: {
      question: "Count the total number of red patterned paver stones forming the ramp entry.",
      type: "number",
      hint: "Pavements can be tricky to count!"
    }
  },
  {
    id: "cblock-gazebo",
    order: 3,
    name: "C Block Gazebo",
    shortName: "C Gazebo",
    coords: { x: 74.8, y: 63.8 },
    gps: { lat: 23.154995, lng: 72.666600 },
    token: "CG773M3",
    clue: "Walk into the inner courtyard of C Block to find C Gazebo.",
    puzzle: {
      question: "Signal intercepted at C Gazebo! The coordinates direct you northeast to the main academic atrium where curved amphitheater benches surround the plaza. Enter the destination:",
      type: "text",
      answer: "A Seating",
      hint: "Look for the open curved seating outside A Block."
    },
    acceptedAnswers: [
      "aseating", "a seating", "ablock", "a block", "ablockseating", "a-seating", "a-block", "a", "a seating area"
    ],
    decoyPuzzle: {
      question: "Transcribe the Roman numerals on the concrete base foundation stone.",
      type: "text",
      hint: "Examine the low foundation blocks."
    }
  },
  {
    id: "ablock-seating",
    order: 4,
    name: "A Block Seating",
    shortName: "A Seating",
    coords: { x: 84.5, y: 25.5 },
    gps: { lat: 23.156083, lng: 72.667754 },
    token: "AS312P4",
    clue: "Proceed northeast towards the open curved amphitheater outside A Block.",
    puzzle: {
      question: "Decrypted from A Block Seating: Head northwest across the central lawns to the student residential and dining zone where the large canopy float stands. Enter the destination:",
      type: "text",
      answer: "Mess",
      hint: "Proceed towards the Mess / Ness 1 residence zone."
    },
    acceptedAnswers: [
      "mess", "ness", "ness1", "ness 1", "ness1float", "ness float", "mess pavilion", "dining", "ness (mess)", "ness1 float"
    ],
    decoyPuzzle: {
      question: "What room number is directly visible through the first ground-floor faculty office window?",
      type: "text",
      hint: "Look through the glass door."
    }
  },
  {
    id: "ness1-float",
    order: 5,
    name: "Ness 1 Float (Mess)",
    shortName: "Mess / Ness 1",
    coords: { x: 50.5, y: 21.8 },
    gps: { lat: 23.15704505788152, lng: 72.66602395231996 },
    token: "NF904R5",
    clue: "Navigate to the northern quad near the dining hall. Spot the Mess / Ness 1 canopy structure.",
    puzzle: {
      question: "Emergency broadcast decoded at the Mess: The final ship extraction zone is located south of D Block at the grand amphitheater stage. Enter the final destination:",
      type: "text",
      answer: "Gemini Stage",
      hint: "The grand stage located south of D Block (labeled Gemini Stage / Germi)."
    },
    acceptedAnswers: [
      "gemini", "geministage", "gemini stage", "germi", "germistage", "germi stage", "stage", "gemini amphitheater"
    ],
    decoyPuzzle: {
      question: "Count the total number of braided stainless steel suspension cables in the canopy float.",
      type: "number",
      hint: "Look up towards the tension ring."
    }
  },
  {
    id: "gemini-stage",
    order: 6,
    name: "Gemini Stage (Germi)",
    shortName: "Gemini Stage",
    coords: { x: 57.0, y: 76.5 },
    gps: { lat: 23.154993, lng: 72.665393 },
    token: "GS661Z6",
    clue: "Final Station! Reach the grand Gemini Stage / Germi complex directly south of D Block.",
    puzzle: {
      question: "FINAL EMERGENCY TERMINAL AT GEMINI STAGE: Input the master extraction override code to clear the final station and transmit debrief:",
      type: "text",
      answer: "FINISH",
      hint: "Enter FINISH or COMPLETE to conclude your campus run!"
    },
    acceptedAnswers: [
      "finish", "complete", "done", "victory", "crew", "amongus", "win", "extracted", "survived"
    ],
    decoyPuzzle: {
      question: "Input the 6-character emergency broadcast serial code found on the backstage power distribution box.",
      type: "text",
      hint: "Behind the backstage wing."
    }
  }
];

// Generate 6-letter Among Us style room code (e.g. "SKELDX")
export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Helper: Get Location by ID
export function getLocationById(locId) {
  return LOCATIONS.find(loc => loc.id === locId) || null;
}

// Helper: Get Location by Order Index (1-indexed)
export function getLocationByOrder(order) {
  return LOCATIONS.find(loc => loc.order === order) || null;
}

// Clean string for ultra-flexible comparison (removes all spaces, punctuation, lowercase)
export function normalizeAnswer(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .toLowerCase()
    .replace(/[\s\-_.,'"!?:;()/\\]/g, "")
    .trim();
}

// Compute Levenshtein distance for fuzzy typo tolerance (e.g. "dbock" vs "dblock")
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Super forgiving answer checker:
 * Accepts uppercase, lowercase, spaces, hyphens, slashes, typos (e.g. "D Block", "dblock", "dbock", "d block")
 */
export function isAnswerCorrect(userAnswer, targetAnswer, acceptedList = []) {
  if (!userAnswer) return false;
  
  const cleanUser = normalizeAnswer(userAnswer);
  if (!cleanUser) return false;

  const targetsToCheck = [];
  if (targetAnswer) targetsToCheck.push(normalizeAnswer(targetAnswer));
  if (Array.isArray(acceptedList)) {
    acceptedList.forEach(a => {
      const c = normalizeAnswer(a);
      if (c && !targetsToCheck.includes(c)) targetsToCheck.push(c);
    });
  }

  // 1. Direct exact match
  if (targetsToCheck.includes(cleanUser)) return true;

  // 2. Substring containment match (e.g. user typed "the d block gazebo" or "cblock")
  for (const t of targetsToCheck) {
    if (cleanUser === t) return true;
    if (t.length >= 3 && cleanUser.includes(t)) return true;
    if (cleanUser.length >= 4 && t.includes(cleanUser)) return true;
    
    // 3. Typo / Levenshtein tolerance:
    // If length >= 4, allow 1 edit (e.g. "dbock" vs "dblock")
    if (t.length >= 4 && Math.abs(cleanUser.length - t.length) <= 1) {
      if (levenshteinDistance(cleanUser, t) <= 1) {
        return true;
      }
    }
  }

  return false;
}
