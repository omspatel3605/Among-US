/**
 * AMONG US: PDEU CAMPUS TREASURE HUNT
 * Central Game Configuration & Locations
 */

// Firebase Configuration
// Replace with your Firebase Project credentials from https://console.firebase.google.com
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDEMO_REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "pdeu-amongus-hunt.firebaseapp.com",
  projectId: "pdeu-amongus-hunt",
  storageBucket: "pdeu-amongus-hunt.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Check if using demo/placeholder config
export const isDemoConfig = () => {
  return !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.includes("DEMO_REPLACE");
};

// Admin Dashboard Passcode
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
    coords: { x: 26.5, y: 68.0 },
    token: "OG842X1",
    clue: "Head south-west towards the Student Activity Centre lawn. Look for the octagonal canopy surrounded by lush gardens.",
    puzzle: {
      question: "How many perimeter support pillars hold up the OSAIL Gazebo roof? Multiply that count by 3, then add the number of stone benches inside.",
      type: "number",
      answer: "28", // (8 pillars * 3) + 4 benches
      hint: "Count the octagonal metal pillars around the outer edge first, then add the seating benches."
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
    shortName: "D Block Gazebo",
    coords: { x: 53.0, y: 62.5 },
    token: "DG519K2",
    clue: "Navigate east across the central spine towards D Block. Spot the sheltered pavilion facing the engineering corridor.",
    puzzle: {
      question: "Inspect the green electrical substation unit near D Block Gazebo. What is the 3-digit voltage hazard rating printed on the caution triangle?",
      type: "number",
      answer: "440",
      hint: "Look for the yellow high voltage lightning symbol on the metal panel."
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
    shortName: "C Block Gazebo",
    coords: { x: 74.0, y: 52.0 },
    token: "CG773M3",
    clue: "Move northward towards C Block courtyard. Find the shaded seating pavilion beside the chemistry / petroleum wing.",
    puzzle: {
      question: "What is the acronym of the international student technical chapter engraved on the commemorative pillar plaque? (All caps)",
      type: "text",
      answer: "SPE",
      hint: "Society of Petroleum Engineers..."
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
    shortName: "A Block Seating",
    coords: { x: 48.0, y: 38.0 },
    token: "AS312P4",
    clue: "Walk towards the iconic A Block academic building. Locate the open-air curved seating amphitheater outside the main atrium.",
    puzzle: {
      question: "The concrete benches outside A Block are arranged in arcs. How many total wooden slat bench sections exist along the inner circular arc?",
      type: "number",
      answer: "12",
      hint: "Walk along the inner ring from left to right."
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
    name: "Ness 1 Float",
    shortName: "Ness 1 Float",
    coords: { x: 22.0, y: 30.5 },
    token: "NF904R5",
    clue: "Proceed west toward the high-rise student residence zone. Locate the Ness 1 architectural canopy float structure.",
    puzzle: {
      question: "Examine the dedication marker plaque at the base of the Ness 1 Float installation. What 4-digit year is inscribed?",
      type: "number",
      answer: "2019",
      hint: "The metallic plaque is mounted near the foundation support."
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
    name: "Gemini Stage",
    shortName: "Gemini Stage",
    coords: { x: 52.0, y: 16.0 },
    token: "GS661Z6",
    clue: "Final Station! Reach the grand Gemini Amphitheatre Stage. This is the ship's navigation hub.",
    puzzle: {
      question: "Count the number of main overhead truss lighting mount clamps (8) PLUS the number of concrete access steps (10) leading onto the stage. Enter the sum:",
      type: "number",
      answer: "18",
      hint: "8 overhead spotlight clamps + 10 concrete steps = ?"
    },
    decoyPuzzle: {
      question: "Input the 6-character emergency broadcast serial code found on the backstage power distribution box.",
      type: "text",
      hint: "Behind the backstage wing."
    }
  }
];

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
