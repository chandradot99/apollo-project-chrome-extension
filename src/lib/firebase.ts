import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let firebaseInitializationError: Error | null = null;

const firebaseConfig = {
  apiKey: "AIzaSyCi43QYYbRvJ3tyTwSJdX9pfz2tP5e-E0s",
  authDomain: "role-auth-7bc43.firebaseapp.com",
  projectId: "role-auth-7bc43",
  storageBucket: "role-auth-7bc43.firebasestorage.app",
  messagingSenderId: "486228852542",
  appId: "1:486228852542:web:137666fc3411de4f5f366f",
  measurementId: "G-XP2Q64FLR5",
};

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e: any) {
  console.error("Firebase SDK initialization failed:", e);
  firebaseInitializationError = e;
  auth = undefined;
  db = undefined;
  storage = undefined;
}

const googleAuthProvider = new GoogleAuthProvider();
const functions = getFunctions(app);

// Chrome Extension specific auth methods
export const signInWithGoogleExtension = async (
  forceAccountSelection = false
): Promise<User | null> => {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }

  try {
    // Clear cache if forcing account selection
    if (forceAccountSelection) {
      await new Promise<void>((resolve) => {
        chrome.identity.getAuthToken({ interactive: false }, (token) => {
          if (token) {
            chrome.identity.removeCachedAuthToken({ token }, resolve);
          } else {
            resolve();
          }
        });
      });
    }

    const token = await new Promise<string>((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (token) {
          resolve(token);
        } else {
          reject(new Error("No token received"));
        }
      });
    });

    const credential = GoogleAuthProvider.credential(null, token);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

// src/lib/firebase.ts
export const signOutExtension = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Firebase auth not initialized");
  }

  try {
    // Step 1: Get the current cached token
    const token = await new Promise<string | null>((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        if (chrome.runtime.lastError) {
          console.log(
            "No cached token found:",
            chrome.runtime.lastError.message
          );
          resolve(null);
        } else {
          resolve(token || null);
        }
      });
    });

    // Step 2: Sign out from Firebase first
    await auth.signOut();

    // Step 3: Clear Chrome identity cache
    if (token) {
      await new Promise<void>((resolve) => {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          console.log("✅ Chrome auth token cleared");
          resolve();
        });
      });
    }

    // Step 4: Optional - Revoke the token completely (more thorough)
    if (token) {
      try {
        await fetch(
          `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
          {
            method: "POST",
          }
        );
        console.log("✅ Token revoked from Google");
      } catch (error) {
        console.log("Token revocation failed (non-critical):", error);
      }
    }
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

export {
  app,
  auth,
  db,
  storage,
  googleAuthProvider,
  firebaseInitializationError,
  functions,
};
