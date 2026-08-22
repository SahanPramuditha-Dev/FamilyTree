# FamilyTree Architecture

## Overview

FamilyTree is a client-rendered React application built with Vite. `src/main.tsx` mounts the app, while `src/App.tsx` composes providers and maps public and authenticated URLs to page components.

## Application Layers

- `src/pages`: Feature and route-level UI. Pages coordinate user actions and compose reusable components.
- `src/components/layout`: Public and authenticated shells, including navigation and the sidebar.
- `src/components/ui`: Shared visual primitives such as buttons, cards, inputs, tabs, modals, and avatars.
- `src/context`: Cross-page state for authentication, family data, and theme preferences.
- `src/services`: External service integrations. Firebase Authentication and Cloud Firestore are currently initialized in `firebase.ts`.
- `src/utils`: Domain logic for GEDCOM conversion, relationship calculations, and tree layout.
- `src/types`: Shared domain contracts for members, relationships, events, stories, documents, and related records.

## Data Flow

1. `AuthContext` observes Firebase Authentication and exposes the current user and auth actions.
2. `FamilyContext` owns the active family data and exposes member and relationship operations to pages.
3. Feature pages read context state and call service or context actions in response to user interaction.
4. Components render the resulting state and keep presentation details local.

The seeded data in `src/data/initialData.ts` supports the local experience and demo flows. Production persistence should use authenticated Firestore reads and writes with rules that enforce family membership.

## Routing

`App.tsx` separates public routes under `PublicLayout` from authenticated routes under `AppLayout`. The onboarding route is kept outside the authenticated shell so a new user can complete setup. Unknown routes redirect to the landing page.

## Adding a Feature

1. Define or extend domain types in `src/types`.
2. Add domain calculations or serialization to `src/utils` when the behavior is reusable.
3. Add a page under the closest feature directory in `src/pages`.
4. Reuse existing UI primitives and layouts.
5. Register the route in `src/App.tsx`.
6. Update the README route and feature lists when the feature is user-facing.
7. Run `npm run build` and `npm run lint`.

## Privacy and Security Boundaries

Genealogy records can contain sensitive personal information. Authentication is only one part of the security model: Firestore Security Rules must validate both identity and family-level authorization. Avoid logging private records, never ship service-account credentials to the browser, and use synthetic data in screenshots and examples.
