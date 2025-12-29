# Language Search & Filter - Requirements

## Overview

Add search and filter functionality to language pages, enabling quick character/country lookup during GeoGuessr gameplay.

## User Stories

### US-01: Search by Character

**As a** GeoGuessr player  
**I want** to search for a specific character I see in-game  
**So that** I can quickly identify which countries use that character

**Acceptance Criteria:**

- WHEN a user types a character in the search box THE SYSTEM SHALL filter the grid to show only matching entries
- WHEN a user types "ø" THE SYSTEM SHALL show the entry containing "Øø" and its associated countries
- WHEN a user clears the search THE SYSTEM SHALL show all characters again
- WHEN no characters match THE SYSTEM SHALL display "No results found" message

### US-02: Search by Country

**As a** GeoGuessr player  
**I want** to search for a country name  
**So that** I can see all unique characters used in that country

**Acceptance Criteria:**

- WHEN a user types a country name (e.g., "Finland") THE SYSTEM SHALL show all character entries that include Finland
- WHEN a user types a country code (e.g., "fi") THE SYSTEM SHALL show matching entries
- WHEN multiple countries match THE SYSTEM SHALL show entries for all matching countries

### US-03: Filter by Script Type

**As a** GeoGuessr player  
**I want** to filter characters by script type  
**So that** I can focus on Latin-only or Cyrillic-only characters

**Acceptance Criteria:**

- WHEN a user selects "Latin only" filter THE SYSTEM SHALL hide Cyrillic character entries
- WHEN a user selects "Cyrillic only" filter THE SYSTEM SHALL hide Latin character entries
- WHEN a user selects "All" THE SYSTEM SHALL show all character entries
- WHEN combined with search THE SYSTEM SHALL apply both filters

### US-04: Keyboard-Friendly

**As a** power user  
**I want** to search without using my mouse  
**So that** I can look up characters as fast as possible

**Acceptance Criteria:**

- WHEN the page loads THE SYSTEM SHALL NOT auto-focus the search box (to avoid blocking keyboard shortcuts)
- WHEN a user presses "/" key THE SYSTEM SHALL focus the search box
- WHEN a user presses "Escape" in the search box THE SYSTEM SHALL clear the search and blur the input

### US-05: Highlight Matches

**As a** user searching for characters  
**I want** to see my search term highlighted in results  
**So that** I can quickly spot what matched

**Acceptance Criteria:**

- WHEN search results are displayed THE SYSTEM SHALL highlight the matching portion of characters
- WHEN searching by country THE SYSTEM SHALL highlight the matching country in the list

### US-06: Persist Search Across Navigation

**As a** user navigating between language regions  
**I want** my search to persist or be easily repeatable  
**So that** I don't have to retype my search

**Acceptance Criteria:**

- WHEN a user searches and navigates to another region THE SYSTEM MAY persist the search query in the URL
- WHEN a user shares a URL with a search query THE SYSTEM SHALL apply the search on page load

## Technical Requirements

### TR-01: Performance

- WHEN filtering large character sets THE SYSTEM SHALL complete filtering in under 16ms (60fps)
- WHEN the page loads THE SYSTEM SHALL display all characters before search is ready

### TR-02: Accessibility

- WHEN a screen reader reads the search box THE SYSTEM SHALL announce its purpose
- WHEN results change THE SYSTEM SHALL announce the number of results to screen readers
