import { Family, FamilyUser, Role, UserProfile } from '../types';

export type FamilyAction =
  | 'view'
  | 'edit_members'
  | 'delete_members'
  | 'upload_media'
  | 'manage_collaborators'
  | 'manage_privacy'
  | 'manage_family';

const ROLE_PERMISSIONS: Record<Role, FamilyAction[]> = {
  owner: ['view', 'edit_members', 'delete_members', 'upload_media', 'manage_collaborators', 'manage_privacy', 'manage_family'],
  admin: ['view', 'edit_members', 'delete_members', 'upload_media', 'manage_collaborators', 'manage_privacy', 'manage_family'],
  editor: ['view', 'edit_members', 'delete_members', 'upload_media'],
  contributor: ['view', 'upload_media'],
  viewer: ['view'],
};

export function resolveEffectiveRole(
  user: UserProfile | null | undefined,
  family: Family,
  collaborators: FamilyUser[]
): Role | null {
  if (!user) return null;
  if (family.ownerId === user.uid) return 'owner';

  const collaborator = collaborators.find(
    (c) => c.userId === user.uid || c.email.toLowerCase() === user.email.toLowerCase()
  );
  if (collaborator) return collaborator.role;

  if (user.role === 'admin' || user.role === 'owner') return 'admin';
  return null;
}

export function canPerform(role: Role | null, action: FamilyAction): boolean {
  if (!role) return action === 'view';
  return ROLE_PERMISSIONS[role].includes(action);
}
