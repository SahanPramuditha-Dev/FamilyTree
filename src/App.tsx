import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FamilyProvider } from './context/FamilyContext';
import { ThemeProvider } from './context/ThemeContext';

import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HelpPage } from './pages/public/HelpPage';
import { LegalPages } from './pages/public/LegalPages';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { InviteJoinPage } from './pages/invite/InviteJoinPage';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { InteractiveTreePage } from './pages/tree/InteractiveTreePage';
import { PublicTreePage } from './pages/tree/PublicTreePage';
import { MembersListPage } from './pages/members/MembersListPage';
import { MemberProfilePage } from './pages/members/MemberProfilePage';
import { BranchesPage } from './pages/branches/BranchesPage';
import { RelationshipFinderPage } from './pages/relationships/RelationshipFinderPage';
import { TimelinePage } from './pages/timeline/TimelinePage';
import { EventsPage } from './pages/events/EventsPage';
import { PhotosPage } from './pages/photos/PhotosPage';
import { StoriesPage } from './pages/stories/StoriesPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { FamilyMapPage } from './pages/map/FamilyMapPage';
import { GenealogyVisualizerPage } from './pages/visualizations/GenealogyVisualizerPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { ExportPrintPage } from './pages/export/ExportPrintPage';
import { CollaborationPage } from './pages/collaboration/CollaborationPage';
import { PrivacyCenterPage } from './pages/privacy/PrivacyCenterPage';
import { ActivityLogsPage } from './pages/activity/ActivityLogsPage';
import { FamilySettingsPage } from './pages/settings/FamilySettingsPage';
import { AccountSettingsPage } from './pages/settings/AccountSettingsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProvider>
          <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/privacy-policy" element={<LegalPages initialTab="privacy" />} />
              <Route path="/terms" element={<LegalPages initialTab="terms" />} />
              <Route path="/cookies" element={<LegalPages initialTab="cookies" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Onboarding Wizard */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            <Route path="/invite/join" element={<InviteJoinPage />} />
            <Route path="/tree/public/:familyId" element={<PublicTreePage />} />

            {/* Authenticated App Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tree" element={<InteractiveTreePage />} />
              <Route path="/members" element={<MembersListPage />} />
              <Route path="/members/:id" element={<MemberProfilePage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/relationships" element={<RelationshipFinderPage />} />
              <Route path="/visualizations" element={<GenealogyVisualizerPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/map" element={<FamilyMapPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/export" element={<ExportPrintPage />} />
              <Route path="/collaboration" element={<CollaborationPage />} />
              <Route path="/privacy" element={<PrivacyCenterPage />} />
              <Route path="/activity" element={<ActivityLogsPage />} />
              <Route path="/settings/family" element={<FamilySettingsPage />} />
              <Route path="/settings/account" element={<AccountSettingsPage />} />
              </Route>
            </Route>

            {/* Admin-only route — requires role === 'admin' */}
            <Route element={<AdminRoute />}>
              <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </FamilyProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
