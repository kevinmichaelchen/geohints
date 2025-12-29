# Domains - Requirements

## Overview

Create a reference guide for country-code top-level domains (ccTLDs) to help GeoGuessr players identify countries from website URLs visible in street view.

## User Stories

### US-01: Quick Domain Lookup

**As a** GeoGuessr player
**I want** to quickly look up which country a domain extension belongs to
**So that** I can identify location from visible URLs in-game

**Acceptance Criteria:**

- WHEN a user types a domain (e.g., ".de") THE SYSTEM SHALL show the matching country (Germany)
- WHEN a user types without the dot (e.g., "de") THE SYSTEM SHALL still match
- WHEN a user searches a country name THE SYSTEM SHALL show its domain(s)

### US-02: Browse All Domains

**As a** learner studying domains
**I want** to browse all country domains in an organized list
**So that** I can memorize common ones

**Acceptance Criteria:**

- WHEN a user visits the page THE SYSTEM SHALL display all ccTLDs
- WHEN viewing the list THE SYSTEM SHALL show domain, country name, and flag
- WHEN a user clicks a column header THE SYSTEM MAY sort by that column

### US-03: Filter by Region

**As a** user focusing on a specific region
**I want** to filter domains by continent
**So that** I can study one region at a time

**Acceptance Criteria:**

- WHEN a user selects a continent filter THE SYSTEM SHALL show only domains from that region
- WHEN combined with search THE SYSTEM SHALL apply both filters
- WHEN a user clears filters THE SYSTEM SHALL show all domains

### US-04: Common vs Rare Domains

**As a** GeoGuessr player
**I want** to know which domains appear frequently in GeoGuessr
**So that** I can prioritize learning those

**Acceptance Criteria:**

- WHEN viewing domains THE SYSTEM MAY indicate common GeoGuessr domains
- THE SYSTEM SHALL highlight domains for covered countries (e.g., .br, .jp, .de)
- THE SYSTEM MAY show a "Most Common" quick reference section

### US-05: Memorable Domains Guide

**As a** learner
**I want** memory aids for non-obvious domains
**So that** I can remember tricky ones

**Acceptance Criteria:**

- WHEN a domain is non-obvious THE SYSTEM MAY show a mnemonic or note
- Examples: .ch (Switzerland - Confoederatio Helvetica), .za (South Africa - Zuid-Afrika)
- THE SYSTEM SHALL not clutter obvious ones (e.g., .de for Germany)

## Content Requirements

### CR-01: Data Structure

Each domain entry must include:
- Domain extension (e.g., ".de", ".jp")
- Country code (ISO 3166-1 alpha-2)
- Country name
- Continent/region
- Optional: mnemonic/note for non-obvious mappings
- Optional: GeoGuessr frequency indicator

### CR-02: Coverage

- THE SYSTEM SHALL include all ~250 ccTLDs
- THE SYSTEM SHALL include common GeoGuessr territories
- THE SYSTEM MAY note domains that are rarely seen in street view

### CR-03: Special Cases

Document notable exceptions:
- .uk vs .gb (United Kingdom)
- .eu (European Union - not a country)
- Generic domains used regionally (e.g., .tv for Tuvalu but used globally)

## Technical Requirements

### TR-01: Data Source

- THE SYSTEM SHALL use IANA ccTLD list as authoritative source
- THE SYSTEM SHALL store data in a centralized TypeScript file
- THE SYSTEM SHALL validate domain format (lowercase, 2-3 chars typically)

### TR-02: Search Performance

- WHEN searching THE SYSTEM SHALL match in under 16ms
- WHEN typing THE SYSTEM SHALL filter on each keystroke (no debounce needed for small dataset)

### TR-03: Table Component

- THE SYSTEM SHALL display data in an accessible table
- THE SYSTEM SHALL support keyboard navigation
- THE SYSTEM MAY support column sorting
