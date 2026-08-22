import React, { createContext, useContext, useState, useEffect } from 'react';
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
  RelationshipType
} from '../types';
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

  // Branch actions
  addBranch: (branchData: Omit<Branch, 'id' | 'familyId' | 'createdAt'>) => Branch;
  updateBranch: (id: string, updates: Partial<Branch>) => void;

  // Event actions
  addEvent: (eventData: Omit<FamilyEvent, 'id' | 'familyId' | 'createdAt'>) => FamilyEvent;
  rsvpEvent: (eventId: string, memberId: string, status: 'attending' | 'declined' | 'maybe') => void;

  // Photo & Album actions
  addPhoto: (photoData: Omit<Photo, 'id' | 'familyId' | 'uploadedAt' | 'likes' | 'comments'>) => Photo;
  likePhoto: (photoId: string) => void;
  addPhotoComment: (photoId: string, text: string) => void;
  addAlbum: (name: string, description?: string, coverPhotoUrl?: string) => Album;

  // Story actions
  addStory: (storyData: Omit<Story, 'id' | 'familyId' | 'likes' | 'comments'>) => Story;
  updateStory: (id: string, updates: Partial<Story>) => void;
  likeStory: (storyId: string) => void;
  addStoryComment: (storyId: string, text: string) => void;

  // Document actions
  addDocument: (docData: Omit<Document, 'id' | 'familyId' | 'uploadedAt'>) => Document;
  deleteDocument: (id: string) => void;

  // Collaborator & Invitation actions
  createInvitation: (email: string, role: FamilyUser['role']) => Invitation;
  updateCollaboratorRole: (collaboratorId: string, newRole: FamilyUser['role']) => void;
  removeCollaborator: (collaboratorId: string) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Family settings & multi-family actions
  updateFamilySettings: (updates: Partial<Family>) => void;
  createNewBlankFamily: (name: string, country?: string, motto?: string) => void;
  clearAllMembers: () => void;
  resetToSampleData: () => void;
  importTreeData: (importedMembers: FamilyMember[], importedFamily?: Partial<Family>) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Auto clean legacy storage if old demo was present
  useEffect(() => {
    try {
      const oldFam = localStorage.getItem('ft_active_family');
      if (oldFam && (oldFam.includes('Silva') || oldFam.includes('Perera'))) {
        localStorage.removeItem('ft_active_family');
        localStorage.removeItem('ft_members');
        localStorage.removeItem('ft_branches');
        localStorage.removeItem('ft_photos');
        localStorage.removeItem('ft_stories');
        localStorage.removeItem('ft_events');
        localStorage.removeItem('ft_documents');
        localStorage.removeItem('ft_activity');
      }
    } catch (e) {}
  }, []);

  const [family, setFamily] = useState<Family>(() => {
    const saved = localStorage.getItem('ft_v2_active_family');
    return saved ? JSON.parse(saved) : DEFAULT_BLANK_FAMILY;
  });

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem('ft_v2_members');
    if (!saved) return INITIAL_MEMBERS;
    try {
      const parsed: FamilyMember[] = JSON.parse(saved);
      const seen = new Set<string>();
      return parsed.map((m, idx) => {
        if (seen.has(m.id)) {
          const uniqueId = `${m.id}-dedup-${idx}-${Math.random().toString(36).substring(2, 5)}`;
          seen.add(uniqueId);
          return { ...m, id: uniqueId };
        }
        seen.add(m.id);
        return m;
      });
    } catch (e) {
      return INITIAL_MEMBERS;
    }
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('ft_v2_branches');
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [events, setEvents] = useState<FamilyEvent[]>(() => {
    const saved = localStorage.getItem('ft_v2_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('ft_v2_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    const saved = localStorage.getItem('ft_v2_albums');
    return saved ? JSON.parse(saved) : INITIAL_ALBUMS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('ft_v2_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('ft_v2_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ft_v2_activity');
    if (!saved) return INITIAL_ACTIVITY_LOGS;
    try {
      const parsed: ActivityLog[] = JSON.parse(saved);
      const seen = new Set<string>();
      return parsed.map((log, idx) => {
        if (seen.has(log.id)) {
          const uniqueId = `${log.id}-dedup-${idx}-${Math.random().toString(36).substring(2, 5)}`;
          seen.add(uniqueId);
          return { ...log, id: uniqueId };
        }
        seen.add(log.id);
        return log;
      });
    } catch (e) {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ft_v2_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [collaborators, setCollaborators] = useState<FamilyUser[]>(() => {
    const saved = localStorage.getItem('ft_v2_collaborators');
    return saved ? JSON.parse(saved) : INITIAL_COLLABORATORS;
  });

  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ft_v2_active_family', JSON.stringify(family));
    localStorage.setItem('ft_v2_members', JSON.stringify(members));
    localStorage.setItem('ft_v2_branches', JSON.stringify(branches));
    localStorage.setItem('ft_v2_events', JSON.stringify(events));
    localStorage.setItem('ft_v2_photos', JSON.stringify(photos));
    localStorage.setItem('ft_v2_albums', JSON.stringify(albums));
    localStorage.setItem('ft_v2_stories', JSON.stringify(stories));
    localStorage.setItem('ft_v2_documents', JSON.stringify(documents));
    localStorage.setItem('ft_v2_activity', JSON.stringify(activityLogs));
    localStorage.setItem('ft_v2_notifications', JSON.stringify(notifications));
    localStorage.setItem('ft_v2_collaborators', JSON.stringify(collaborators));
  }, [family, members, branches, events, photos, albums, stories, documents, activityLogs, notifications, collaborators]);

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
    setActivityLogs(prev => [newLog, ...prev]);
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
          if (relationType === 'parent') {
            return { ...m, parentIds: [...new Set([...m.parentIds, newId])] };
          }
          if (relationType === 'child') {
            return { ...m, childIds: [...new Set([...m.childIds, newId])] };
          }
          if (relationType === 'spouse' || relationType === 'partner') {
            return { ...m, spouseIds: [...new Set([...m.spouseIds, newId])] };
          }
          if (relationType === 'sibling') {
            return { ...m, siblingIds: [...new Set([...m.siblingIds, newId])] };
          }
        }
        if (relationType === 'child' && parentIds.includes(m.id) && m.id !== relationshipTargetId) {
          return { ...m, childIds: [...new Set([...m.childIds, newId])] };
        }
        return m;
      });
      return [...updated, newMember];
    });

    logActivity('add_member', 'member', `${newMember.firstName} ${newMember.lastName}`, newId, `Added to Generation ${newMember.generation}`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
    const mem = getMember(id);
    if (mem) {
      logActivity('edit_member', 'member', `${mem.firstName} ${mem.lastName}`, id, 'Updated personal biography & vital records');
    }
  };

  const deleteMember = (id: string) => {
    const mem = getMember(id);
    setMembers(prev => {
      return prev
        .filter(m => m.id !== id)
        .map(m => ({
          ...m,
          parentIds: m.parentIds.filter(pid => pid !== id),
          spouseIds: m.spouseIds.filter(sid => sid !== id),
          childIds: m.childIds.filter(cid => cid !== id),
          siblingIds: m.siblingIds.filter(sibid => sibid !== id)
        }));
    });
    if (mem) {
      logActivity('delete_member', 'member', `${mem.firstName} ${mem.lastName}`, id, 'Removed member from family tree');
    }
  };

  const addBranch = (branchData: Omit<Branch, 'id' | 'familyId' | 'createdAt'>): Branch => {
    const newBranch: Branch = {
      ...branchData,
      id: `branch-${Date.now()}`,
      familyId: family.id,
      createdAt: new Date().toISOString()
    };
    setBranches(prev => [...prev, newBranch]);
    logActivity('edit_settings', 'family', newBranch.name, newBranch.id, 'Created new family branch');
    return newBranch;
  };

  const updateBranch = (id: string, updates: Partial<Branch>) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const addEvent = (eventData: Omit<FamilyEvent, 'id' | 'familyId' | 'createdAt'>): FamilyEvent => {
    const newEvent: FamilyEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      familyId: family.id,
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [newEvent, ...prev]);
    logActivity('add_event', 'event', newEvent.title, newEvent.id, `Date: ${newEvent.date}`);
    return newEvent;
  };

  const rsvpEvent = (eventId: string, memberId: string, status: 'attending' | 'declined' | 'maybe') => {
    const member = getMember(memberId) || { firstName: user?.displayName || 'Relative', lastName: '' };
    const memberName = `${member.firstName} ${member.lastName}`.trim();
    
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      const existing = ev.rsvps || [];
      const filtered = existing.filter(r => r.memberId !== memberId);
      return {
        ...ev,
        rsvps: [...filtered, { memberId, status, name: memberName }]
      };
    }));
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
    setPhotos(prev => [newPhoto, ...prev]);
    logActivity('add_photo', 'photo', newPhoto.title, newPhoto.id);
    return newPhoto;
  };

  const likePhoto = (photoId: string) => {
    const userId = user?.uid || 'user-active';
    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;
      const hasLiked = p.likes.includes(userId);
      return {
        ...p,
        likes: hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
      };
    }));
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
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, comments: [...p.comments, comment] } : p));
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
    setAlbums(prev => [...prev, newAlbum]);
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
    setStories(prev => [newStory, ...prev]);
    logActivity('create_story', 'story', newStory.title, newStory.id);
    return newStory;
  };

  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const likeStory = (storyId: string) => {
    const userId = user?.uid || 'user-active';
    setStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const hasLiked = s.likes.includes(userId);
      return {
        ...s,
        likes: hasLiked ? s.likes.filter(id => id !== userId) : [...s.likes, userId]
      };
    }));
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
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, comments: [...s.comments, comment] } : s));
  };

  const addDocument = (docData: Omit<Document, 'id' | 'familyId' | 'uploadedAt'>): Document => {
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now()}`,
      familyId: family.id,
      uploadedAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
    logActivity('upload_doc', 'document', newDoc.title, newDoc.id);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
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
    setInvitations(prev => [newInvite, ...prev]);
    return newInvite;
  };

  const updateCollaboratorRole = (collaboratorId: string, newRole: FamilyUser['role']) => {
    setCollaborators(prev => prev.map(c => c.id === collaboratorId ? { ...c, role: newRole } : c));
  };

  const removeCollaborator = (collaboratorId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateFamilySettings = (updates: Partial<Family>) => {
    setFamily(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    logActivity('edit_settings', 'family', updates.name || family.name, family.id, 'Updated family tree profile');
  };

  const createNewBlankFamily = (name: string, country: string = 'Global', motto: string = '') => {
    const newFam: Family = {
      id: `fam-${Date.now()}`,
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
      ownerId: user?.uid || 'user-active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFamily(newFam);
    setMembers([]);
    setBranches([]);
    setEvents([]);
    setPhotos([]);
    setAlbums([]);
    setStories([]);
    setDocuments([]);
    setActivityLogs([{
      id: `act-${Date.now()}`,
      familyId: newFam.id,
      userId: user?.uid || 'user-active',
      userName: user?.displayName || 'Family Historian',
      action: 'edit_settings',
      targetType: 'family',
      targetName: newFam.name,
      details: 'Initialized new family tree',
      timestamp: new Date().toISOString()
    }]);
  };

  const clearAllMembers = () => {
    setMembers([]);
    setBranches([]);
    setEvents([]);
    setPhotos([]);
    setStories([]);
    setDocuments([]);
  };

  const resetToSampleData = () => {
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

  const importTreeData = (importedMembers: FamilyMember[], importedFamily?: Partial<Family>) => {
    if (importedFamily) {
      setFamily(prev => ({ ...prev, ...importedFamily }));
    }
    setMembers(importedMembers);
    logActivity('edit_settings', 'family', 'Imported Tree Archive', undefined, `Imported ${importedMembers.length} records`);
  };

  return (
    <FamilyContext.Provider value={{
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
      updateCollaboratorRole,
      removeCollaborator,
      markNotificationRead,
      markAllNotificationsRead,
      updateFamilySettings,
      createNewBlankFamily,
      clearAllMembers,
      resetToSampleData,
      importTreeData
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) throw new Error('useFamily must be used within a FamilyProvider');
  return context;
};
