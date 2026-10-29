/**
 * AMONG US: PDEU CAMPUS TREASURE HUNT
 * Central Game Configuration, Locations, Scoring & Admin Credentials
 */

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyACNKAgM-0Zojv9S1aOLYuM1iQVJ4nSRSg",
  authDomain: "pdeu-amongus-hunt.firebaseapp.com",
  projectId: "pdeu-amongus-hunt",
  storageBucket: "pdeu-amongus-hunt.firebasestorage.app",
  messagingSenderId: "1082067419012",
  appId: "1:1082067419012:web:8a4e981d08295d4dd9e7d1",
  measurementId: "G-PP03420Q8T"
};

// Check if using demo/placeholder config
export const isDemoConfig = () => {
  return !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.includes("DEMO_REPLACE");
};

// Organizer / Admin Login Credentials (for walk-up event management)
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "pdeu@amongus2026"
};

// Legacy passcode fallback for quick unlock
export const ADMIN_PASSCODE = "pdeu2026";

// Scoring Parameters
export const SCORING = {
  baseline: 1000,
  minutePenalty: 1,
  wrongAttemptPenalty: 10,
  sabotagePenalty: 5,
  fastRecoveryBonus: 20, // bonus per glitch solved within 25 seconds (2-player teams)
  impostorEscapeBonus: 300, // Impostor gets 300 pts if unvoted
  impostorCaughtBonus: 100  // Impostor gets 100 pts if caught
};

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
    durationSeconds: 0, // Single use until consumed
    icon: "❌",
    color: "#ef4444",
    summary: "Traps the next puzzle attempt: falsely marks the team's first correct submission as 'INCORRECT' once."
  }
};

/**
 * 6 Fixed Sequential PDEU Campus Locations
 * Can be rearranged or extended here.
 * Coordinates are percentage (0-100%) on the campus map canvas.
 */
export const LOCATIONS = [
  {
    id: "osail-gazebo",
    order: 1,
    name: "OSAIL Gazebo",
    shortName: "OSAIL Gazebo",
    coords: { x: 46.5, y: 41.0 },
    token: "OG842X1",
    clue: "Head to the central Osail Gazebo pavilion beside the Cricket Ground and OSAIL Ground.",
    puzzle: {
      question: "Decode the next destination: walk east between the academic blocks to the gazebo under the tree grove. Enter its station name.",
      type: "text",
      answer: "D Block Gazebo",
      hint: "The answer is the name of the next gazebo."
    },
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
    token: "DG519K2",
    clue: "Head east between D Block and C Block. Locate D Gazebo shaded under the tree grove.",
    puzzle: {
      question: "Decode the next destination: find the gazebo inside the inner courtyard near the academic department entrance. Enter its station name.",
      type: "text",
      answer: "C Block Gazebo",
      hint: "The answer is the name of the next gazebo."
    },
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
    token: "CG773M3",
    clue: "Walk into the inner courtyard of C Block. Spot C Gazebo near the academic department entrance.",
    puzzle: {
      question: "Decode the next destination: travel northeast to the open curved amphitheater seating area outside A Block. Enter its station name.",
      type: "text",
      answer: "A Block Seating",
      hint: "The answer is the name of the next location."
    },
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
    token: "AS312P4",
    clue: "Proceed northeast towards A Block. Locate the open curved amphitheater seating area (A seating).",
    puzzle: {
      question: "Decode the next destination: head to the northern quad near the dining hall and find the canopy float. Enter its station name.",
      type: "text",
      answer: "Ness 1 Float (Mess)",
      hint: "The answer is the name of the next location."
    },
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
    coords: { x: 50.5, y: 21.5 },
    token: "NF904R5",
    clue: "Navigate to the northern quad near the dining hall. Spot the Mess / Ness 1 canopy structure.",
    puzzle: {
      question: "Decode the final destination: go south of D Block to the grand stage complex. Enter its station name.",
      type: "text",
      answer: "Gemini Stage (Germi)",
      hint: "The answer is the name of the final stage."
    },
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
    token: "GS661Z6",
    clue: "Final Station! Reach the grand Gemini Stage / Germi complex directly south of D Block.",
    puzzle: {
      question: "This is the final station. Enter FINISH to complete the campus route.",
      type: "text",
      answer: "FINISH",
      hint: "There is no next location after the final stage."
    },
    decoyPuzzle: {
      question: "Input the 6-character emergency broadcast serial code found on the backstage power distribution box.",
      type: "text",
      hint: "Behind the backstage wing."
    }
  }
];

// Generate 6-letter Among Us style room code (e.g. "SKELDX")
export function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // No I, O to prevent confusion
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

// Helper: Normalize answer strings for comparison
export function isAnswerCorrect(userAnswer, correctAnswer) {
  if (userAnswer === undefined || userAnswer === null || correctAnswer === undefined || correctAnswer === null) {
    return false;
  }
  const cleanUser = String(userAnswer).trim().toLowerCase();
  const cleanTarget = String(correctAnswer).trim().toLowerCase();
  return cleanUser === cleanTarget;
}
