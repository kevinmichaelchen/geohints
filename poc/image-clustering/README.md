# Image Clustering POC

Proof-of-concept for clustering visually similar images using CLIP embeddings and HDBSCAN.

## Purpose

Validate the approach of:

1. Generating CLIP embeddings for images
2. Clustering similar embeddings together
3. Identifying representative images for each cluster

## Setup

Uses [uv](https://github.com/astral-sh/uv) for fast Python package management.

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync dependencies (creates .venv automatically)
uv sync
```

## Usage

### 1. Download sample images from R2

```bash
# Download 20 bollard images
uv run python download_sample.py --category bollards --sample 20

# Or for follow cars
uv run python download_sample.py --category follow-cars --sample 20
```

### 2. Run clustering

```bash
uv run python cluster.py

# With custom settings
uv run python cluster.py --min-cluster-size 3 --input sample-images --output output/clusters.json
```

### 3. Visualize results

```bash
uv run python visualize.py

# Open the HTML file in your browser
open output/clusters.html
```

## Development

```bash
# Lint with ruff
uv run ruff check .

# Format with ruff
uv run ruff format .

# Type check with ty
uv run ty check .
```

## Output

The clustering produces:

- `output/clusters.json` - Machine-readable clustering results
- `output/clusters.html` - Visual preview for manual review

## Evaluating Results

Look for:

- **Good clusters**: Visually similar bollards grouped together
- **Representative selection**: The "starred" image should be typical of the cluster
- **Noise**: Images that don't fit anywhere are marked "unclustered"

## Next Steps

If results are satisfactory:

1. Run on full dataset (all 154+ images)
2. Manually name clusters (e.g., "White Cylindrical", "Red/White Striped")
3. Implement TypeScript version in `libs/image-cluster/`

If results are poor:

1. Adjust `min_cluster_size` parameter
2. Consider object detection → crop → embed workflow (see research doc)
3. Try different embedding models (SigLIP, DINOv2)
