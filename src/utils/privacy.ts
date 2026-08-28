import { FamilyMember, FamilyUser, PrivacySettings, UserProfile } from '../types';

export function shouldApplyPrivacyMask(
  user: UserProfile | null | undefined,
  family: { ownerId: string },
  collaborators: FamilyUser[]
): boolean {
  if (!user) return true;
  if (family.ownerId === user.uid) return false;
  return !collaborators.some(
    (c) => c.userId === user.uid || c.email.toLowerCase() === user.email.toLowerCase()
  );
}

function maskDateToYear(date?: string): string | undefined {
  if (!date) return undefined;
  const year = date.split('-')[0];
  return year || date;
}

export function maskMember(
  member: FamilyMember,
  privacy: PrivacySettings,
  applyMask: boolean
): FamilyMember {
  if (!applyMask) return member;

  if (privacy.hideLivingMembers && member.isLiving) {
    return {
      ...member,
      firstName: 'Living',
      lastName: 'Relative',
      middleName: undefined,
      maidenName: undefined,
      nickname: undefined,
      occupation: undefined,
      education: undefined,
      biography: undefined,
      email: undefined,
      phone: undefined,
      currentLocation: undefined,
      coordinates: undefined,
      avatarUrl: undefined,
      birthDate: privacy.hideSensitiveDates ? undefined : maskDateToYear(member.birthDate),
      birthPlace: undefined,
    };
  }

  if (privacy.hideSensitiveDates) {
    return {
      ...member,
      birthDate: maskDateToYear(member.birthDate),
      deathDate: member.isLiving ? member.deathDate : maskDateToYear(member.deathDate),
    };
  }

  return member;
}

export function maskMembers(
  members: FamilyMember[],
  privacy: PrivacySettings,
  applyMask: boolean
): FamilyMember[] {
  return members.map((member) => maskMember(member, privacy, applyMask));
}
