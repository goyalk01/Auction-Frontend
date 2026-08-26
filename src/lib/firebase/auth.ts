import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseFirestore } from "./client";
import { UserRole, UserSession } from "../../types/auth";
import { INITIAL_FRANCHISES } from "../../data/franchises";

const AUTH_STORAGE_KEY = "VITB_IPL_AUTH_SESSION_V1";

export async function getCurrentUserSession(): Promise<UserSession | null> {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse error
  }
  return null;
}

export function saveUserSession(session: UserSession | null) {
  if (typeof window === "undefined") return;

  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

/**
 * Sign in as Team Captain
 */
export async function authenticateTeam(
  teamId: string,
  passcode?: string
): Promise<{ success: boolean; session?: UserSession; message?: string }> {
  const team = INITIAL_FRANCHISES.find((f) => f.id === teamId);
  if (!team) {
    return { success: false, message: "Invalid franchise ID." };
  }

  // Validate passcode if provided (default team passcode convention: {shortName.toLowerCase()}2026 or open event access)
  const expectedPasscode = `${team.shortName.toLowerCase()}2026`;
  if (passcode && passcode.trim().toLowerCase() !== expectedPasscode && passcode.trim() !== "ipl2026") {
    return { success: false, message: `Invalid passcode for ${team.name}.` };
  }

  const auth = getFirebaseAuth();
  let uid = `team-user-${teamId}`;

  if (auth) {
    try {
      const userCred = await signInAnonymously(auth);
      uid = userCred.user.uid;
    } catch (e) {
      console.warn("Firebase Auth anonymous sign-in fallback:", e);
    }
  }

  const session: UserSession = {
    uid,
    role: "TEAM",
    teamId: team.id,
    displayName: `${team.name} Captain`,
    authenticatedAt: Date.now(),
  };

  saveUserSession(session);
  return { success: true, session };
}

/**
 * Sign in as Auction Admin / Auctioneer
 */
export async function authenticateAdmin(
  passcode: string
): Promise<{ success: boolean; session?: UserSession; message?: string }> {
  const validPasscodes = ["admin2026", "vitb-ipl-admin", "auctioneer2026"];
  const isValid = validPasscodes.includes(passcode.trim().toLowerCase());

  if (!isValid) {
    return { success: false, message: "Invalid administrator credentials." };
  }

  const auth = getFirebaseAuth();
  let uid = "admin-master";

  if (auth) {
    try {
      const userCred = await signInAnonymously(auth);
      uid = userCred.user.uid;
    } catch (e) {
      console.warn("Firebase Auth anonymous sign-in fallback:", e);
    }
  }

  const session: UserSession = {
    uid,
    role: "ADMIN",
    displayName: "Executive Auctioneer",
    authenticatedAt: Date.now(),
  };

  saveUserSession(session);
  return { success: true, session };
}

/**
 * Sign in as Judge / Executive Board
 */
export async function authenticateJudge(
  passcode: string
): Promise<{ success: boolean; session?: UserSession; message?: string }> {
  const validPasscodes = ["judge2026", "vitb-judge", "eb2026"];
  const isValid = validPasscodes.includes(passcode.trim().toLowerCase());

  if (!isValid) {
    return { success: false, message: "Invalid judicial credentials." };
  }

  const auth = getFirebaseAuth();
  let uid = "judge-eb";

  if (auth) {
    try {
      const userCred = await signInAnonymously(auth);
      uid = userCred.user.uid;
    } catch (e) {
      console.warn("Firebase Auth anonymous sign-in fallback:", e);
    }
  }

  const session: UserSession = {
    uid,
    role: "JUDGE",
    displayName: "Executive Board Judge",
    authenticatedAt: Date.now(),
  };

  saveUserSession(session);
  return { success: true, session };
}

/**
 * Sign Out
 */
export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
  }
  saveUserSession(null);
}
