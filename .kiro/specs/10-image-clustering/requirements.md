# Image Clustering - Requirements

## Overview

Enable automatic grouping of visually similar images across content categories (bollards, utility poles, road signs, etc.) to support a "type-first" user experience where players can identify visual clues and find matching countries.

## Problem Statement

GeoGuessr players think: _"I see THIS bollard, which countries could it be?"_

The current geography-first hierarchy (continent → country → images) requires too much scrolling. Players need to match what they SEE to potential locations, not browse by location to see what's there.

## User Stories

### US-01: Browse by Visual Type

**As a** GeoGuessr player
**I want** to see a grid of visually distinct bollard/sign types
**So that** I can quickly find the type matching what I see in-game

**Acceptance Criteria:**

- WHEN a user visits a category page (e.g., `/bollards`) THE SYSTEM SHALL display clustered visual types
- WHEN viewing types THE SYSTEM SHALL show a representative image for each cluster
- WHEN a user clicks a type THE SYSTEM SHALL show all countries with that type

### US-02: Type-to-Countries Navigation

**As a** GeoGuessr player mid-game
**I want** to click a bollard type and see which countries use it
**So that** I can narrow down my guess based on visual clues

**Acceptance Criteria:**

- WHEN a user selects a visual type THE SYSTEM SHALL display all countries containing that type
- WHEN viewing countries THE SYSTEM SHALL show the specific images from each country
- WHEN multiple images exist per country THE SYSTEM SHALL display them all

### US-03: Cross-Category Clustering

**As a** site administrator
**I want** clustering to work for any image category
**So that** we can add type-first navigation to bollards, utility poles, road signs, etc.

**Acceptance Criteria:**

- WHEN clustering is run THE SYSTEM SHALL accept a category parameter
- WHEN processing images THE SYSTEM SHALL use the same algorithm across categories
- WHEN outputting results THE SYSTEM SHALL generate category-specific data files

### US-04: Human Curation Layer

**As a** content curator
**I want** to review and name auto-generated clusters
**So that** users see meaningful labels like "White Cylindrical" not "Cluster 7"

**Acceptance Criteria:**

- WHEN clustering completes THE SYSTEM SHALL output a JSON file for human review
- WHEN a curator assigns names THE SYSTEM SHALL preserve those names on re-clustering
- WHEN clusters change significantly THE SYSTEM SHALL flag them for re-review

### US-05: Representative Image Selection

**As a** user browsing visual types
**I want** each cluster to show its most representative image
**So that** I can quickly identify the type

**Acceptance Criteria:**

- WHEN clustering completes THE SYSTEM SHALL select one representative image per cluster
- WHEN selecting representatives THE SYSTEM SHOULD choose the image closest to cluster centroid
- WHEN displaying types THE SYSTEM SHALL use the representative image as the card thumbnail

## Content Requirements

### CR-01: Supported Categories

The clustering system must support:

- `bollards` - Roadside bollards and markers
- `follow-cars` - Google Street View vehicles
- `utility-poles` - Power/telephone poles (future)
- `road-signs` - Road and traffic signs (future)

### CR-02: Image Sources

Images are stored in Cloudflare R2:

```
geohints-images/
├── bollards/{cc}/{cc}-{seq}-{width}w.webp
└── follow-cars/{cc}/{hash}-{width}w.webp
```

### CR-03: Minimum Cluster Size

- Clusters must contain at least 3 images
- Single-image outliers may be grouped into an "Other" cluster or remain unclustered

## Technical Requirements

### TR-01: Embedding Generation

- WHEN generating embeddings THE SYSTEM SHALL use CLIP-based models (imgbeddings for POC, ONNX for production)
- WHEN processing images THE SYSTEM SHALL use 800w variants (balance of quality/speed)
- WHEN storing embeddings THE SYSTEM MAY cache them to avoid recomputation

### TR-02: Clustering Algorithm

- WHEN clustering THE SYSTEM SHALL use HDBSCAN (density-based, handles noise)
- WHEN configuring clustering THE SYSTEM SHALL allow min_cluster_size tuning
- WHEN using cosine similarity THE SYSTEM SHALL normalize embeddings first

### TR-03: Output Format

```typescript
interface ClusterOutput {
  category: string;
  generatedAt: string;
  model: string;
  clusters: Array<{
    id: string;
    representativeImage: ImageRef;
    images: ImageRef[];
    centroid?: number[];
  }>;
  unclustered: ImageRef[];
}

interface ImageRef {
  country: string;
  identifier: string;  // seq for bollards, hash for follow-cars
}
```

### TR-04: CLI Interface

- WHEN running clustering THE SYSTEM SHALL provide a CLI command
- WHEN configuring THE SYSTEM SHALL accept category, sample size, and output path options
- WHEN completing THE SYSTEM SHALL log statistics (clusters formed, images processed, etc.)

### TR-05: Performance

- WHEN processing 200 images THE SYSTEM SHALL complete in under 2 minutes
- WHEN using Python POC THE SYSTEM SHALL run on CPU without GPU requirement
- WHEN using TypeScript production THE SYSTEM SHALL leverage ONNX runtime

### TR-06: Reproducibility

- WHEN running clustering multiple times THE SYSTEM SHOULD produce consistent clusters
- WHEN images are added THE SYSTEM SHOULD preserve existing cluster assignments where possible
- WHEN significant changes occur THE SYSTEM SHALL log what changed

## Non-Functional Requirements

### NFR-01: Local Execution

- THE SYSTEM SHALL run entirely locally without cloud API calls
- THE SYSTEM SHALL not require GPU (CPU-only acceptable)
- THE SYSTEM SHALL work on macOS (development environment)

### NFR-02: Data Privacy

- THE SYSTEM SHALL not send images to external services
- THE SYSTEM SHALL store embeddings locally only
- THE SYSTEM MAY cache embeddings for performance

### NFR-03: Extensibility

- THE SYSTEM SHALL be designed to add new categories easily
- THE SYSTEM SHALL separate embedding generation from clustering
- THE SYSTEM SHALL support future object-level detection (detect→crop→embed)
