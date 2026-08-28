import { doc, getDoc, setDoc, serverTimestamp } from '../services/firebase';
import { db } from '../services/firebase';
import { Family, FamilyMember, Branch } from '../types';
import { maskMembers } from '../utils/privacy';

export interface PublicTreeSnapshot {
  family: Pick<Family, 'id' | 'name' | 'motto' | 'originCountry' | 'foundedYear'>;
  members: FamilyMember[];
  branches: Branch[];
  updatedAt: unknown;
}

export async function publishPublicTree(
  family: Family,
  members: FamilyMember[],
  branches: Branch[]
): Promise<void> {
  const maskedMembers = maskMembers(members, family.privacy, true);

  const snapshot: PublicTreeSnapshot = {
    family: {
      id: family.id,
      name: family.name,
      motto: family.motto,
      originCountry: family.originCountry,
      foundedYear: family.foundedYear,
    },
    members: maskedMembers,
    branches,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'publicTrees', family.id), snapshot);
}

export async function loadPublicTree(familyId: string): Promise<PublicTreeSnapshot | null> {
  const snapshot = await getDoc(doc(db, 'publicTrees', familyId));
  if (!snapshot.exists()) return null;
  return snapshot.data() as PublicTreeSnapshot;
}

export async function unpublishPublicTree(familyId: string): Promise<void> {
  await setDoc(doc(db, 'publicTrees', familyId), { unpublished: true }, { merge: true });
}
