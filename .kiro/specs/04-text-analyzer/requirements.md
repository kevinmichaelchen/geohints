# Text Analyzer - Requirements

## Overview

Create a "reverse lookup" feature where users paste text and the system identifies possible countries based on character analysis.

## User Stories

### US-01: Basic Text Analysis

**As a** GeoGuessr player  
**I want** to paste text I see in-game  
**So that** I can identify which country I might be in

**Acceptance Criteria:**

- WHEN a user pastes or types text THE SYSTEM SHALL analyze the characters
- WHEN analysis completes THE SYSTEM SHALL display a ranked list of possible countries
- WHEN a country is identified THE SYSTEM SHALL show which characters matched

### US-02: Confidence Scoring

**As a** user analyzing text  
**I want** to see confidence levels for each country match  
**So that** I can gauge how certain the identification is

**Acceptance Criteria:**

- WHEN displaying results THE SYSTEM SHALL show a confidence percentage for each country
- WHEN a country has multiple matching characters THE SYSTEM SHALL have higher confidence
- WHEN only common characters are found THE SYSTEM SHALL indicate low confidence

### US-03: Simple vs Advanced Mode

**As a** power user  
**I want** to toggle between simple and advanced analysis  
**So that** I can choose speed vs accuracy

**Acceptance Criteria:**

- WHEN "Simple" mode is selected THE SYSTEM SHALL match unique characters only (fast)
- WHEN "Advanced" mode is selected THE SYSTEM SHALL also consider character frequency patterns
- WHEN switching modes THE SYSTEM SHALL re-analyze with the new algorithm

### US-04: Visual Results

**As a** user viewing results  
**I want** to see clear, visual country results  
**So that** I can quickly identify the likely answer

**Acceptance Criteria:**

- WHEN displaying country results THE SYSTEM SHALL show the country flag emoji
- WHEN displaying country results THE SYSTEM SHALL show the country name
- WHEN displaying country results THE SYSTEM SHALL highlight the matching characters from the input

### US-05: Copy Results

**As a** user who found their answer  
**I want** to copy the result  
**So that** I can share it or reference it later

**Acceptance Criteria:**

- WHEN a user clicks a copy button THE SYSTEM SHALL copy the country name to clipboard
- WHEN copied THE SYSTEM SHALL show brief confirmation feedback

### US-06: Empty and Edge Cases

**As a** user  
**I want** clear feedback for edge cases  
**So that** I understand why I'm not getting results

**Acceptance Criteria:**

- WHEN no text is entered THE SYSTEM SHALL show a prompt to enter text
- WHEN text has no identifiable characters THE SYSTEM SHALL show "No unique characters found"
- WHEN text matches many countries equally THE SYSTEM SHALL show all matches with explanation

## Technical Requirements

### TR-01: Performance

- WHEN analyzing text under 10,000 characters THE SYSTEM SHALL complete in under 100ms
- WHEN the user types THE SYSTEM SHALL debounce analysis (300ms delay)

### TR-02: Character Coverage

- THE SYSTEM SHALL recognize characters from all defined language regions
- THE SYSTEM SHALL ignore common ASCII characters (a-z, 0-9, punctuation)
- THE SYSTEM SHALL handle mixed-case input correctly

### TR-03: Offline Support

- THE SYSTEM SHALL work without network requests (all data client-side)
