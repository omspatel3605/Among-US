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
      question: "STATION INTEL RECOVERED: A 3×3 letter grid was found pinned to the OSAIL notice board. Three things you'd find near a research station — one place, one part, one problem. Read each row left-to-right and write all three row-words together with no spaces:",
      // Grid: LAB / ARM / BUG — shown as-is, NO answer shown elsewhere
      grid: [
        ["L","A","B"],
        ["A","R","M"],
        ["B","U","G"]
      ],
      answer: "LABARMBUG",
      hint: "Row 1 is a place where science happens. Row 2 is a body part. Row 3 is an annoying tiny creature. Smash all three together!"
    },
    acceptedAnswers: ["labarmbug", "lab arm bug", "lab-arm-bug", "labrarmbug"],
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
      category: "Caesar Cipher (Shift −3)",
      // Ciphertext: "WUHDVXUH LV DW WKH JD]HER" decrypts to "TREASURE IS AT THE GAZEBO"
      // Answer is the FIRST decoded word only — TREASURE
      question: "ENCRYPTED CREW DISTRESS MESSAGE intercepted at D Block Gazebo. Julius Caesar always shifted his letters by 3. Shift each letter BACK 3 places (D→A, E→B, F→C…). Decode the first word of the message and enter it as your answer:",
      cipherText: "WUHDVXUH LV DW WKH JD]HER",
      shiftHint: "Shift each letter back by 3  |  D→A  E→B  F→C  G→D  H→E …  Z→W",
      answer: "TREASURE",
      hint: "W goes back 3 → T. U→R. H→E. D→A. V→S. X→U. U→R. H→E. What 8-letter word does that spell?"
    },
    acceptedAnswers: [
      "treasure", "TREASURE", "Treasure",
      "treasure is at the gazebo", "treasureisatthegazebo"
    ],
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
      category: "Mini KenKen (3×3)",
      // Solved grid:
      //   Row 0:  1  2  3
      //   Row 1:  2  3  1   ← ANSWER ROW (middle)
      //   Row 2:  3  1  2
      // Cages (no filled values shown in visual):
      //   A: (0,0)+(0,1) sum=3  → "3+"
      //   B: (0,2) single=3    → "3"
      //   C: (1,0)+(2,0) product=6 → "6×"
      //   D: (1,1)+(1,2) sum=4 → "4+"
      //   E: (2,1)+(2,2) sum=3 → "3+"
      question: "OXYGEN RECYCLER LOCK: Fill this 3×3 KenKen using only the digits 1, 2, 3 — no digit may repeat in any row or column. Each outlined cage shows a target value and operation in its top-left corner. Solve the full grid, then enter the MIDDLE ROW (Row 2) as a 3-digit code, left to right:",
      // Cage map by cell [row][col]:
      //  (0,0) → cage A "3+"   (0,1) → cage A      (0,2) → cage B "3"
      //  (1,0) → cage C "6×"  (1,1) → cage D "4+"  (1,2) → cage D
      //  (2,0) → cage C        (2,1) → cage E "3+"  (2,2) → cage E
      cageMap: [
        ["A","A","B"],
        ["C","D","D"],
        ["C","E","E"]
      ],
      cageLabels: { A:"3+", B:"3", C:"6×", D:"4+", E:"3+" },
      answer: "231",
      hint: "Cage B (top-right single cell) = 3. Cage A (3+) shares with that row, so the pair is 1+2. Cage C (6×) is 2×3. Work from there!"
    },
    acceptedAnswers: ["231", "2 3 1", "2,3,1", "2-3-1"],
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
      category: "Lateral Riddle",
      question: "INTERCEPTED CREW RIDDLE: Read carefully and answer with a single word.\n\n\"I have a map but no land, a crew but no ship, tasks but no hands. Wherever I'm opened, someone's always watching — but I never speak, I only show. What am I?\"",
      answer: "SCREEN",
      hint: "You're literally holding the answer right now — it's the surface between your face and the game."
    },
    acceptedAnswers: [
      "screen", "phone screen", "phone", "display", "phonescreen"
    ],
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
      // Partial grid given (null = blank):
      //   Row 0: [1, ?, ?, 4]
      //   Row 1: [?, 4, 1, ?]
      //   Row 2: [?, 1, 4, ?]
      //   Row 3: [4, ?, ?, 1]
      // Unique solution:
      //   Row 0: 1 3 2 4   ← ANSWER ROW (top)
      //   Row 1: 2 4 1 3
      //   Row 2: 3 1 4 2
      //   Row 3: 4 2 3 1
      question: "REACTOR CORE SEQUENCE: Complete this 4×4 Sudoku. Every row, column, and 2×2 box must contain the digits 1, 2, 3, 4 — no repeats. Solve the full grid, then enter the TOP ROW as a 4-digit code, left to right:",
      givenGrid: [
        [1,    null, null, 4   ],
        [null, 4,    1,    null],
        [null, 1,    4,    null],
        [4,    null, null, 1   ]
      ],
      answer: "1324",
      hint: "Look at the top-left 2×2 box: it has 1 and 4, so the other two cells need 2 and 3. Column constraints will tell you which order."
    },
    acceptedAnswers: ["1324", "1 3 2 4", "1,3,2,4", "1-3-2-4"],
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
      // Scrambled letters of IMPOSTOR: R T S P O M I O
      // shown as tiles — NEVER display the answer word anywhere
      question: "FINAL EXTRACTION PROTOCOL: Someone on your team has been lying all day. Rearrange these 8 scrambled letters to reveal what they are called. Enter the unscrambled word to log your team's mission completion:",
      scrambledLetters: ["R","T","S","P","O","M","I","O"],
      answer: "IMPOSTOR",
      hint: "8 letters. They've been sabotaging your crew this whole hunt. It's a word you've seen in this game before…"
    },
    acceptedAnswers: ["impostor", "imposter", "IMPOSTOR", "IMPOSTER"],
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
