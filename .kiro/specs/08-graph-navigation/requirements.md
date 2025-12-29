# Graph-Based Content Navigation - Requirements

## Overview

Reimagine GeoHints content architecture as a knowledge graph enabling multi-directional exploration. Users should discover content through any dimension—not just category-first navigation.

## The Graph Model

### Entities (Nodes)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Continent  │     │   Country   │     │  Category   │
│  (Europe)   │────▶│   (Germany) │◀────│  (Bollards) │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                          ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │    Hint     │◀───▶│    Hint     │
                    │ (DE bollard)│     │ (DE plate)  │
                    └─────────────┘     └─────────────┘
```

### Relationships (Edges)

| Relationship | Example | Cardinality |
|--------------|---------|-------------|
| Country → Continent | Germany ∈ Europe | N:1 |
| Hint → Category | White bollard ∈ Bollards | N:1 |
| Hint ↔ Country | White bollard ↔ Germany | N:M |
| Country ~ Country | Germany ~ Austria (similar) | N:M derived |

## User Stories

### US-01: Country-Centric View

**As a** GeoGuessr player who landed in a country
**I want** to see ALL identification hints for that country in one place
**So that** I can learn everything about identifying that location

**Acceptance Criteria:**

- WHEN a user visits `/countries/de` THE SYSTEM SHALL display all hints for Germany
- WHEN viewing a country THE SYSTEM SHALL group hints by category (bollards, plates, signs...)
- WHEN viewing a country THE SYSTEM SHALL show "Similar Countries" based on shared hints
- WHEN viewing a country THE SYSTEM SHALL show the continent and neighboring countries

### US-02: Hint-Centric View

**As a** GeoGuessr player who saw a specific bollard
**I want** to see which countries use that exact bollard design
**So that** I can narrow down my guess

**Acceptance Criteria:**

- WHEN a user clicks on a specific hint THE SYSTEM SHALL show all countries using it
- WHEN viewing a hint THE SYSTEM SHALL indicate if it's unique (1 country) or common (many)
- WHEN viewing a hint THE SYSTEM SHALL show "Similar Hints" from the same category

### US-03: Continent/Region View

**As a** learner studying a region
**I want** to see hints filtered by continent
**So that** I can focus on one geographic area

**Acceptance Criteria:**

- WHEN a user visits `/continents/europe` THE SYSTEM SHALL list all European countries
- WHEN viewing a continent THE SYSTEM SHALL show aggregate stats (countries, hints per category)
- WHEN a user selects a category THE SYSTEM SHALL show that category filtered to the continent

### US-04: Category + Region Intersection

**As a** learner
**I want** to view "European bollards" or "Asian license plates"
**So that** I can study a specific intersection of dimensions

**Acceptance Criteria:**

- WHEN a user navigates to `/bollards?continent=europe` THE SYSTEM SHALL show only European bollards
- WHEN filtering THE SYSTEM SHALL update the URL for shareability
- WHEN a user clears filters THE SYSTEM SHALL show all items in that category

### US-05: Global Search Across Entities

**As a** user looking for something specific
**I want** to search across all entity types
**So that** I find what I need regardless of where it lives

**Acceptance Criteria:**

- WHEN a user types "Germany" THE SYSTEM SHALL show the country profile
- WHEN a user types "white bollard" THE SYSTEM SHALL show matching hints
- WHEN a user types "Europe" THE SYSTEM SHALL show the continent and European countries
- WHEN results span multiple types THE SYSTEM SHALL group by entity type

### US-06: Similarity & Recommendations

**As a** learner who knows Germany well
**I want** to see which countries are visually similar
**So that** I can learn to distinguish them

**Acceptance Criteria:**

- WHEN viewing a country THE SYSTEM SHALL show "Often confused with" countries
- WHEN two countries share many hints THE SYSTEM SHALL surface their differences
- WHEN a hint is unique to one country THE SYSTEM SHALL highlight it as a "definitive clue"

### US-07: "What makes X unique?"

**As a** GeoGuessr player
**I want** to know what UNIQUELY identifies a country
**So that** I can make confident guesses

**Acceptance Criteria:**

- WHEN viewing a country THE SYSTEM SHALL highlight hints unique to that country
- WHEN viewing a country THE SYSTEM SHALL show "Only in [Country]" badges on unique hints
- WHEN comparing countries THE SYSTEM SHALL show differentiating hints

## Navigation Patterns

### URL Structure

```
# Entity pages
/countries/:code          → Country profile (all hints)
/countries/:code/bollards → Country's bollards only
/continents/:name         → Continent overview
/continents/:name/countries → Countries in continent

# Category pages (existing, enhanced)
/bollards                 → All bollards
/bollards?continent=europe → European bollards
/bollards?country=de      → Germany's bollards (redirect to country?)

# Hint detail (new)
/hints/:id                → Specific hint with all countries

# Search
/search?q=germany         → Global search results
```

### Cross-linking Requirements

- Every country mention links to `/countries/:code`
- Every hint image links to hint detail or expands in-place
- Every category name links to category page
- Every continent name links to continent page
- Breadcrumbs show current position in graph

## Content Requirements

### CR-01: Unified Data Model

```typescript
interface Country {
  code: string;           // ISO 3166-1 alpha-2
  name: string;
  continent: ContinentCode;
  neighbors?: string[];   // Adjacent country codes
}

interface Hint {
  id: string;             // e.g., "bollard-de-white-rectangular"
  category: Category;
  countries: string[];    // Country codes
  images: string[];
  description?: string;
  isUnique?: boolean;     // Computed: countries.length === 1
}

interface Category {
  id: string;             // "bollards", "plates", etc.
  name: string;
  description: string;
}

// Derived/computed
interface CountryProfile {
  country: Country;
  hints: Record<Category, Hint[]>;
  similarCountries: Array<{code: string; sharedHints: number}>;
  uniqueHints: Hint[];
}
```

### CR-02: Relationship Indexing

THE SYSTEM SHALL maintain indices for efficient lookup:
- `hintsByCountry: Map<CountryCode, Hint[]>`
- `countriesByHint: Map<HintId, CountryCode[]>`
- `countriesByContinent: Map<ContinentCode, CountryCode[]>`
- `similarityMatrix: Map<CountryCode, Map<CountryCode, number>>`

## Technical Requirements

### TR-01: Route Architecture

- THE SYSTEM SHALL support multiple URL patterns for same data
- THE SYSTEM SHALL use canonical URLs to avoid duplicate content
- THE SYSTEM SHALL implement proper redirects where appropriate

### TR-02: Performance

- WHEN computing similarity THE SYSTEM SHALL cache results
- WHEN rendering country profiles THE SYSTEM SHALL lazy-load category sections
- WHEN searching THE SYSTEM SHALL return results in under 50ms

### TR-03: SEO

- THE SYSTEM SHALL generate unique meta descriptions per entity
- THE SYSTEM SHALL implement structured data (JSON-LD) for countries
- THE SYSTEM SHALL use semantic HTML (nav, article, aside)

## Migration Strategy

### Phase 1: Data Model
- Refactor existing data into unified graph model
- Add country profiles alongside existing category pages
- Implement relationship indices

### Phase 2: Navigation
- Add country pages (`/countries/:code`)
- Add cross-links between existing pages
- Implement global search

### Phase 3: Discovery
- Add similarity computations
- Add "unique hints" highlighting
- Add continent overview pages
