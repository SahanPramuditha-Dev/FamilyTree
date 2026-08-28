import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  RelationshipType,
  Role,
  LocationDetails,
  MigrationEvent
} from '../types';
import { parseLegacyLocation } from '../utils/locationResolver';
import { 
  DEFAULT_BLANK_FAMILY, 
  INITIAL_MEMBERS, 
  INITIAL_BRANCHES, 
  INITIAL_EVENTS, 
  INITIAL_PHOTOS, 
  INITIAL_ALBUMS, 
  INITIAL_STORIES, 
  INITIAL_DOCUMENTS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_COLLABORATORS 
} from '../data/initialData';
import { useAuth } from './AuthContext';
import { 
  subscribeFamilyTree, 
  saveFamilyTree, 
  updateFamilyTreeFields, 
  type FamilyDataBundle 
} from '../services/familyFirestore';
import { unpublishPublicTree } from '../services/publicTreeFirestore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Builds a sensible blank family for a new authenticated user profile. */
function buildBlankFamilyForUser(uid: string, displayName: string | null | undefined): Family {
  const name = displayName?.trim() ? `${displayName.trim()}'s Family Tree` : 'My Family Tree';
  return {
    ...DEFAULT_BLANK_FAMILY,
    id: `fam-${uid}`,
    name,
    ownerId: uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export interface OnboardingTreePayload {
  familyName: string;
  familyOrigin: string;
  familyMotto?: string;
  isPublic?: boolean;
  self: {
    firstName: string;
    lastName: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
    birthPlace?: string;
  };
  father?: { firstName: string; lastName: string };
  mother?: { firstName: string; lastName: string };
  spouse?: { firstName: string; lastName: string };
  child?: { firstName: string; lastName: string };
}

/**
 * Ensures relationship integrity (bidirectional links and generation ordering).
 */
export function normalizeFamilyMembers(membersList: FamilyMember[]): FamilyMember[] {
  const memberMap = new Map<string, FamilyMember>();
  membersList.forEach(m => {
    memberMap.set(m.id, {
      ...m,
      parentIds: Array.isArray(m.parentIds) ? [...m.parentIds] : [],
      childIds: Array.isArray(m.childIds) ? [...m.childIds] : [],
      spouseIds: Array.isArray(m.spouseIds) ? [...m.spouseIds] : [],
      siblingIds: Array.isArray(m.siblingIds) ? [...m.siblingIds] : [],
    });
  });

  memberMap.forEach((member, id) => {
    member.parentIds.forEach(pId => {
      const parent = memberMap.get(pId);
      if (parent && !parent.childIds.includes(id)) {
        parent.childIds.push(id);
      }
    });

    member.childIds.forEach(cId => {
      const child = memberMap.get(cId);
      if (child && !child.parentIds.includes(id)) {
        child.parentIds.push(id);
      }
    });

    member.spouseIds.forEach(sId => {
      const spouse = memberMap.get(sId);
      if (spouse && !spouse.spouseIds.includes(id)) {
        spouse.spouseIds.push(id);
      }
    });

    if (member.parentIds.length >= 2) {
      const [p1Id, p2Id] = member.parentIds;
      const p1 = memberMap.get(p1Id);
      const p2 = memberMap.get(p2Id);
      if (p1 && p2) {
        if (!p1.spouseIds.includes(p2Id)) p1.spouseIds.push(p2Id);
        if (!p2.spouseIds.includes(p1Id)) p2.spouseIds.push(p1Id);
      }
    }
  });

  // Synchronize siblings among all children of the same parents and ensure bidirectional links
  memberMap.forEach((member, id) => {
    // 1. Derive siblings from shared parents' children
    member.parentIds.forEach(pId => {
      const parent = memberMap.get(pId);
      if (parent) {
        parent.childIds.forEach(siblingId => {
          if (siblingId !== id && !member.siblingIds.includes(siblingId)) {
            member.siblingIds.push(siblingId);
          }
        });
      }
    });

    // 2. Ensure bidirectional sibling links
    member.siblingIds.forEach(sId => {
      const sib = memberMap.get(sId);
      if (sib && !sib.siblingIds.includes(id)) {
        sib.siblingIds.push(id);
      }
    });
  });

  const allList = Array.from(memberMap.values());
  const gen2List = allList.filter(m => m.generation === 2);
  const gen3List = allList.filter(m => m.generation === 3);

  if (gen2List.length > 0 && gen3List.length > 0) {
    gen3List.forEach(child => {
      if (child.parentIds.length === 0) {
        gen2List.forEach(parent => {
          if (!child.parentIds.includes(parent.id)) child.parentIds.push(parent.id);
          if (!parent.childIds.includes(child.id)) parent.childIds.push(child.id);
        });
      }
    });

    const gen2Male = gen2List.find(m => m.gender === 'male');
    const gen2Female = gen2List.find(m => m.gender === 'female');
    if (gen2Male && gen2Female) {
      if (!gen2Male.spouseIds.includes(gen2Female.id)) gen2Male.spouseIds.push(gen2Female.id);
      if (!gen2Female.spouseIds.includes(gen2Male.id)) gen2Female.spouseIds.push(gen2Male.id);
    }
  }

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 10) {
    changed = false;
    iterations++;
    memberMap.forEach((member) => {
      member.parentIds.forEach(pId => {
        const parent = memberMap.get(pId);
        if (parent) {
          const parentGen = parent.generation || 1;
          const currentChildGen = member.generation || 1;
          if (currentChildGen <= parentGen) {
            member.generation = parentGen + 1;
            changed = true;
          }
        }
      });
    });
  }

  return Array.from(memberMap.values());
}

interface FamilyContextType {
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
  
  // Member actions
  addMember: (memberData: Omit<FamilyMember, 'id' | 'familyId' | 'createdAt' | 'updatedAt' | 'parentIds' | 'spouseIds' | 'childIds' | 'siblingIds'>, relationshipTargetId?: string, relationType?: RelationshipType) => FamilyMember;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => FamilyMember | undefined;
  linkExistingMembers: (targetId: string, relativeId: string, relationType: RelationshipType) => void;
  addMigration: (memberId: string, event: MigrationEvent) => void;
  deleteMigration: (memberId: string, eventId: string) => void;

  addBranch: (branchData: Omit<Branch, 'id' | 'familyId' | 'createdAt'>) => Branch;
  updateBranch: (id: string, updates: Partial<Branch>) => void;

  addEvent: (eventData: Omit<FamilyEvent, 'id' | 'familyId' | 'createdAt'>) => FamilyEvent;
  rsvpEvent: (eventId: string, memberId: string, status: 'attending' | 'declined' | 'maybe') => void;

  addPhoto: (photoData: Omit<Photo, 'id' | 'familyId' | 'uploadedAt' | 'likes' | 'comments'>) => Photo;
  likePhoto: (photoId: string) => void;
  addPhotoComment: (photoId: string, text: string) => void;
  addAlbum: (name: string, description?: string, coverPhotoUrl?: string) => Album;

  addStory: (storyData: Omit<Story, 'id' | 'familyId' | 'likes' | 'comments'>) => Story;
  updateStory: (id: string, updates: Partial<Story>) => void;
  likeStory: (storyId: string) => void;
  addStoryComment: (storyId: string, text: string) => void;

  addDocument: (docData: Omit<Document, 'id' | 'familyId' | 'uploadedAt'>) => Document;
  deleteDocument: (id: string) => void;

  createInvitation: (email: string, role: FamilyUser['role']) => Invitation;
  acceptInvitation: (options: { token?: string; role?: Role; familyId?: string }) => { success: boolean; message: string };
  updateCollaboratorRole: (collaboratorId: string, newRole: FamilyUser['role']) => void;
  removeCollaborator: (collaboratorId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateFamilySettings: (updates: Partial<Family>) => void;
  unpublishTree: () => Promise<void>;
  createNewBlankFamily: (name: string, country?: string, motto?: string) => void;
  clearAllMembers: () => void;
  resetToSampleData: () => void;
  importTreeData: (importedMembers: FamilyMember[], importedFamily?: Partial<Family>) => void;
  initializeOnboardingTree: (payload: OnboardingTreePayload) => void;

  cloudReady: boolean;
  isCloudLoading: boolean;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, firebaseUser, isDemoUser, loading: authLoading } = useAuth();
  
  const [cloudReady, setCloudReady] = useState(false);
  const [isCloudLoading, setIsCloudLoading] = useState(true);

  const [family, setFamily] = useState<Family>(DEFAULT_BLANK_FAMILY);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [collaborators, setCollaborators] = useState<FamilyUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const authUid = firebaseUser?.uid || user?.uid || null;

  useEffect(() => {
    if (authLoading) return;

    if (isDemoUser) {
      setFamily(DEFAULT_BLANK_FAMILY);
      setMembers(INITIAL_MEMBERS);
      setBranches(INITIAL_BRANCHES);
      setEvents(INITIAL_EVENTS);
      setPhotos(INITIAL_PHOTOS);
      setAlbums(INITIAL_ALBUMS);
      setStories(INITIAL_STORIES);
      setDocuments(INITIAL_DOCUMENTS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setCollaborators(INITIAL_COLLABORATORS);
      setInvitations([]);
      setCloudReady(true);
      setIsCloudLoading(false);
      return;
    }

    if (!authUid) {
      setFamily(DEFAULT_BLANK_FAMILY);
      setMembers([]);
      setBranches([]);
      setEvents([]);
      setPhotos([]);
      setAlbums([]);
      setStories([]);
      setDocuments([]);
      setActivityLogs([]);
      setNotifications([]);
      setCollaborators([]);
      setInvitations([]);
      setCloudReady(false);
      setIsCloudLoading(false);
      return;
    }

    if (authUid.startsWith('demo-')) {
      setCloudReady(false);
      setIsCloudLoading(false);
      return;
    }

    setIsCloudLoading(true);
    const familyId = `fam-${authUid}`;

    const unsubscribe = subscribeFamilyTree(
      authUid,
      familyId,
      (bundle) => {
        if (bundle && bundle.family) {
          setFamily(bundle.family);
          const loadedMembers = normalizeFamilyMembers(bundle.members || []);
          let loadedBranches = Array.isArray(bundle.branches) ? bundle.branches : [];

          // Auto-provision a default Main Branch if members exist but no branch was ever created
          if (loadedBranches.length === 0 && loadedMembers.length > 0) {
            const rootMember = loadedMembers.find(m => (m.parentIds || []).length === 0) || loadedMembers[0];
            const defaultBranchId = `branch-${bundle.family.id}-main`;
            const cleanName = bundle.family.name
              ? bundle.family.name.replace(/Family Tree|Family Lineage/i, '').trim()
              : '';
            const defaultBranch: Branch = {
              id: defaultBranchId,
              familyId: bundle.family.id,
              name: cleanName ? `${cleanName} Main Branch` : 'Main Family Branch',
              color: '#059669',
              description: 'Primary ancestral lineage and core family branch.',
              originLocation: bundle.family.originCountry || 'Ancestral Homeland',
              leaderMemberId: rootMember?.id,
              createdAt: new Date().toISOString()
            };
            loadedBranches = [defaultBranch];
            const updatedMembers = loadedMembers.map(m => m.branchId ? m : { ...m, branchId: defaultBranch.id });
            setMembers(updatedMembers);
            setBranches(loadedBranches);
            if (authUid && !isDemoUser) {
              updateFamilyTreeFields(authUid, bundle.family.id, {
                branches: loadedBranches,
                members: updatedMembers
              }).catch(e => console.warn('Auto-sync default branch error:', e));
            }
          } else {
            setMembers(loadedMembers);
            setBranches(loadedBranches);
          }
          setEvents(Array.isArray(bundle.events) ? bundle.events : []);
          setPhotos(Array.isArray(bundle.photos) ? bundle.photos : []);
          setAlbums(Array.isArray(bundle.albums) ? bundle.albums : []);
          setStories(Array.isArray(bundle.stories) ? bundle.stories : []);
          setDocuments(Array.isArray(bundle.documents) ? bundle.documents : []);
          setActivityLogs(Array.isArray(bundle.activityLogs) ? bundle.activityLogs : []);
          setNotifications(Array.isArray(bundle.notifications) ? bundle.notifications : []);
          setCollaborators(Array.isArray(bundle.collaborators) ? bundle.collaborators : []);
          setInvitations(Array.isArray(bundle.invitations) ? bundle.invitations : []);
        } else {
          const blankFamily = buildBlankFamilyForUser(authUid, user?.displayName || firebaseUser?.displayName);
          setFamily(blankFamily);
          setMembers([]);
          setBranches([]);
          setEvents([]);
          setPhotos([]);
          setAlbums([]);
          setStories([]);
          setDocuments([]);
          setActivityLogs([]);
          setNotifications([]);
          setCollaborators([]);
          setInvitations([]);
        }

        setCloudReady(true);
        setIsCloudLoading(false);
      },
      (err) => {
        console.warn('Firestore subscription status:', err);
        setCloudReady(true);
        setIsCloudLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authUid, isDemoUser, authLoading]);

  const syncField = useCallback(<K extends keyof FamilyDataBundle>(field: K, value: FamilyDataBundle[K]) => {
    const currentUid = firebaseUser?.uid || user?.uid;
    if (!currentUid || isDemoUser || currentUid.startsWith('demo-')) return;
    const familyId = family.id || `fam-${currentUid}`;
    updateFamilyTreeFields(currentUid, familyId, { [field]: value }).catch((err) => {
      console.warn(`Firestore sync error for ${field}:`, err);
    });
  }, [firebaseUser?.uid, user?.uid, isDemoUser, family.id]);

  const logActivity = (action: ActivityLog['action'], targetType: ActivityLog['targetType'], targetName: string, targetId?: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      familyId: family.id,
      userId: user?.uid || 'user-active',
      userName: user?.displayName || 'Family Historian',
      userAvatar: user?.photoURL,
      action,
      targetType,
      targetName,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => {
      const next = [newLog, ...prev];
      syncField('activityLogs', next);
      return next;
    });
  };

  const getMember = (id: string) => members.find(m => m.id === id);

  const addMember = (
    memberData: Omit<FamilyMember, 'id' | 'familyId' | 'createdAt' | 'updatedAt' | 'parentIds' | 'spouseIds' | 'childIds' | 'siblingIds'>,
    relationshipTargetId?: string,
    relationType?: RelationshipType
  ): FamilyMember => {
    const newId = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let parentIds: string[] = [];
    let spouseIds: string[] = [];
    let childIds: string[] = [];
    let siblingIds: string[] = [];
    let generation = memberData.generation || 3;

    if (relationshipTargetId && relationType) {
      const target = members.find(m => m.id === relationshipTargetId);
      if (target) {
        if (relationType === 'parent') {
          childIds.push(target.id);
          generation = Math.max((target.generation || 2) - 1, 1);
          if (target.parentIds.length > 0) {
            spouseIds = [...target.parentIds];
          }
        } else if (relationType === 'child') {
          parentIds.push(target.id);
          generation = (target.generation || 2) + 1;
          if (target.spouseIds.length > 0) {
            parentIds.push(...target.spouseIds);
          }
        } else if (relationType === 'spouse' || relationType === 'partner') {
          spouseIds.push(target.id);
          generation = target.generation;
        } else if (relationType === 'sibling') {
          siblingIds.push(target.id);
          parentIds = [...target.parentIds];
          generation = target.generation;
        }
      }
    }

    const newMember: FamilyMember = {
      ...memberData,
      id: newId,
      familyId: family.id,
      parentIds,
      spouseIds,
      childIds,
      siblingIds,
      generation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMembers(prev => {
      const updated = prev.map(m => {
        if (relationshipTargetId && m.id === relationshipTargetId) {
          if (relationType === 'parent') return { ...m, parentIds: [...new Set([...m.parentIds, newId])] };
          if (relationType === 'child') return { ...m, childIds: [...new Set([...m.childIds, newId])] };
          if (relationType === 'spouse' || relationType === 'partner') return { ...m, spouseIds: [...new Set([...m.spouseIds, newId])] };
          if (relationType === 'sibling') return { ...m, siblingIds: [...new Set([...m.siblingIds, newId])] };
        }
        if (relationType === 'parent' && spouseIds.includes(m.id)) {
          return { ...m, spouseIds: [...new Set([...m.spouseIds, newId])] };
        }
        if (relationType === 'child' && parentIds.includes(m.id) && m.id !== relationshipTargetId) {
          return { ...m, childIds: [...new Set([...m.childIds, newId])] };
        }
        if (relationType === 'sibling' && m.id !== relationshipTargetId && siblingIds.includes(m.id)) {
          return { ...m, siblingIds: [...new Set([...m.siblingIds, newId])] };
        }
        return m;
      });
      const finalMembers = normalizeFamilyMembers([...updated, newMember]);
      syncField('members', finalMembers);
      return finalMembers;
    });

    logActivity('add_member', 'member', `${newMember.firstName} ${newMember.lastName}`, newId, `Added to Generation ${newMember.generation}`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
      const finalMembers = normalizeFamilyMembers(updated);
      syncField('members', finalMembers);
      return finalMembers;
    });
    const mem = getMember(id);
    if (mem) {
      logActivity('edit_member', 'member', `${mem.firstName} ${mem.lastName}`, id, 'Updated personal biography & vital records');
    }
  };

  const deleteMember = (id: string) => {
    const mem = getMember(id);
    setMembers(prev => {
      const updated = prev
        .filter(m => m.id !== id)
        .map(m => ({
          ...m,
          parentIds: m.parentIds.filter(pid => pid !== id),
          spouseIds: m.spouseIds.filter(sid => sid !== id),
          childIds: m.childIds.filter(cid => cid !== id),
          siblingIds: m.siblingIds.filter(sbid => sbid !== id),
          updatedAt: new Date().toISOString()
        }));
      const finalMembers = normalizeFamilyMembers(updated);
      syncField('members', finalMembers);
      return finalMembers;
    });
    if (mem) {
      logActivity('delete_member', 'member', `${mem.firstName} ${mem.lastName}`, id, 'Removed member from family tree');
    }
  };

  const linkExistingMembers = (targetId: string, relativeId: string, relationType: RelationshipType) => {
    if (!targetId || !relativeId || targetId === relativeId) return;
    const target = members.find(m => m.id === targetId);
    const relative = members.find(m => m.id === relativeId);
    if (!target || !relative) return;

    setMembers(prev => {
      const updated = prev.map(m => {
        if (m.id === targetId) {
          if (relationType === 'parent') return { ...m, parentIds: [...new Set([...m.parentIds, relativeId])], updatedAt: new Date().toISOString() };
          if (relationType === 'child') return { ...m, childIds: [...new Set([...m.childIds, relativeId])], updatedAt: new Date().toISOString() };
          if (relationType === 'spouse' || relationType === 'partner') return { ...m, spouseIds: [...new Set([...m.spouseIds, relativeId])], updatedAt: new Date().toISOString() };
          if (relationType === 'sibling') return { ...m, siblingIds: [...new Set([...m.siblingIds, relativeId])], updatedAt: new Date().toISOString() };
        }
        if (m.id === relativeId) {
          if (relationType === 'parent') return { ...m, childIds: [...new Set([...m.childIds, targetId])], updatedAt: new Date().toISOString() };
          if (relationType === 'child') return { ...m, parentIds: [...new Set([...m.parentIds, targetId])], updatedAt: new Date().toISOString() };
          if (relationType === 'spouse' || relationType === 'partner') return { ...m, spouseIds: [...new Set([...m.spouseIds, targetId])], updatedAt: new Date().toISOString() };
          if (relationType === 'sibling') return { ...m, siblingIds: [...new Set([...m.siblingIds, targetId])], updatedAt: new Date().toISOString() };
        }
        return m;
      });
      const finalMembers = normalizeFamilyMembers(updated);
      syncField('members', finalMembers);
      return finalMembers;
    });

    logActivity('edit_member', 'member', `${target.firstName} & ${relative.firstName}`, targetId, `Connected relationship: ${relationType}`);
  };

  const addMigration = (memberId: string, event: MigrationEvent) => {
    setMembers(prev => {
      const updated = prev.map(m => {
        if (m.id !== memberId) return m;
        const currentMigrations = Array.isArray(m.migrations) ? m.migrations : [];
        const exists = currentMigrations.some(e => e.id === event.id);
        const nextMigrations = exists
          ? currentMigrations.map(e => e.id === event.id ? event : e)
          : [...currentMigrations, event];

        return {
          ...m,
          currentLocation: event.toLocation.formatted,
          currentLocationDetails: event.toLocation,
          coordinates: [event.toLocation.latitude, event.toLocation.longitude] as [number, number],
          migrations: nextMigrations.sort((a, b) => (a.year || 0) - (b.year || 0)),
          updatedAt: new Date().toISOString()
        };
      });
      const finalMembers = normalizeFamilyMembers(updated);
      syncField('members', finalMembers);
      return finalMembers;
    });
    const mem = getMember(memberId);
    if (mem) {
      logActivity('edit_member', 'member', `${mem.firstName} ${mem.lastName}`, memberId, `Recorded relocation to ${event.toLocation.formatted} (${event.reason})`);
    }
  };

  const deleteMigration = (memberId: string, eventId: string) => {
    setMembers(prev => {
      const updated = prev.map(m => {
        if (m.id !== memberId) return m;
        const nextMigrations = (m.migrations || []).filter(e => e.id !== eventId);
        return {
          ...m,
          migrations: nextMigrations,
          updatedAt: new Date().toISOString()
        };
      });
      const finalMembers = normalizeFamilyMembers(updated);
      syncField('members', finalMembers);
      return finalMembers;
    });
  };

  const addBranch = (branchData: Omit<Branch, 'id' | 'familyId' | 'createdAt'>): Branch => {
    const newBranch: Branch = {
      ...branchData,
      id: `branch-${Date.now()}`,
      familyId: family.id,
      createdAt: new Date().toISOString()
    };
    setBranches(prev => {
      const next = [...prev, newBranch];
      syncField('branches', next);
      return next;
    });
    logActivity('edit_settings', 'family', newBranch.name, newBranch.id, 'Created new family branch');
    return newBranch;
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      syncField('branches', next);
      return next;
    });
  };

  const addEvent = (eventData: Omit<FamilyEvent, 'id' | 'familyId' | 'createdAt'>): FamilyEvent => {
    const newEvent: FamilyEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      familyId: family.id,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => {
      const next = [newEvent, ...prev];
      syncField('events', next);
      return next;
    });
    logActivity('add_event', 'event', newEvent.title, newEvent.id, `Date: ${newEvent.date}`);
    return newEvent;
  };

  const rsvpEvent = (eventId: string, memberId: string, status: 'attending' | 'declined' | 'maybe') => {
    const member = getMember(memberId) || { firstName: user?.displayName || 'Relative', lastName: '' };
    const memberName = `${member.firstName} ${member.lastName}`.trim();
    setEvents(prev => {
      const next = prev.map(ev => {
        if (ev.id !== eventId) return ev;
        const filtered = (ev.rsvps || []).filter(r => r.memberId !== memberId);
        return { ...ev, rsvps: [...filtered, { memberId, status, name: memberName }] };
      });
      syncField('events', next);
      return next;
    });
  };

  const addPhoto = (photoData: Omit<Photo, 'id' | 'familyId' | 'uploadedAt' | 'likes' | 'comments'>): Photo => {
    const newPhoto: Photo = {
      ...photoData,
      id: `pho-${Date.now()}`,
      familyId: family.id,
      uploadedAt: new Date().toISOString(),
      likes: [],
      comments: []
    };
    setPhotos(prev => {
      const next = [newPhoto, ...prev];
      syncField('photos', next);
      return next;
    });
    logActivity('add_photo', 'photo', newPhoto.title, newPhoto.id);
    return newPhoto;
  };

  const likePhoto = (photoId: string) => {
    const userId = user?.uid || 'user-active';
    setPhotos(prev => {
      const next = prev.map(p => {
        if (p.id !== photoId) return p;
        const hasLiked = p.likes.includes(userId);
        return { ...p, likes: hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
      });
      syncField('photos', next);
      return next;
    });
  };

  const addPhotoComment = (photoId: string, text: string) => {
    const comment = {
      id: `c-${Date.now()}`,
      userId: user?.uid || 'user-active',
      userName: user?.displayName || 'Family Historian',
      avatarUrl: user?.photoURL,
      text,
      createdAt: new Date().toISOString()
    };
    setPhotos(prev => {
      const next = prev.map(p => p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p);
      syncField('photos', next);
      return next;
    });
  };

  const addAlbum = (name: string, description?: string, coverPhotoUrl?: string): Album => {
    const newAlbum: Album = {
      id: `alb-${Date.now()}`,
      familyId: family.id,
      name,
      description,
      coverPhotoUrl: coverPhotoUrl || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
      photoCount: 0
    };
    setAlbums(prev => {
      const next = [...prev, newAlbum];
      syncField('albums', next);
      return next;
    });
    return newAlbum;
  };

  const addStory = (storyData: Omit<Story, 'id' | 'familyId' | 'likes' | 'comments'>): Story => {
    const newStory: Story = {
      ...storyData,
      id: `sto-${Date.now()}`,
      familyId: family.id,
      likes: [],
      comments: []
    };
    setStories(prev => {
      const next = [newStory, ...prev];
      syncField('stories', next);
      return next;
    });
    logActivity('create_story', 'story', newStory.title, newStory.id);
    return newStory;
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      syncField('stories', next);
      return next;
    });
  };

  const likeStory = (storyId: string) => {
    const userId = user?.uid || 'user-active';
    setStories(prev => {
      const next = prev.map(s => {
        if (s.id !== storyId) return s;
        const hasLiked = s.likes.includes(userId);
        return { ...s, likes: hasLiked ? s.likes.filter(id => id !== userId) : [...s.likes, userId] };
      });
      syncField('stories', next);
      return next;
    });
  };

  const addStoryComment = (storyId: string, text: string) => {
    const comment = {
      id: `sc-${Date.now()}`,
      userId: user?.uid || 'user-active',
      userName: user?.displayName || 'Family Historian',
      avatarUrl: user?.photoURL,
      text,
      createdAt: new Date().toISOString()
    };
    setStories(prev => {
      const next = prev.map(s => s.id === storyId ? { ...s, comments: [...s.comments, comment] } : s);
      syncField('stories', next);
      return next;
    });
  };

  const addDocument = (docData: Omit<Document, 'id' | 'familyId' | 'uploadedAt'>): Document => {
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now()}`,
      familyId: family.id,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => {
      const next = [newDoc, ...prev];
      syncField('documents', next);
      return next;
    });
    logActivity('upload_doc', 'document', newDoc.title, newDoc.id);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => {
      const next = prev.filter(d => d.id !== id);
      syncField('documents', next);
      return next;
    });
  };

  const createInvitation = (email: string, role: FamilyUser['role']): Invitation => {
    const newInvite: Invitation = {
      id: `inv-${Date.now()}`,
      familyId: family.id,
      familyName: family.name,
      email,
      role,
      invitedBy: user?.uid || 'user-active',
      invitedByName: user?.displayName || 'Family Administrator',
      token: `ft-invite-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    setInvitations(prev => {
      const next = [newInvite, ...prev];
      syncField('invitations', next);
      return next;
    });
    return newInvite;
  };

  const acceptInvitation = (options: { token?: string; role?: Role; familyId?: string }): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'You must be signed in to accept an invitation.' };
    const targetFamilyId = options.familyId || family.id;
    if (targetFamilyId !== family.id) return { success: false, message: 'Invalid family target.' };
    const existing = collaborators.find((c) => c.userId === user.uid || c.email.toLowerCase() === user.email.toLowerCase());
    if (existing) return { success: true, message: 'You already have access.' };

    let inviteRole: Role = options.role || 'contributor';
    if (options.token) {
      const invite = invitations.find((i) => i.token === options.token && i.status === 'pending');
      if (!invite) return { success: false, message: 'Invalid or expired link.' };
      inviteRole = invite.role;
      setInvitations((prev) => {
        const next = prev.map((i) => (i.token === options.token ? { ...i, status: 'accepted' as const } : i));
        syncField('invitations', next);
        return next;
      });
    }

    const newCollaborator: FamilyUser = {
      id: `collab-${Date.now()}`,
      familyId: family.id,
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      role: inviteRole,
      joinedAt: new Date().toISOString(),
    };

    setCollaborators((prev) => {
      const next = [...prev, newCollaborator];
      syncField('collaborators', next);
      return next;
    });
    logActivity('join_family', 'family', family.name, family.id, `Joined as ${inviteRole}`);
    return { success: true, message: 'Welcome to the family workspace!' };
  };

  const updateCollaboratorRole = (collaboratorId: string, newRole: FamilyUser['role']) => {
    setCollaborators(prev => {
      const next = prev.map(c => c.id === collaboratorId ? { ...c, role: newRole } : c);
      syncField('collaborators', next);
      return next;
    });
  };

  const removeCollaborator = (collaboratorId: string) => {
    setCollaborators(prev => {
      const next = prev.filter(c => c.id !== collaboratorId);
      syncField('collaborators', next);
      return next;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      syncField('notifications', next);
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, isRead: true }));
      syncField('notifications', next);
      return next;
    });
  };

  const updateFamilySettings = (updates: Partial<Family>) => {
    setFamily(prev => {
      const next = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      syncField('family', next);
      return next;
    });
    logActivity('edit_settings', 'family', updates.name || family.name, family.id, 'Updated family tree profile');
  };

  const createNewBlankFamily = (name: string, country: string = 'Global', motto: string = '') => {
    const currentUid = firebaseUser?.uid || user?.uid || 'user-active';
    const newFam: Family = {
      id: `fam-${currentUid}`,
      name,
      motto: motto || 'Preserving our roots for generations to come',
      description: `The heritage and lineage records of ${name}.`,
      originCountry: country,
      privacy: {
        isPublic: true,
        hideLivingMembers: false,
        hideSensitiveDates: false,
        allowSearchEngineIndexing: true,
        requireApprovalForEdits: false,
        photoVisibility: 'public',
        storyVisibility: 'public'
      },
      ownerId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const bundle: FamilyDataBundle = {
      family: newFam,
      members: [],
      branches: [],
      events: [],
      photos: [],
      albums: [],
      stories: [],
      documents: [],
      activityLogs: [{
        id: `act-${Date.now()}`,
        familyId: newFam.id,
        userId: currentUid,
        userName: user?.displayName || 'Family Historian',
        action: 'edit_settings',
        targetType: 'family',
        targetName: newFam.name,
        details: 'Initialized new family tree',
        timestamp: new Date().toISOString()
      }],
      notifications: [],
      collaborators: [],
      invitations: [],
    };

    setFamily(newFam);
    setMembers([]);
    setBranches([]);
    setEvents([]);
    setPhotos([]);
    setAlbums([]);
    setStories([]);
    setDocuments([]);
    setActivityLogs(bundle.activityLogs);

    if (firebaseUser && !isDemoUser) {
      saveFamilyTree(firebaseUser.uid, bundle).catch((err) => {
        console.warn('Save family error:', err);
      });
    }
  };

  const clearAllMembers = () => {
    setMembers([]);
    setBranches([]);
    setEvents([]);
    setPhotos([]);
    setAlbums([]);
    setStories([]);
    setDocuments([]);
    
    const currentUid = firebaseUser?.uid || user?.uid;
    if (currentUid && !isDemoUser) {
      updateFamilyTreeFields(currentUid, family.id, {
        members: [],
        branches: [],
        events: [],
        photos: [],
        albums: [],
        stories: [],
        documents: []
      }).catch(e => console.warn('Clear tree error:', e));
    }
  };

  const resetToSampleData = () => {
    if (!isDemoUser) return;
    setFamily(DEFAULT_BLANK_FAMILY);
    setMembers(INITIAL_MEMBERS);
    setBranches(INITIAL_BRANCHES);
    setEvents(INITIAL_EVENTS);
    setPhotos(INITIAL_PHOTOS);
    setAlbums(INITIAL_ALBUMS);
    setStories(INITIAL_STORIES);
    setDocuments(INITIAL_DOCUMENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCollaborators(INITIAL_COLLABORATORS);
  };

  const initializeOnboardingTree = (payload: OnboardingTreePayload) => {
    const currentUid = firebaseUser?.uid || user?.uid || 'user-active';
    const famId = `fam-${currentUid}`;

    const famOriginDetails = parseLegacyLocation(payload.familyOrigin, 'Sri Lanka');
    const selfBirthDetails = payload.self.birthPlace ? parseLegacyLocation(payload.self.birthPlace, payload.familyOrigin || 'Sri Lanka') : famOriginDetails;

    const newFamily: Family = {
      id: famId,
      name: payload.familyName.trim() || 'Our Family Lineage',
      motto: payload.familyMotto?.trim() || undefined,
      originCountry: famOriginDetails.countryName,
      originRegion: famOriginDetails.region || undefined,
      originLocationDetails: famOriginDetails,
      privacy: {
        isPublic: payload.isPublic ?? true,
        hideLivingMembers: false,
        hideSensitiveDates: false,
        allowSearchEngineIndexing: true,
        requireApprovalForEdits: false,
        photoVisibility: 'public',
        storyVisibility: 'public'
      },
      ownerId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newMembers: FamilyMember[] = [];
    const selfId = `mem-${Date.now()}-self`;
    const fatherId = payload.father?.firstName.trim() ? `mem-${Date.now()}-father` : null;
    const motherId = payload.mother?.firstName.trim() ? `mem-${Date.now()}-mother` : null;
    const spouseId = payload.spouse?.firstName.trim() ? `mem-${Date.now()}-spouse` : null;
    const childId = payload.child?.firstName.trim() ? `mem-${Date.now()}-child` : null;

    if (fatherId && payload.father) newMembers.push({ id: fatherId, familyId: famId, firstName: payload.father.firstName.trim(), lastName: payload.father.lastName.trim() || payload.self.lastName, gender: 'male', isLiving: true, generation: 2, birthPlace: famOriginDetails.formatted, birthPlaceDetails: famOriginDetails, currentLocation: famOriginDetails.formatted, currentLocationDetails: famOriginDetails, coordinates: [famOriginDetails.latitude, famOriginDetails.longitude], parentIds: [], spouseIds: motherId ? [motherId] : [], childIds: [selfId], siblingIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    if (motherId && payload.mother) newMembers.push({ id: motherId, familyId: famId, firstName: payload.mother.firstName.trim(), lastName: payload.mother.lastName.trim() || payload.self.lastName, gender: 'female', isLiving: true, generation: 2, birthPlace: famOriginDetails.formatted, birthPlaceDetails: famOriginDetails, currentLocation: famOriginDetails.formatted, currentLocationDetails: famOriginDetails, coordinates: [famOriginDetails.latitude, famOriginDetails.longitude], parentIds: [], spouseIds: fatherId ? [fatherId] : [], childIds: [selfId], siblingIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    newMembers.push({ 
      id: selfId, 
      familyId: famId, 
      firstName: payload.self.firstName.trim(), 
      lastName: payload.self.lastName.trim(), 
      gender: payload.self.gender || 'male', 
      birthDate: payload.self.birthDate || undefined,
      birthPlace: selfBirthDetails.formatted,
      birthPlaceDetails: selfBirthDetails,
      currentLocation: selfBirthDetails.formatted,
      currentLocationDetails: selfBirthDetails,
      coordinates: [selfBirthDetails.latitude, selfBirthDetails.longitude],
      isLiving: true, 
      generation: 3, 
      parentIds: [fatherId, motherId].filter(Boolean) as string[], 
      spouseIds: spouseId ? [spouseId] : [], 
      childIds: childId ? [childId] : [], 
      siblingIds: [], 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    });
    if (spouseId && payload.spouse) newMembers.push({ id: spouseId, familyId: famId, firstName: payload.spouse.firstName.trim(), lastName: payload.spouse.lastName.trim() || payload.self.lastName, gender: 'female', isLiving: true, generation: 3, birthPlace: famOriginDetails.formatted, birthPlaceDetails: famOriginDetails, currentLocation: famOriginDetails.formatted, currentLocationDetails: famOriginDetails, coordinates: [famOriginDetails.latitude, famOriginDetails.longitude], parentIds: [], spouseIds: [selfId], childIds: childId ? [childId] : [], siblingIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    if (childId && payload.child) newMembers.push({ id: childId, familyId: famId, firstName: payload.child.firstName.trim(), lastName: payload.child.lastName.trim() || payload.self.lastName, gender: 'other', isLiving: true, generation: 4, birthPlace: selfBirthDetails.formatted, birthPlaceDetails: selfBirthDetails, currentLocation: selfBirthDetails.formatted, currentLocationDetails: selfBirthDetails, coordinates: [selfBirthDetails.latitude, selfBirthDetails.longitude], parentIds: [selfId, spouseId].filter(Boolean) as string[], spouseIds: [], childIds: [], siblingIds: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

    const mainBranchId = `branch-${famId}-main`;
    const cleanFamName = payload.familyName.replace(/Family Tree|Family Lineage/i, '').trim() || payload.self.lastName || 'Main';
    const defaultBranch: Branch = {
      id: mainBranchId,
      familyId: famId,
      name: `${cleanFamName} Main Branch`,
      color: '#059669',
      description: 'Primary ancestral lineage and core family branch.',
      originLocation: famOriginDetails.formatted || payload.familyOrigin || 'Ancestral Homeland',
      leaderMemberId: fatherId || selfId,
      createdAt: new Date().toISOString(),
    };

    // Assign branchId to all newly onboarded members
    newMembers.forEach(m => {
      m.branchId = mainBranchId;
    });

    const normalizedMembers = normalizeFamilyMembers(newMembers);
    setFamily(newFamily);
    setMembers(normalizedMembers);
    setBranches([defaultBranch]);

    const initialActivity: ActivityLog[] = [{
      id: `act-${Date.now()}`,
      familyId: famId,
      userId: currentUid,
      userName: user?.displayName || firebaseUser?.displayName || 'Family Creator',
      action: 'add_member',
      targetType: 'family',
      targetName: newFamily.name,
      details: `Initialized family tree with ${normalizedMembers.length} members and primary branch`,
      timestamp: new Date().toISOString(),
    }];
    setActivityLogs(initialActivity);

    const bundle: FamilyDataBundle = {
      family: newFamily,
      members: normalizedMembers,
      branches: [defaultBranch],
      events: [],
      photos: [],
      albums: [],
      stories: [],
      documents: [],
      activityLogs: initialActivity,
      notifications: [],
      collaborators: [],
      invitations: [],
    };

    if (firebaseUser && !isDemoUser) {
      saveFamilyTree(firebaseUser.uid, bundle).catch((err) => {
        console.warn('Onboarding save error:', err);
      });
    }
  };

  const importTreeData = (importedMembers: FamilyMember[], importedFamily?: Partial<Family>) => {
    if (importedFamily) {
      setFamily(prev => {
        const next = { ...prev, ...importedFamily };
        syncField('family', next);
        return next;
      });
    }
    const finalMembers = normalizeFamilyMembers(importedMembers);
    setMembers(finalMembers);
    syncField('members', finalMembers);
    logActivity('edit_settings', 'family', 'Imported Tree Archive', undefined, `Imported ${importedMembers.length} records`);
  };

  const unpublishTree = async () => {
    try {
      await unpublishPublicTree(family.id);
      updateFamilySettings({
        privacy: {
          ...family.privacy,
          isPublic: false
        }
      });
    } catch (err) {
      console.warn('Unpublish error:', err);
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        family,
        members,
        branches,
        events,
        photos,
        albums,
        stories,
        documents,
        activityLogs,
        notifications,
        collaborators,
        invitations,
        addMember,
        updateMember,
        deleteMember,
        getMember,
        linkExistingMembers,
        addMigration,
        deleteMigration,
        addBranch,
        updateBranch,
        addEvent,
        rsvpEvent,
        addPhoto,
        likePhoto,
        addPhotoComment,
        addAlbum,
        addStory,
        updateStory,
        likeStory,
        addStoryComment,
        addDocument,
        deleteDocument,
        createInvitation,
        acceptInvitation,
        updateCollaboratorRole,
        removeCollaborator,
        markNotificationRead,
        markAllNotificationsRead,
        updateFamilySettings,
        unpublishTree,
        createNewBlankFamily,
        clearAllMembers,
        resetToSampleData,
        importTreeData,
        initializeOnboardingTree,
        cloudReady,
        isCloudLoading,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
