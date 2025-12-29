# Bollards - Requirements

## Overview

Create a visual guide to bollard styles, colors, and shapes by country to help GeoGuessr players identify locations based on roadside bollards.

## User Stories

### US-01: Browse Bollards by Region

**As a** GeoGuessr player
**I want** to browse bollard designs organized by continent/region
**So that** I can study the bollards for areas I frequently encounter

**Acceptance Criteria:**

- WHEN a user visits the Bollards page THE SYSTEM SHALL display bollards grouped by continent
- WHEN a user clicks a continent filter THE SYSTEM SHALL show only bollards from that region
- WHEN a user views a country THE SYSTEM SHALL display 1-6 representative bollard images

### US-02: Search Bollards

**As a** GeoGuessr player mid-game
**I want** to quickly search for a country's bollards
**So that** I can verify my guess during gameplay

**Acceptance Criteria:**

- WHEN a user types a country name THE SYSTEM SHALL filter to show matching countries
- WHEN a user searches THE SYSTEM SHALL match partial country names
- WHEN no results match THE SYSTEM SHALL display "No bollards found"

### US-03: Visual Comparison

**As a** learner studying bollards
**I want** to compare bollard designs side-by-side
**So that** I can learn distinguishing features between similar countries

**Acceptance Criteria:**

- WHEN a user views multiple countries THE SYSTEM SHALL display images in a consistent grid layout
- WHEN images load THE SYSTEM SHALL maintain aspect ratio and not cause layout shift
- WHEN a user hovers on an image THE SYSTEM MAY show an enlarged view

### US-04: Identify Key Features

**As a** GeoGuessr player
**I want** to understand what makes each bollard distinctive
**So that** I can quickly identify them in-game

**Acceptance Criteria:**

- WHEN a user views a country's bollards THE SYSTEM SHALL display the country name and flag
- WHEN a country has multiple bollard types THE SYSTEM SHALL show all common variations
- WHEN available THE SYSTEM MAY display brief notes on distinctive features (color, shape, reflectors)

## Content Requirements

### CR-01: Data Structure

Each bollard entry must include:
- Country code (ISO 3166-1 alpha-2)
- Country name
- Continent/region grouping
- 1-6 representative images (WEBP, optimized)
- Optional: brief description of distinctive features

### CR-02: Initial Coverage

Priority countries (commonly seen in GeoGuessr):
- Europe: France, Germany, Spain, Italy, UK, Poland, Netherlands, Belgium
- Americas: USA, Brazil, Argentina, Mexico, Canada
- Asia: Japan, South Korea, Thailand, Indonesia, Malaysia
- Oceania: Australia, New Zealand

### CR-03: Image Requirements

- Format: WEBP for optimal compression
- Minimum resolution: 400x300px
- Show bollard clearly visible from road perspective
- Include context (road edge, background) where helpful

## Technical Requirements

### TR-01: Performance

- WHEN the page loads THE SYSTEM SHALL lazy-load images below the fold
- WHEN filtering THE SYSTEM SHALL complete in under 16ms (60fps)

### TR-02: Responsive Design

- WHEN viewed on mobile THE SYSTEM SHALL display 2 columns
- WHEN viewed on tablet THE SYSTEM SHALL display 3-4 columns
- WHEN viewed on desktop THE SYSTEM SHALL display 5-6 columns

### TR-03: Data Architecture

- THE SYSTEM SHALL store bollard data in a centralized data file
- THE SYSTEM SHALL use consistent image naming: `/images/bollards/{country-code}-{n}.webp`
