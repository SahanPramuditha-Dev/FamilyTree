import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from '../services/firebase';
import { db } from '../services/firebase';
import {
  Family,
  FamilyMember,
  Branch,
  FamilyEvent,
  Photo,
  Album,
  Story,
  Document,
  ActivityLog,
  NotificationItem,
  FamilyUser,
  Invitation,
} from '../types';

export interface FamilyDataBundle {
  family: Family;
  members: FamilyMember[];
  branches: Branch[];
  events: FamilyEvent[];
  photos: Photo[];
  albums: Album[];
  stories: Story[];
  documents: Document[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  collaborators: FamilyUser[];
  invitations: Invitation[];
}

export function treeDocRef(userId: string, familyId: string) {
  return doc(db, 'users', userId, 'trees', familyId);
}

/**
 * Real-time subscription to the authoritative family tree document.
 * Reads instantly from native IndexedDB offline cache, and syncs live with cloud.
 */
export function subscribeFamilyTree(
  userId: string,
  familyId: string,
  onData: (bundle: FamilyDataBundle | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    treeDocRef(userId, familyId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
      } else {
        onData(snapshot.data() as FamilyDataBundle);
      }
    },
    (err) => {
      console.warn('Firestore subscription error (offline/permission):', err);
      onError?.(err);
    }
  );
}

/**
 * One-time read for initial or offline fallback.
 */
export async function loadFamilyTree(
  userId: string,
  familyId: string
): Promise<FamilyDataBundle | null> {
  const snapshot = await getDoc(treeDocRef(userId, familyId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as FamilyDataBundle;
}

/**
 * Recursively strips undefined values so Firestore setDoc never rejects with
 * "Unsupported field value: undefined".
 */
export function cleanDataForFirestore<T>(data: T): T {
  if (data === undefined) return null as any;
  if (data === null || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map(item => cleanDataForFirestore(item)) as any;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      result[key] = cleanDataForFirestore(value);
    }
  }
  return result as T;
}

/**
 * Saves or initializes the full family tree bundle.
 */
export async function saveFamilyTree(
  userId: string,
  bundle: FamilyDataBundle
): Promise<void> {
  const sanitized = cleanDataForFirestore(bundle);
  await setDoc(
    treeDocRef(userId, bundle.family.id),
    {
      ...sanitized,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Granular document field update — modifies only the altered collection (e.g. members, stories).
 * Eliminates full-tree rewrites for single-item mutations.
 */
export async function updateFamilyTreeFields(
  userId: string,
  familyId: string,
  updates: Partial<FamilyDataBundle>
): Promise<void> {
  const sanitized = cleanDataForFirestore(updates);
  await setDoc(
    treeDocRef(userId, familyId),
    {
      ...sanitized,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
