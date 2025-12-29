# Foundation & Cleanup - Requirements

## Overview

Clean up the codebase by removing starter template cruft, fixing code quality issues, extracting shared utilities, and establishing patterns for future development.

## User Stories

### US-01: Clean Navigation

**As a** GeoGuessr player  
**I want** to see only relevant navigation options  
**So that** I can quickly find the hints I need without distraction

**Acceptance Criteria:**

- WHEN a user views the header navigation THE SYSTEM SHALL display only GeoHints-relevant links (no Qwik docs links)
- WHEN a user visits any page THE SYSTEM SHALL show consistent branding with "GeoHints" name
- WHEN a user navigates between pages THE SYSTEM SHALL use client-side navigation for fast transitions

### US-02: Consistent Branding

**As a** visitor  
**I want** to see professional GeoHints branding  
**So that** I understand this is a dedicated GeoGuessr learning tool

**Acceptance Criteria:**

- WHEN a user visits the site THE SYSTEM SHALL display a GeoHints logo in the header
- WHEN a user views the browser tab THE SYSTEM SHALL show "GeoHints" in the title with appropriate favicon
- WHEN a user shares a link THE SYSTEM SHALL provide proper OpenGraph meta tags for social previews

### US-03: Fast Page Loads

**As a** GeoGuessr player mid-game  
**I want** pages to load instantly  
**So that** I can quickly reference hints without losing game time

**Acceptance Criteria:**

- WHEN a user navigates to any page THE SYSTEM SHALL render content within 100ms (perceived)
- WHEN images are present THE SYSTEM SHALL lazy-load them appropriately
- WHEN a user revisits a page THE SYSTEM SHALL serve cached content where appropriate

## Technical Requirements

### TR-01: Remove Unused Code

- WHEN the application is built THE SYSTEM SHALL NOT include demo pages (`/demo/flower`, `/demo/todolist`)
- WHEN the application is built THE SYSTEM SHALL NOT include unused starter components (`counter`, `infobox`, `next-steps`, `gauge`)

### TR-02: Code Quality

- WHEN TypeScript compiles THE SYSTEM SHALL produce zero type errors
- WHEN ESLint runs THE SYSTEM SHALL produce zero errors
- WHEN code is reviewed THE SYSTEM SHALL follow consistent patterns (no duplicate utility functions)

### TR-03: Data Architecture

- WHEN language character data is needed THE SYSTEM SHALL load it from centralized data files (not inline in components)
- WHEN country information is needed THE SYSTEM SHALL reference a single source of truth for country codes, names, and flags

### TR-04: Routing

- WHEN a user clicks internal links THE SYSTEM SHALL use Qwik's `<Link>` component for SPA navigation
- WHEN a user directly visits a URL THE SYSTEM SHALL render the correct page via SSR
