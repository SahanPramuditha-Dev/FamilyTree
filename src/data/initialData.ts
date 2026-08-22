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
  FamilyUser
} from '../types';

export const DEFAULT_BLANK_FAMILY: Family = {
  id: 'fam-my-tree',
  name: 'Our Family Tree',
  motto: 'Honoring our roots, blooming for generations',
  description: 'A shared heritage archive celebrating our ancestors, living relatives, memories, and future generations.',
  originCountry: 'Global',
  originRegion: 'Ancestral Region',
  coverPhotoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80',
  crestUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
  foundedYear: '1920',
  privacy: {
    isPublic: true,
    hideLivingMembers: false,
    hideSensitiveDates: false,
    allowSearchEngineIndexing: true,
    requireApprovalForEdits: false,
    photoVisibility: 'public',
    storyVisibility: 'public'
  },
  ownerId: 'user-active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-paternal',
    familyId: 'fam-my-tree',
    name: 'Paternal Ancestral Line',
    color: '#059669', // Emerald
    description: 'Ancestral lineage passed through the paternal grandparents and founders.',
    originLocation: 'Ancestral Homeland',
    leaderMemberId: 'mem-1',
    createdAt: '2023-01-15T08:00:00Z'
  },
  {
    id: 'branch-maternal',
    familyId: 'fam-my-tree',
    name: 'Maternal Heritage Line',
    color: '#3b82f6', // Blue
    description: 'Lineage and heritage passed through the maternal grandparents and extended family.',
    originLocation: 'Heritage Region',
    leaderMemberId: 'mem-3',
    createdAt: '2023-01-15T08:00:00Z'
  },
  {
    id: 'branch-diaspora',
    familyId: 'fam-my-tree',
    name: 'Overseas & Diaspora Branch',
    color: '#d97706', // Amber
    description: 'Descendants and relatives living across international locations.',
    originLocation: 'Global Diaspora',
    leaderMemberId: 'mem-6',
    createdAt: '2023-01-15T08:00:00Z'
  }
];

export const INITIAL_MEMBERS: FamilyMember[] = [
  // Generation 1 (Great-Grandparents)
  {
    id: 'mem-1',
    familyId: 'fam-my-tree',
    firstName: 'Arthur',
    middleName: 'William',
    lastName: 'Sterling',
    nickname: 'Great-Grandfather Arthur',
    gender: 'male',
    isLiving: false,
    birthDate: '1920-04-12',
    birthPlace: 'London, United Kingdom',
    deathDate: '1998-11-20',
    deathPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    occupation: 'Master Architect & Scholar',
    education: 'Royal Academy of Architecture',
    biography: 'Pioneered heritage building restoration and documented generational histories for our family archive.',
    branchId: 'branch-paternal',
    generation: 1,
    currentLocation: 'London, United Kingdom',
    coordinates: [51.5074, -0.1278],
    parentIds: [],
    spouseIds: ['mem-2'],
    childIds: ['mem-4', 'mem-5', 'mem-6'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'mem-2',
    familyId: 'fam-my-tree',
    firstName: 'Eleanor',
    middleName: 'Rose',
    lastName: 'Sterling',
    maidenName: 'Montgomery',
    nickname: 'Great-Grandmother Eleanor',
    gender: 'female',
    isLiving: false,
    birthDate: '1924-09-05',
    birthPlace: 'Edinburgh, Scotland',
    deathDate: '2006-03-14',
    deathPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    occupation: 'Botanist & Educator',
    education: 'University of Edinburgh',
    biography: 'Devoted scholar of botanical medicine and literature. Instilled deep curiosity and appreciation of history.',
    branchId: 'branch-paternal',
    generation: 1,
    currentLocation: 'Edinburgh, Scotland',
    coordinates: [55.9533, -3.1883],
    parentIds: [],
    spouseIds: ['mem-1'],
    childIds: ['mem-4', 'mem-5', 'mem-6'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'mem-3',
    familyId: 'fam-my-tree',
    firstName: 'David',
    middleName: 'Henry',
    lastName: 'Vanderbilt',
    gender: 'male',
    isLiving: false,
    birthDate: '1922-01-18',
    birthPlace: 'Boston, MA, USA',
    deathDate: '2001-08-02',
    deathPlace: 'Boston, MA, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    occupation: 'Maritime Captain & Navigator',
    education: 'Massachusetts Maritime Academy',
    biography: 'Navigated international waters across five continents and preserved navigational journals.',
    branchId: 'branch-maternal',
    generation: 1,
    currentLocation: 'Boston, MA, USA',
    coordinates: [42.3601, -71.0589],
    parentIds: [],
    spouseIds: ['mem-3b'],
    childIds: ['mem-7'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'mem-3b',
    familyId: 'fam-my-tree',
    firstName: 'Clara',
    lastName: 'Vanderbilt',
    maidenName: 'Sinclair',
    gender: 'female',
    isLiving: false,
    birthDate: '1926-06-30',
    birthPlace: 'New York, NY, USA',
    deathDate: '2012-12-15',
    deathPlace: 'Boston, MA, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    occupation: 'Concert Pianist & Historian',
    education: 'Juilliard School of Music',
    biography: 'Performed classical works internationally and nurtured artistic expression in our lineage.',
    branchId: 'branch-maternal',
    generation: 1,
    currentLocation: 'New York, NY, USA',
    coordinates: [40.7128, -74.0060],
    parentIds: [],
    spouseIds: ['mem-3'],
    childIds: ['mem-7'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },

  // Generation 2 (Parents & Elders)
  {
    id: 'mem-4',
    familyId: 'fam-my-tree',
    firstName: 'Dr. Robert',
    middleName: 'James',
    lastName: 'Sterling',
    gender: 'male',
    isLiving: true,
    birthDate: '1954-07-24',
    birthPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    occupation: 'Professor of Medicine & Researcher',
    education: 'University of Oxford (MD, DSc)',
    biography: 'Dedicated four decades to clinical medicine, bioethics, and medical mentoring.',
    branchId: 'branch-paternal',
    generation: 2,
    currentLocation: 'London, United Kingdom',
    coordinates: [51.5074, -0.1278],
    parentIds: ['mem-1', 'mem-2'],
    spouseIds: ['mem-7'],
    childIds: ['mem-9', 'mem-10'],
    siblingIds: ['mem-5', 'mem-6'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-02-18T15:20:00Z'
  },
  {
    id: 'mem-7',
    familyId: 'fam-my-tree',
    firstName: 'Catherine',
    middleName: 'Grace',
    lastName: 'Sterling',
    maidenName: 'Vanderbilt',
    gender: 'female',
    isLiving: true,
    birthDate: '1958-11-14',
    birthPlace: 'Boston, MA, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    occupation: 'Environmental Architect & Designer',
    education: 'MIT School of Architecture',
    biography: 'Specializes in sustainable historic preservation and energy-positive community architecture.',
    branchId: 'branch-maternal',
    generation: 2,
    currentLocation: 'Boston, MA, USA',
    coordinates: [42.3601, -71.0589],
    parentIds: ['mem-3', 'mem-3b'],
    spouseIds: ['mem-4'],
    childIds: ['mem-9', 'mem-10'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-02-18T15:20:00Z'
  },
  {
    id: 'mem-5',
    familyId: 'fam-my-tree',
    firstName: 'Julian',
    middleName: 'Thomas',
    lastName: 'Sterling',
    gender: 'male',
    isLiving: true,
    birthDate: '1957-03-08',
    birthPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    occupation: 'Aerospace Systems Director',
    education: 'Imperial College London',
    biography: 'Led international satellite engineering programs and space communications.',
    branchId: 'branch-diaspora',
    generation: 2,
    currentLocation: 'Melbourne, Australia',
    coordinates: [-37.8136, 144.9631],
    parentIds: ['mem-1', 'mem-2'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['mem-4', 'mem-6'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'mem-6',
    familyId: 'fam-my-tree',
    firstName: 'Victoria',
    middleName: 'Anne',
    lastName: 'Sterling-Hayes',
    gender: 'female',
    isLiving: true,
    birthDate: '1961-12-01',
    birthPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80',
    occupation: 'International Human Rights Jurist',
    education: 'University of Cambridge (LLM)',
    biography: 'Advocates for international law, children rights, and universal cultural preservation.',
    branchId: 'branch-diaspora',
    generation: 2,
    currentLocation: 'Geneva, Switzerland',
    coordinates: [46.2044, 6.1432],
    parentIds: ['mem-1', 'mem-2'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['mem-4', 'mem-5'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },

  // Generation 3 (Adults & Current Family Creator)
  {
    id: 'mem-9',
    familyId: 'fam-my-tree',
    firstName: 'Alexander',
    middleName: 'James',
    lastName: 'Sterling',
    nickname: 'Tree Creator (You)',
    gender: 'male',
    isLiving: true,
    birthDate: '1992-06-18',
    birthPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    occupation: 'Software Engineer & Genealogist',
    education: 'University College London (MEng)',
    biography: 'Curator of this digital family tree archive. Dedicated to connecting generations and preserving our heritage.',
    branchId: 'branch-paternal',
    generation: 3,
    currentLocation: 'San Francisco, CA, USA',
    coordinates: [37.7749, -122.4194],
    parentIds: ['mem-4', 'mem-7'],
    spouseIds: ['mem-17'],
    childIds: ['mem-18', 'mem-19'],
    siblingIds: ['mem-10'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-08-20T10:30:00Z'
  },
  {
    id: 'mem-17',
    familyId: 'fam-my-tree',
    firstName: 'Sophia',
    middleName: 'Marie',
    lastName: 'Sterling',
    maidenName: 'Laurent',
    gender: 'female',
    isLiving: true,
    birthDate: '1994-03-22',
    birthPlace: 'Paris, France',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    occupation: 'Visual Designer & Illustrator',
    education: 'École des Beaux-Arts Paris',
    biography: 'Illustrates family memory books, ancestral portraits, and heraldic crest artwork.',
    branchId: 'branch-paternal',
    generation: 3,
    currentLocation: 'San Francisco, CA, USA',
    coordinates: [37.7749, -122.4194],
    parentIds: [],
    spouseIds: ['mem-9'],
    childIds: ['mem-18', 'mem-19'],
    siblingIds: [],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-08-20T10:30:00Z'
  },
  {
    id: 'mem-10',
    familyId: 'fam-my-tree',
    firstName: 'Emily',
    middleName: 'Claire',
    lastName: 'Sterling',
    gender: 'female',
    isLiving: true,
    birthDate: '1996-10-09',
    birthPlace: 'London, United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    occupation: 'Marine Biologist & Author',
    education: 'University of British Columbia',
    biography: 'Conducts ocean conservation research and writes scientific literature.',
    branchId: 'branch-paternal',
    generation: 3,
    currentLocation: 'Vancouver, Canada',
    coordinates: [49.2827, -123.1207],
    parentIds: ['mem-4', 'mem-7'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['mem-9'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },

  // Generation 4 (Next Generation)
  {
    id: 'mem-18',
    familyId: 'fam-my-tree',
    firstName: 'Lucas',
    middleName: 'Arthur',
    lastName: 'Sterling',
    nickname: 'Luke',
    gender: 'male',
    isLiving: true,
    birthDate: '2022-05-14',
    birthPlace: 'San Francisco, CA, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    occupation: 'Childhood Explorer',
    biography: 'Loves nature walks, picture stories, and music with grandparents.',
    branchId: 'branch-paternal',
    generation: 4,
    currentLocation: 'San Francisco, CA, USA',
    coordinates: [37.7749, -122.4194],
    parentIds: ['mem-9', 'mem-17'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['mem-19'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'mem-19',
    familyId: 'fam-my-tree',
    firstName: 'Maya',
    middleName: 'Rose',
    lastName: 'Sterling',
    nickname: 'May',
    gender: 'female',
    isLiving: true,
    birthDate: '2024-09-02',
    birthPlace: 'San Francisco, CA, USA',
    avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
    occupation: 'Infant / Joy of the Family',
    biography: 'The newest blossom on our family tree.',
    branchId: 'branch-paternal',
    generation: 4,
    currentLocation: 'San Francisco, CA, USA',
    coordinates: [37.7749, -122.4194],
    parentIds: ['mem-9', 'mem-17'],
    spouseIds: [],
    childIds: [],
    siblingIds: ['mem-18'],
    createdAt: '2024-09-03T08:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z'
  }
];

export const INITIAL_EVENTS: FamilyEvent[] = [
  {
    id: 'evt-1',
    familyId: 'fam-my-tree',
    title: 'Annual Grand Family Reunion',
    description: 'Gathering of living generations to celebrate our lineage, share oral memories, and take updated family portraits.',
    eventType: 'reunion',
    date: '2026-12-28',
    time: '12:00 PM',
    location: 'Grand Heritage Hall',
    coordinates: [51.5074, -0.1278],
    participantIds: ['mem-4', 'mem-7', 'mem-9', 'mem-17', 'mem-10', 'mem-18', 'mem-19'],
    rsvpRequired: true,
    rsvps: [
      { memberId: 'mem-9', name: 'Alexander Sterling', status: 'attending' },
      { memberId: 'mem-4', name: 'Dr. Robert Sterling', status: 'attending' },
      { memberId: 'mem-6', name: 'Victoria Sterling', status: 'maybe' }
    ],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'evt-2',
    familyId: 'fam-my-tree',
    title: 'Dr. Robert’s 72nd Milestone Birthday',
    description: 'Intimate dinner celebration with family and grandchildren.',
    eventType: 'birthday',
    date: '2026-07-24',
    time: '07:00 PM',
    location: 'Family Homestead',
    participantIds: ['mem-4', 'mem-7', 'mem-9', 'mem-17', 'mem-10'],
    createdAt: '2026-02-01T10:00:00Z'
  }
];

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    familyId: 'fam-my-tree',
    name: 'Vintage Ancestral Portraits (1920-1970)',
    description: 'Restored archival photographs of our great-grandparents and early family life.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    photoCount: 14,
    createdAt: '2023-02-01T10:00:00Z'
  },
  {
    id: 'alb-2',
    familyId: 'fam-my-tree',
    name: 'Weddings Across Generations',
    description: 'Capturing joyful matrimonial celebrations through the decades.',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    photoCount: 22,
    createdAt: '2023-03-15T10:00:00Z'
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'pho-1',
    familyId: 'fam-my-tree',
    albumId: 'alb-1',
    title: 'Arthur & Eleanor Wedding Portrait (1945)',
    caption: 'Great-grandfather Arthur and Great-grandmother Eleanor on their wedding day.',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    dateTaken: '1945-05-12',
    location: 'London, United Kingdom',
    taggedMemberIds: ['mem-1', 'mem-2'],
    uploadedBy: 'Family Historian',
    uploadedAt: '2023-02-01T10:15:00Z',
    likes: ['user-active'],
    comments: []
  },
  {
    id: 'pho-2',
    familyId: 'fam-my-tree',
    albumId: 'alb-2',
    title: 'Dr. Robert and Catherine Wedding (1988)',
    caption: 'Celebration ceremony uniting the Sterling and Vanderbilt families.',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    dateTaken: '1988-12-10',
    location: 'Boston, MA, USA',
    taggedMemberIds: ['mem-4', 'mem-7'],
    uploadedBy: 'Family Historian',
    uploadedAt: '2023-03-16T09:00:00Z',
    likes: ['user-active'],
    comments: []
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'sto-1',
    familyId: 'fam-my-tree',
    title: 'How Our Family Lineage Began',
    content: `In the early decades of the 20th century, our ancestors began a journey rooted in curiosity, education, and mutual respect.

Through generations of perseverance and creativity, our family has grown across multiple continents. Wherever we live today, our shared foundation is built on generosity and honoring our elders.`,
    authorId: 'user-active',
    authorName: 'Family Historian',
    coverImageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
    taggedMemberIds: ['mem-1', 'mem-2', 'mem-4'],
    tags: ['Founders', 'Origins', 'Memories'],
    publicationDate: '2023-04-10',
    visibility: 'family',
    likes: ['user-active'],
    comments: []
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    familyId: 'fam-my-tree',
    title: '1945 Ecclesiastical Marriage Record',
    category: 'marriage_certificate',
    description: 'Certified extract of marriage registration.',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Marriage_Certificate_1945.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    dateOfDocument: '1945-05-12',
    linkedMemberIds: ['mem-1', 'mem-2'],
    uploadedBy: 'Family Historian',
    uploadedAt: '2023-02-10T14:00:00Z',
    isPrivate: false
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    familyId: 'fam-my-tree',
    userId: 'user-active',
    userName: 'Family Historian',
    action: 'add_member',
    targetType: 'member',
    targetName: 'Maya Rose Sterling',
    targetId: 'mem-19',
    details: 'Added Generation 4 newborn to family lineage',
    timestamp: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-active',
    familyId: 'fam-my-tree',
    title: 'Welcome to Your Family Tree',
    message: 'Start adding your ancestors, parents, spouses, and children.',
    type: 'update',
    isRead: false,
    linkUrl: '/tree',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_COLLABORATORS: FamilyUser[] = [
  {
    id: 'collab-1',
    familyId: 'fam-my-tree',
    userId: 'user-active',
    name: 'Family Tree Creator',
    email: 'admin@familytree.dev',
    role: 'owner',
    joinedAt: '2023-01-15T08:00:00Z'
  }
];
