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
 * 6 Fixed Sequential PDEU Campus Locations
 * Route: OSAIL Gazebo → D Block Gazebo → Germi → C Block Gazebo → A Block Seating → Mess 1st Floor
 *
 * Puzzle types (one per station, NEVER reveal answer in visual):
 *  1. crossword-3x3  — read row words, concat them
 *  2. caesar-cipher  — shift-3 decode, answer = first word
 *  3. kenken         — 3×3 cage grid, answer = middle row digits
 *  4. riddle         — lateral thinking riddle, answer = SCREEN
 *  5. sudoku         — 4×4 partial grid, answer = solved top row
 *  6. anagram        — unscramble 8 letters, answer = IMPOSTOR
 */
export const LOCATIONS = [
  // ── STATION 1 ──────────────────────────────────────────────────
  {
    id: "osail-gazebo",
    order: 1,
    name: "OSAIL Gazebo",
    shortName: "OSAIL Gazebo",
    coords: { x: 49.5, y: 48.0 },
    token: "OG842X1",
    clue: "Start at the central OSAIL Gazebo pavilion beside the Cricket Ground.",
    puzzle: {
      type: "crossword-3x3",
      category: "Mini Crossword (3×3)",
      question: "STATION INTEL — A 3×3 letter grid was found encoded in the OSAIL signal log. Each row spells a word reading LEFT → RIGHT. The grid encodes: one process that takes years, one invisible force that keeps you grounded, one tiny unit of matter. Read the three row-words and concatenate them (no spaces, no hyphens) to form your 9-letter answer code.",
      // Grid: EVE / OLV / TIO → EVOLUTION
      // Row 0: E V O
      // Row 1: L U T
      // Row 2: I O N
      // Concat: EVOLUTION (9 letters) — answer is EVOLUTION
      grid: [
        ["E","V","O"],
        ["L","U","T"],
        ["I","O","N"]
      ],
      answer: "EVOLUTION",
      hint: "Row 1 starts the word. Row 2 has the middle. Row 3 ends it. The full 9-letter word describes Darwin's big idea."
    },
    acceptedAnswers: ["evolution", "EVOLUTION"],
    decoyPuzzle: {
      question: "Input the 6-character relay serial from the electrical conduit under the OSAIL canopy lamp: [HEX code]",
      type: "text",
      hint: "Check the overhead ceiling junction box."
    }
  },

  // ── STATION 2 ──────────────────────────────────────────────────
  {
    id: "dblock-gazebo",
    order: 2,
    name: "D Block Gazebo",
    shortName: "D Gazebo",
    coords: { x: 74.5, y: 64.0 },
    token: "DG519K2",
    clue: "Navigate east between D Block and C Block to locate D Block Gazebo.",
    puzzle: {
      type: "caesar-cipher",
      category: "Caesar Cipher (Shift −13)",
      // Shift = ROT-13 (harder — most people know "shift by 3" but not ROT-13)
      // Plaintext:  SABOTAGE
      // Ciphertext: FNOBGNTR  (each letter +13 mod 26)
      // Shift hint: shift back 13, i.e. A↔N, B↔O ... ROT-13
      question: "ENCRYPTED CREW DISTRESS SIGNAL intercepted at D Block Gazebo. This cipher does NOT use shift-3. Instead, each letter has been shifted by EXACTLY 13 positions forward in the alphabet (ROT-13). Shift each letter BACK 13 places to decode. Enter ONLY the single decoded word as your answer:",
      cipherText: "FNOBGNTR",
      shiftHint: "Shift back 13  |  N→A  O→B  P→C … Z→M  |  ROT-13 is its own inverse",
      answer: "SABOTAGE",
      hint: "F→S, N→A, O→B, B→O, G→T, N→A, T→G, R→E. What 8-letter word do you get?"
    },
    acceptedAnswers: ["sabotage", "SABOTAGE", "Sabotage"],
    decoyPuzzle: {
      question: "Count the exact number of red paver blocks forming the D Block Gazebo foundation ramp.",
      type: "number",
      hint: "Count carefully from left to right."
    }
  },

  // ── STATION 3 ──────────────────────────────────────────────────
  {
    id: "germi",
    order: 3,
    name: "Germi",
    shortName: "Germi",
    coords: { x: 59.4, y: 76.8 },
    token: "GM388Z3",
    clue: "Proceed south into the courtyard amphitheater known as Germi.",
    puzzle: {
      type: "kenken",
      category: "Mini KenKen (4×4)",
      // Upgraded to 4×4 KenKen for more difficulty
      // Digits 1–4, no repeats per row or column
      // Solved grid:
      //   Row 0:  2  1  4  3
      //   Row 1:  3  4  1  2   ← ANSWER ROW (middle of 4 rows = row index 1, but we ask row 2 = index 1 0-based)
      //   Row 2:  1  3  2  4
      //   Row 3:  4  2  3  1
      //
      // We ask for ROW 2 (1-indexed, 0-indexed = row index 1): 3 4 1 2 → answer: "3412"
      //
      // Cages (no filled values shown):
      //   A: (0,0)+(1,0) = 5+       → top-left 2-cell vertical
      //   B: (0,1) = single = 1     → (0,1) single cell
      //   C: (0,2)+(0,3) = 7+       → top-right 2-cell horizontal
      //   D: (1,1)+(1,2) = 5+       → mid 2-cell horizontal
      //   E: (1,3)+(2,3) = 6+       → right 2-cell vertical
      //   F: (2,0)+(2,1)+(2,2) = 6+ → row 2 left trio
      //   G: (3,0)+(3,1) = 6+       → bottom-left 2-cell horizontal
      //   H: (3,2)+(3,3) = 4+       → bottom-right 2-cell horizontal
      question: "OXYGEN RECYCLER LOCK: Solve this 4×4 KenKen using only digits 1, 2, 3, 4 — no digit may repeat in any row or column. Each outlined cage shows a target value and operation in its corner. Solve the full grid, then enter ROW 2 (the second row from the top) as a 4-digit code, left to right:",
      cageMap: [
        ["A","B","C","C"],
        ["A","D","D","E"],
        ["F","F","F","E"],
        ["G","G","H","H"]
      ],
      cageLabels: { A:"5+", B:"1", C:"7+", D:"5+", E:"6+", F:"6+", G:"6+", H:"4+" },
      answer: "3412",
      hint: "Cage B is a single cell with value 1 — so (0,1)=1. Cage C (7+) with values from 1-4: only 3+4=7. Cage A (5+) vertical: must be 2+3 or 3+2. Work column by column!"
    },
    acceptedAnswers: ["3412", "3 4 1 2", "3,4,1,2", "3-4-1-2"],
    decoyPuzzle: {
      question: "Enter the sound resonance frequency (kHz) from amplifier panel #3 behind the Germi stage.",
      type: "text",
      hint: "Check behind the backstage wing."
    }
  },

  // ── STATION 4 ──────────────────────────────────────────────────
  {
    id: "cblock-gazebo",
    order: 4,
    name: "C Block Gazebo",
    shortName: "C Gazebo",
    coords: { x: 80.7, y: 72.0 },
    token: "CG773M4",
    clue: "Walk into the sheltered courtyard plaza of C Block to reach C Block Gazebo.",
    puzzle: {
      type: "riddle",
      category: "Logic Riddle",
      question: "INTERCEPTED CREW RIDDLE — Read every line carefully before answering:\n\n\"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. Mountains bow to me in seconds. I repeat your every secret faithfully, yet I have no memory. What am I?\"\n\nEnter your single-word answer:",
      answer: "ECHO",
      hint: "I am produced when sound bounces off a surface. You can hear me in valleys and caves. I repeat what you say but I am not a recording."
    },
    acceptedAnswers: ["echo", "ECHO", "Echo", "an echo"],
    decoyPuzzle: {
      question: "Count the number of steel hexagonal bolts securing the C Block Gazebo canopy braces.",
      type: "number",
      hint: "Look under the roof eaves."
    }
  },

  // ── STATION 5 ──────────────────────────────────────────────────
  {
    id: "ablock-seating",
    order: 5,
    name: "A Block Seating",
    shortName: "A Seating",
    coords: { x: 92.5, y: 32.3 },
    token: "AS312P5",
    clue: "Head northeast to the curved open-air amphitheater benches outside A Block.",
    puzzle: {
      type: "sudoku",
      category: "Mini Sudoku (4×4)",
      // Harder partial grid — fewer givens (only 4 given out of 16)
      // Unique solution:
      //   Row 0: 3  1  4  2   ← ANSWER ROW (top)
      //   Row 1: 4  2  3  1
      //   Row 2: 2  4  1  3
      //   Row 3: 1  3  2  4
      // Given (null = blank):
      //   Row 0: [null, 1, null, null]
      //   Row 1: [null, null, 3, null]
      //   Row 2: [null, 4, null, null]
      //   Row 3: [1, null, null, 4]
      question: "REACTOR CORE SEQUENCE — WARNING: This Sudoku has only 4 pre-filled cells. Every row, column, and 2×2 box must contain digits 1, 2, 3, 4 — no repeats. Solve the ENTIRE grid, then enter the TOP ROW as a 4-digit code, left to right:",
      givenGrid: [
        [null, 1,    null, null],
        [null, null, 3,    null],
        [null, 4,    null, null],
        [1,    null, null, 4   ]
      ],
      answer: "3142",
      hint: "Start with the bottom-left 2×2 box: it has 1 and 4, so the other two must be 2 and 3. Column 1 already has 1 and 4 — use that to deduce row 3, col 1."
    },
    acceptedAnswers: ["3142", "3 1 4 2", "3,1,4,2", "3-1-4-2"],
    decoyPuzzle: {
      question: "Transcribe the 5-digit room code on the ground-floor faculty door facing the A Block benches.",
      type: "text",
      hint: "Check through the glass door window."
    }
  },

  // ── STATION 6 (FINAL) ──────────────────────────────────────────
  {
    id: "mess-1-floor",
    order: 6,
    name: "Mess 1st Floor",
    shortName: "Mess 1 Floor",
    coords: { x: 51.0, y: 27.1 },
    token: "MF904R6",
    clue: "Final Station! Reach the Mess & Cafeteria (1st Floor dining hall).",
    puzzle: {
      type: "anagram",
      category: "Final Anagram",
      // Harder: 10-letter anagram, more misleading
      // Word: CONSPIRACY (10 letters)
      // Scrambled: S P I R A C Y O N C
      question: "FINAL EXTRACTION PROTOCOL — Your mission data has been encrypted with the last keyword. Someone planned this from the very beginning. Unscramble all 10 letters below into a single English word that describes what the Impostor was running all along. Enter the word to complete your mission:",
      scrambledLetters: ["S","P","I","R","A","C","Y","O","N","C"],
      answer: "CONSPIRACY",
      hint: "10 letters. It's a secret plan by a group of people to do something harmful or illegal. Think: the Impostor didn't work alone…"
    },
    acceptedAnswers: ["conspiracy", "CONSPIRACY", "Conspiracy"],
    decoyPuzzle: {
      question: "Enter the 8-digit fire extinguisher inspection seal code mounted beside the Mess hall stairs.",
      type: "text",
      hint: "Inspect the wall mount plate near the staircase."
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
