# Driving Side - Requirements

## Overview

Create a reference guide for left-hand vs right-hand drive countries with visual cues to help GeoGuessr players quickly determine driving orientation.

## User Stories

### US-01: Quick Reference Lookup

**As a** GeoGuessr player
**I want** to quickly check which side a country drives on
**So that** I can use road orientation as a location clue

**Acceptance Criteria:**

- WHEN a user visits the Driving Side page THE SYSTEM SHALL display all countries with their driving side
- WHEN a user searches for a country THE SYSTEM SHALL filter the list instantly
- WHEN a user views a country THE SYSTEM SHALL clearly show LEFT or RIGHT driving

### US-02: Visual Map Overview

**As a** learner studying driving sides
**I want** to see a world map colored by driving side
**So that** I can understand regional patterns at a glance

**Acceptance Criteria:**

- WHEN a user views the page THE SYSTEM SHALL display an interactive or static world map
- WHEN viewing the map THE SYSTEM SHALL color-code left-drive (e.g., red) vs right-drive (e.g., blue) countries
- WHEN a user hovers on a country THE SYSTEM MAY show the country name

### US-03: Filter by Driving Side

**As a** user studying left-hand drive countries
**I want** to filter to show only LHD or RHD countries
**So that** I can focus my study

**Acceptance Criteria:**

- WHEN a user selects "Left-hand drive" filter THE SYSTEM SHALL show only LHD countries
- WHEN a user selects "Right-hand drive" filter THE SYSTEM SHALL show only RHD countries
- WHEN a user selects "All" THE SYSTEM SHALL show all countries

### US-04: Regional Grouping

**As a** user studying by region
**I want** to see countries grouped by continent
**So that** I can learn regional patterns

**Acceptance Criteria:**

- WHEN a user views the page THE SYSTEM SHALL group countries by continent
- WHEN a user clicks a continent THE SYSTEM SHALL expand/show that section
- WHEN viewing a region THE SYSTEM SHALL show the dominant driving side for that region

### US-05: Visual Cues Guide

**As a** GeoGuessr player
**I want** to learn visual cues for identifying driving side in-game
**So that** I can determine orientation without seeing road signs

**Acceptance Criteria:**

- WHEN a user views the page THE SYSTEM SHALL include a "How to Identify" section
- THE SYSTEM SHALL explain cues like: steering wheel position, road markings, overtaking lanes
- THE SYSTEM MAY include example screenshots showing these cues

## Content Requirements

### CR-01: Data Structure

Each country entry must include:
- Country code (ISO 3166-1 alpha-2)
- Country name
- Driving side: "left" | "right"
- Continent/region
- Flag emoji or image

### CR-02: Coverage

- THE SYSTEM SHALL include all ~195 UN member states
- THE SYSTEM SHALL include common GeoGuessr territories (Puerto Rico, Guam, etc.)
- THE SYSTEM SHALL note any exceptions (e.g., US Virgin Islands drives left)

### CR-03: Statistics

Display summary stats:
- Total countries driving on left (~75)
- Total countries driving on right (~165)
- Percentage breakdown

## Technical Requirements

### TR-01: Data Source

- THE SYSTEM SHALL use a reliable data source for driving side information
- THE SYSTEM SHALL store data in a centralized TypeScript file
- THE SYSTEM SHALL type driving side as `"left" | "right"`

### TR-02: Map Component (Optional)

- IF implementing a map THE SYSTEM SHALL use an SVG world map for performance
- THE SYSTEM SHALL ensure map is accessible (keyboard navigable, screen reader friendly)
- THE SYSTEM MAY use a static image fallback for simplicity

### TR-03: Performance

- WHEN filtering THE SYSTEM SHALL complete in under 16ms
- WHEN the page loads THE SYSTEM SHALL display content without waiting for map
