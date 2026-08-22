export type Gender = 'male' | 'female' | 'other';

export type RelationshipType = 
  | 'parent' 
  | 'child' 
  | 'spouse' 
  | 'partner' 
  | 'sibling' 
  | 'adopted_parent' 
  | 'adopted_child' 
  | 'step_parent' 
  | 'step_child';

export interface FamilyMember {
  id: string;
  familyId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  maidenName?: string;
  nickname?: string;
  gender: Gender;
  isLiving: boolean;
  birthDate?: string; // YYYY-MM-DD
  birthPlace?: string;
  deathDate?: string; // YYYY-MM-DD
  deathPlace?: string;
  avatarUrl?: string;
  occupation?: string;
  education?: string;
  biography?: string;
  branchId?: string;
  generation: number; // 1 is root/founder level, 2 is child level, etc. or dynamic
  email?: string;
  phone?: string;
  currentLocation?: string;
  coordinates?: [number, number]; // [lat, lng] for interactive map
  createdAt: string;
  updatedAt: string;
  
  // Direct relationship cache for fast traversal
  parentIds: string[];
  spouseIds: string[];
  childIds: string[];
  siblingIds: string[];
}

export interface Relationship {
  id: string;
  familyId: string;
  person1Id: string;
  person2Id: string;
  type: RelationshipType;
  startDate?: string;
  endDate?: string;
  notes?: string;
  isCurrent?: boolean;
}

export interface Branch {
  id: string;
  familyId: string;
  name: string;
  color: string;
  description?: string;
  originLocation?: string;
  leaderMemberId?: string;
  createdAt: string;
}

export type EventType = 
  | 'birthday' 
  | 'wedding' 
  | 'anniversary' 
  | 'reunion' 
  | 'graduation' 
  | 'funeral' 
  | 'gathering' 
  | 'career' 
  | 'migration' 
  | 'other';

export interface FamilyEvent {
  id: string;
  familyId: string;
  title: string;
  description?: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  time?: string;
  location?: string;
  coordinates?: [number, number];
  participantIds: string[];
  photos?: string[];
  rsvpRequired?: boolean;
  rsvps?: { memberId: string; status: 'attending' | 'declined' | 'maybe'; name: string }[];
  createdAt: string;
}

export interface Photo {
  id: string;
  familyId: string;
  albumId?: string;
  title: string;
  caption?: string;
  url: string;
  dateTaken?: string;
  location?: string;
  taggedMemberIds: string[];
  uploadedBy: string;
  uploadedAt: string;
  likes: string[]; // member/user IDs
  comments: {
    id: string;
    userId: string;
    userName: string;
    avatarUrl?: string;
    text: string;
    createdAt: string;
  }[];
}

export interface Album {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  photoCount?: number;
}

export interface Story {
  id: string;
  familyId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  coverImageUrl?: string;
  taggedMemberIds: string[];
  tags: string[];
  publicationDate: string;
  visibility: 'family' | 'public' | 'private';
  likes: string[];
  comments: {
    id: string;
    userId: string;
    userName: string;
    avatarUrl?: string;
    text: string;
    createdAt: string;
  }[];
}

export interface Document {
  id: string;
  familyId: string;
  title: string;
  category: 'birth_certificate' | 'marriage_certificate' | 'letter' | 'school_record' | 'news_clipping' | 'legal' | 'photo_scan' | 'other';
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  dateOfDocument?: string;
  linkedMemberIds: string[];
  uploadedBy: string;
  uploadedAt: string;
  isPrivate?: boolean;
}

export type Role = 'owner' | 'admin' | 'editor' | 'contributor' | 'viewer';

export interface FamilyUser {
  id: string;
  familyId: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
  linkedMemberId?: string;
  joinedAt: string;
}

export interface Invitation {
  id: string;
  familyId: string;
  familyName: string;
  email: string;
  role: Role;
  invitedBy: string;
  invitedByName: string;
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface PrivacySettings {
  isPublic: boolean;
  hideLivingMembers: boolean;
  hideSensitiveDates: boolean;
  allowSearchEngineIndexing: boolean;
  requireApprovalForEdits: boolean;
  photoVisibility: 'public' | 'family' | 'members_only';
  storyVisibility: 'public' | 'family' | 'members_only';
}

export interface Family {
  id: string;
  name: string;
  motto?: string;
  description?: string;
  originCountry: string;
  originRegion?: string;
  coverPhotoUrl?: string;
  crestUrl?: string;
  foundedYear?: string;
  privacy: PrivacySettings;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  defaultFamilyId?: string;
  twoFactorEnabled?: boolean;
  language: string;
  timezone: string;
  role?: Role | 'user';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  familyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'add_member' | 'edit_member' | 'delete_member' | 'add_photo' | 'create_story' | 'add_event' | 'upload_doc' | 'join_family' | 'edit_settings';
  targetType: 'member' | 'photo' | 'story' | 'event' | 'document' | 'family';
  targetName: string;
  targetId?: string;
  details?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  familyId: string;
  title: string;
  message: string;
  type: 'birthday' | 'anniversary' | 'invitation' | 'mention' | 'update' | 'security';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface VersionHistoryItem {
  id: string;
  memberId: string;
  versionNumber: number;
  changedBy: string;
  changedByName: string;
  timestamp: string;
  summary: string;
  snapshot: Partial<FamilyMember>;
}
