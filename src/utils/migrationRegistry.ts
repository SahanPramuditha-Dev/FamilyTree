import React from 'react';
import { MigrationReason } from '../types/geography';
import { 
  Heart, 
  Briefcase, 
  GraduationCap, 
  Plane, 
  Home, 
  Users, 
  MapPin 
} from 'lucide-react';

export interface MigrationReasonMeta {
  reason: MigrationReason;
  label: string;
  icon: React.ReactNode;
  colorHex: string;
  badgeBgLight: string;
  badgeTextLight: string;
  badgeBgDark: string;
  badgeTextDark: string;
  description: string;
  dashArray?: string;
}

export const MIGRATION_REASONS: Record<MigrationReason, MigrationReasonMeta> = {
  marriage: {
    reason: 'marriage',
    label: 'Marriage',
    icon: React.createElement(Heart, { className: "w-4 h-4 text-pink-500" }),
    colorHex: '#ec4899', // Pink / Rose
    badgeBgLight: 'bg-pink-100',
    badgeTextLight: 'text-pink-800',
    badgeBgDark: 'dark:bg-pink-950/60',
    badgeTextDark: 'dark:text-pink-300',
    description: 'Relocated to establish new household upon marriage',
    dashArray: '4,4'
  },
  career: {
    reason: 'career',
    label: 'Career & Employment',
    icon: React.createElement(Briefcase, { className: "w-4 h-4 text-amber-500" }),
    colorHex: '#f59e0b', // Amber / Gold
    badgeBgLight: 'bg-amber-100',
    badgeTextLight: 'text-amber-800',
    badgeBgDark: 'dark:bg-amber-950/60',
    badgeTextDark: 'dark:text-amber-300',
    description: 'Relocated for job opportunities or business expansion',
    dashArray: '6,6'
  },
  education: {
    reason: 'education',
    label: 'Higher Education',
    icon: React.createElement(GraduationCap, { className: "w-4 h-4 text-blue-500" }),
    colorHex: '#3b82f6', // Blue
    badgeBgLight: 'bg-blue-100',
    badgeTextLight: 'text-blue-800',
    badgeBgDark: 'dark:bg-blue-950/60',
    badgeTextDark: 'dark:text-blue-300',
    description: 'Relocated for university studies or academic training',
    dashArray: '8,4'
  },
  emigration: {
    reason: 'emigration',
    label: 'Global Emigration & Diaspora',
    icon: React.createElement(Plane, { className: "w-4 h-4 text-emerald-500" }),
    colorHex: '#10b981', // Emerald
    badgeBgLight: 'bg-emerald-100',
    badgeTextLight: 'text-emerald-800',
    badgeBgDark: 'dark:bg-emerald-950/60',
    badgeTextDark: 'dark:text-emerald-300',
    description: 'Relocated to a new country / permanent overseas settlement',
    dashArray: 'solid'
  },
  retirement: {
    reason: 'retirement',
    label: 'Retirement & Peaceful Living',
    icon: React.createElement(Home, { className: "w-4 h-4 text-purple-500" }),
    colorHex: '#8b5cf6', // Purple
    badgeBgLight: 'bg-purple-100',
    badgeTextLight: 'text-purple-800',
    badgeBgDark: 'dark:bg-purple-950/60',
    badgeTextDark: 'dark:text-purple-300',
    description: 'Moved to ancestral hometown or retirement community',
    dashArray: '5,5'
  },
  family: {
    reason: 'family',
    label: 'Family Support & Resettlement',
    icon: React.createElement(Users, { className: "w-4 h-4 text-cyan-500" }),
    colorHex: '#06b6d4', // Cyan
    badgeBgLight: 'bg-cyan-100',
    badgeTextLight: 'text-cyan-800',
    badgeBgDark: 'dark:bg-cyan-950/60',
    badgeTextDark: 'dark:text-cyan-300',
    description: 'Moved to be closer to parents, children, or extended family',
    dashArray: '6,4'
  },
  other: {
    reason: 'other',
    label: 'Other Life Relocation',
    icon: React.createElement(MapPin, { className: "w-4 h-4 text-stone-500" }),
    colorHex: '#78716c', // Stone
    badgeBgLight: 'bg-stone-100',
    badgeTextLight: 'text-stone-800',
    badgeBgDark: 'dark:bg-stone-800',
    badgeTextDark: 'dark:text-stone-300',
    description: 'General relocation / movement',
    dashArray: '4,4'
  }
};

export function getMigrationMeta(reason: MigrationReason = 'other'): MigrationReasonMeta {
  return MIGRATION_REASONS[reason] || MIGRATION_REASONS.other;
}
