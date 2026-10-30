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

// Sabotage Abilities for Impostors (3+ player teams)
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
 * 6 Fixed Sequential PDEU Campus Locations on the Official Map
 * Locations:
 * 1. OSAIL Gazebo
 * 2. D Block Gazebo
 * 3. Germi (Gemini Stage)
 * 4. C Block Gazebo
 * 5. A Block Seating
 * 6. Mess 1st Floor
 */
export const LOCATIONS = [
  {
    id: "osail-gazebo",
    order: 1,
    name: "OSAIL Gazebo",
    shortName: "OSAIL Gazebo",
    coords: { x: 49.5, y: 48.0 },
    token: "OG842X1",
    clue: "Start at the central OSAIL Gazebo pavilion beside the Cricket Ground.",
    puzzle: {
      type: "cipher",
      category: "ROT-3 Shift Cipher",
      question: "DECODE INTERCEPTED BEACON: Emergency transmission received on frequency 104.3. Decrypt ciphertext 'G E O R F N' using ROT-3 (Shift each letter 3 positions backward in the alphabet: D->A, E->B...):",
      cipherText: "G E O R F N",
      shiftKey: "-3 (ROT-3)",
      answer: "D Block",
      hint: "G shifted back 3 is D. E shifted back 3 is B. O shifted back 3 is L. Spells the next building block!"
    },
    acceptedAnswers: [
      "dblock", "d block", "d-block", "dgazebo", "d gazebo", "d block gazebo", "dblockgazebo", "d"
    ],
    decoyPuzzle: {
      question: "Input the 6-character relay serial from the central electrical conduit beneath the canopy: [HEX: 0xFD42]",
      type: "text",
      hint: "Check the overhead ceiling junction."
    }
  },
  {
    id: "dblock-gazebo",
    order: 2,
    name: "D Block Gazebo",
    shortName: "D Gazebo",
    coords: { x: 74.5, y: 64.0 },
    token: "DG519K2",
    clue: "Navigate east between D Block and C Block to locate D Block Gazebo.",
    puzzle: {
      type: "sudoku",
      category: "4x4 Reactor Sudoku",
      question: "REACTOR CORE BALANCE: Complete the 4x4 energy Sudoku grid. Digits 1 to 4 cannot repeat in any row, column, or 2x2 quadrant. Find the missing values in cells [A], [B], [C], and [D]. Enter the 4-digit security code [ABCD]:",
      grid: [
        [1, 2, 3, "A"],
        [3, "B", 1, 2],
        ["C", 1, 4, 3],
        [4, 3, "D", 1]
      ],
      answer: "4422",
      hint: "Row 1 is missing 4 (A=4). Row 2 is missing 4 (B=4). Row 3 is missing 2 (C=2). Row 4 is missing 2 (D=2). Code = 4422!"
    },
    acceptedAnswers: [
      "4422", "4 4 2 2", "4,4,2,2", "4-4-2-2", "germi", "germistage", "germi stage"
    ],
    decoyPuzzle: {
      question: "Count the exact number of red concrete paver blocks forming the gazebo foundation ramp.",
      type: "number",
      hint: "Recount carefully from left to right."
    }
  },
  {
    id: "germi",
    order: 3,
    name: "Germi",
    shortName: "Germi",
    coords: { x: 59.4, y: 76.8 },
    token: "GM388Z3",
    clue: "Proceed south into the courtyard amphitheater stage of D Block (Germi).",
    puzzle: {
      type: "kenken",
      category: "3x3 Oxygen KenKen",
      question: "OXYGEN RECYCLER HARMONIC: Solve the 3x3 KenKen grid using digits 1, 2, and 3 (no repeats in any row or column). Cages: Top-Left (3+), Top-Right (6x), Mid-Left (1-), Center (4+), Bottom-Right (1). What is the sequence of digits in the BOTTOM ROW (Row 3, left to right)?",
      gridSize: 3,
      cages: [
        { label: "3+", cells: [[0,0], [0,1]] },
        { label: "6x", cells: [[0,2], [1,2]] },
        { label: "1-", cells: [[1,0], [2,0]] },
        { label: "4+", cells: [[1,1], [2,1]] },
        { label: "1",  cells: [[2,2]] }
      ],
      answer: "231",
      hint: "Top-right cage '6x' is 3 × 2. Bottom-right cage '1' is 1. The bottom row from left to right is 2, 3, 1."
    },
    acceptedAnswers: [
      "231", "2 3 1", "2,3,1", "2-3-1", "c block", "cblock", "c gazebo", "cgazebo", "c-block", "c block gazebo"
    ],
    decoyPuzzle: {
      question: "Enter the sound resonance tuning frequency (in kHz) marked on backstage amplifier panel #3.",
      type: "text",
      hint: "Check behind the stage wing."
    }
  },
  {
    id: "cblock-gazebo",
    order: 4,
    name: "C Block Gazebo",
    shortName: "C Gazebo",
    coords: { x: 80.7, y: 72.0 },
    token: "CG773M4",
    clue: "Walk into the sheltered courtyard plaza of C Block to reach C Block Gazebo.",
    puzzle: {
      type: "crossword",
      category: "Mainframe Crossword",
      question: "CAMPUS SECURITY MAINFRAME: Solve the crossword clues. Clue 1 Across [A BLOCK] intersects with Clue 1 Down [SEATING] outside the main academic wing. Enter the combined next destination name:",
      crosswordClues: {
        across: [
          "1 Across: Main academic building wing facing the lawn (6 letters): A B L O C K",
          "3 Across: Non-impostor astronaut team member (4 letters): C R E W"
        ],
        down: [
          "1 Down: Open outdoor curved amphitheater steps where students rest (7 letters): S E A T I N G",
          "2 Down: Loud siren triggered during emergency meeting (5 letters): A L A R M"
        ]
      },
      answer: "A Seating",
      hint: "Combining 1 Across (A BLOCK) and 1 Down (SEATING) directs you to 'A SEATING'!"
    },
    acceptedAnswers: [
      "aseating", "a seating", "ablockseating", "a block seating", "a-seating", "ablock", "a block", "seating", "a seating area"
    ],
    decoyPuzzle: {
      question: "Count the number of steel hexagonal bolts securing the perimeter gazebo canopy braces.",
      type: "number",
      hint: "Look under the roof eaves."
    }
  },
  {
    id: "ablock-seating",
    order: 5,
    name: "A Block Seating",
    shortName: "A Seating",
    coords: { x: 92.5, y: 32.3 },
    token: "AS312P5",
    clue: "Head northeast to the curved open-air amphitheater benches outside A Block.",
    puzzle: {
      type: "matrix",
      category: "5x5 Grid Coordinate Cipher",
      question: "SUB-LEVEL TELEMETRY CIPHER: Using (Row, Column) lookups in the 5x5 Grid Matrix, decipher the coordinate pairs: (1,1), (1,2), (1,3), (1,3). Which central student dining facility is the final beacon located on Floor 1?",
      matrix: [
        ["M", "E", "S", "F", "L"],
        ["O", "R", "A", "B", "C"],
        ["D", "G", "H", "I", "K"],
        ["N", "P", "Q", "T", "U"],
        ["V", "W", "X", "Y", "Z"]
      ],
      coordsToDecode: "(1,1) (1,2) (1,3) (1,3)",
      answer: "Mess",
      hint: "(Row 1, Col 1) = M. (Row 1, Col 2) = E. (Row 1, Col 3) = S. (Row 1, Col 3) = S. It spells MESS (Mess 1st Floor)!"
    },
    acceptedAnswers: [
      "mess", "mess 1 floor", "mess 1st floor", "mess1floor", "mess1", "mess 1", "mess floor 1", "cafeteria", "mess and cafeteria"
    ],
    decoyPuzzle: {
      question: "Transcribe the 5-digit room inventory code on the ground-floor faculty door facing the benches.",
      type: "text",
      hint: "Check through the glass door window."
    }
  },
  {
    id: "mess-1-floor",
    order: 6,
    name: "Mess 1st Floor",
    shortName: "Mess 1 Floor",
    coords: { x: 51.0, y: 27.1 },
    token: "MF904R6",
    clue: "Final Station! Reach the Mess & Cafeteria (1st Floor dining hall).",
    puzzle: {
      type: "master-override",
      category: "Final Extraction Protocol",
      question: "FINAL SHIP EXTRACTION PROTOCOL: You have scouted all 6 campus sectors! To purge the rogue infection, trigger ship extraction, and log your crew's official survival time on the organizer leaderboard, enter the mission victory passcode:",
      answer: "VICTORY",
      hint: "Type VICTORY, FINISH, or SURVIVE to log your mission completion!"
    },
    acceptedAnswers: [
      "victory", "finish", "survive", "extract", "amongus", "done", "complete", "win", "survived", "mess"
    ],
    decoyPuzzle: {
      question: "Enter the 8-digit fire extinguisher inspection seal code mounted beside the dining hall stairs.",
      type: "text",
      hint: "Inspect the wall mount plate."
    }
  }
];

// Generate 6-letter Among Us style room code (e.g. "SKELDX")
export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // 24 letters (no I or O to prevent confusion)
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
 * Accepts uppercase, lowercase, spaces, hyphens, slashes, typos (e.g. "D Block", "dblock", "dbock")
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
