import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFamily } from '../context/FamilyContext';
import { canPerform, resolveEffectiveRole } from '../utils/permissions';
import { maskMember, maskMembers, shouldApplyPrivacyMask } from '../utils/privacy';
import { FamilyMember } from '../types';

export function useFamilyAccess() {
  const { user } = useAuth();
  const { family, collaborators } = useFamily();

  const role = useMemo(
    () => resolveEffectiveRole(user, family, collaborators),
    [user, family, collaborators]
  );

  const applyPrivacyMask = useMemo(
    () => shouldApplyPrivacyMask(user, family, collaborators),
    [user, family, collaborators]
  );

  return {
    role,
    applyPrivacyMask,
    canView: canPerform(role, 'view'),
    canEditMembers: canPerform(role, 'edit_members'),
    canDeleteMembers: canPerform(role, 'delete_members'),
    canUploadMedia: canPerform(role, 'upload_media'),
    canManageCollaborators: canPerform(role, 'manage_collaborators'),
    canManagePrivacy: canPerform(role, 'manage_privacy'),
    canManageFamily: canPerform(role, 'manage_family'),
    maskMember: (member: FamilyMember) => maskMember(member, family.privacy, applyPrivacyMask),
    maskMembers: (members: FamilyMember[]) => maskMembers(members, family.privacy, applyPrivacyMask),
  };
}
