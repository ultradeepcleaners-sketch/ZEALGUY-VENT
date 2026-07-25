import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { initializeFirestore, doc, getDocFromServer, setLogLevel } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Set Firestore log level to error to prevent verbose connection retry logs
setLogLevel("error");

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific databaseId provisioned by the platform with auto-detect long polling
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Operational Enums for Error Tracking
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write"
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Handle Firestore Error by throwing structured, diagnosable JSON.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  let authInfo = {
    userId: null as string | null,
    email: null as string | null,
    emailVerified: null as boolean | null,
    isAnonymous: null as boolean | null,
    tenantId: null as string | null,
    providerInfo: [] as any[]
  };

  try {
    if (auth && auth.currentUser) {
      authInfo = {
        userId: auth.currentUser.uid || null,
        email: auth.currentUser.email || null,
        emailVerified: auth.currentUser.emailVerified || null,
        isAnonymous: auth.currentUser.isAnonymous || null,
        tenantId: auth.currentUser.tenantId || null,
        providerInfo: auth.currentUser.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      };
    }
  } catch (e) {
    console.warn("Could not read currentUser details during error generation", e);
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo,
    operationType,
    path
  };
  console.error("Firestore Error Detailed Object: ", JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// Quietly test connection on load as required by Firestore integration best practices
async function testConnection() {
  try {
    const fetchDoc = getDocFromServer(doc(db, "test", "connection"));
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("connection timeout")), 3000)
    );
    await Promise.race([fetchDoc, timeout]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("the client is offline") || error.message.includes("connection timeout")) {
        console.warn("Firestore running in resilient offline/polling mode:", error.message);
      }
    }
  }
}

testConnection();

// Get or create a persistent simulated client ID for dashboard tracing when Firebase Auth anonymous sign-in is disabled/restricted
function getSimulatedClientId(): string {
  let simulatedId = localStorage.getItem("zealguy_simulated_client_id");
  if (!simulatedId) {
    simulatedId = "client_sim_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("zealguy_simulated_client_id", simulatedId);
  }
  return simulatedId;
}

// Auto-authenticate anonymously if no active user session exists, to secure database telemetry and chat streams
export function ensureAnonymousSession(onUserReady?: (user: { uid: string }) => void) {
  try {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Active Firebase Auth Session Verified:", user.uid);
        if (onUserReady) onUserReady(user);
      } else {
        console.log("No active session. Initiating dynamic anonymous session...");
        signInAnonymously(auth)
          .then((cred) => {
            console.log("Anonymous session successfully provisioned:", cred.user.uid);
            if (onUserReady) onUserReady(cred.user);
          })
          .catch((err: any) => {
            console.warn("Failed to provision anonymous Firebase session (likely disabled/restricted in console). Falling back to safe simulated user ID.", err.message);
            if (onUserReady) {
              onUserReady({ uid: getSimulatedClientId() });
            }
          });
      }
    });
  } catch (outerErr: any) {
    console.warn("Failed to set up Firebase auth listener. Falling back to safe simulated user ID.", outerErr.message);
    if (onUserReady) {
      onUserReady({ uid: getSimulatedClientId() });
    }
  }
}
