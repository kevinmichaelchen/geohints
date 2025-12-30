# Image Clustering - Design

## Architecture Overview

The image clustering system consists of two implementations:

1. **Python POC** - Quick validation in `poc/image-clustering/`
2. **TypeScript Production** - Full implementation in `libs/image-cluster/`

Both follow the same pipeline: **Download → Embed → Cluster → Output**

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   R2 Bucket │────▶│  Embeddings │────▶│  Clustering │────▶│   Output    │
│   (images)  │     │  (CLIP/ONNX)│     │  (HDBSCAN)  │     │   (JSON)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Phase 1: Python POC

### Directory Structure

```
poc/
└── image-clustering/
    ├── requirements.txt
    ├── download_sample.py
    ├── cluster.py
    ├── visualize.py
    ├── sample-images/          # gitignored
    └── output/
        └── clusters.json
```

### Implementation

#### requirements.txt

```
imgbeddings>=0.1.2
hdbscan>=0.8.33
numpy>=1.24.0
pillow>=10.0.0
```

#### download_sample.py

```python
#!/usr/bin/env python3
"""Download sample images from R2 for clustering POC."""

import subprocess
import json
from pathlib import Path

R2_BUCKET = "geohints-images"
CATEGORY = "bollards"
SAMPLE_SIZE = 20
OUTPUT_DIR = Path("sample-images")

def list_r2_objects(prefix: str) -> list[str]:
    """List objects in R2 bucket with given prefix."""
    result = subprocess.run(
        ["npx", "wrangler", "r2", "object", "list", R2_BUCKET, f"--prefix={prefix}"],
        capture_output=True, text=True
    )
    data = json.loads(result.stdout)
    return [obj["key"] for obj in data.get("objects", [])]

def download_object(key: str, local_path: Path):
    """Download single object from R2."""
    subprocess.run([
        "npx", "wrangler", "r2", "object", "get",
        f"{R2_BUCKET}/{key}",
        f"--file={local_path}",
        "--remote"
    ], check=True)

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    # List 800w images only
    all_keys = list_r2_objects(f"{CATEGORY}/")
    keys_800w = [k for k in all_keys if "-800w.webp" in k]

    # Sample
    sample = keys_800w[:SAMPLE_SIZE]

    for key in sample:
        filename = key.split("/")[-1]
        local_path = OUTPUT_DIR / filename
        if not local_path.exists():
            print(f"Downloading: {key}")
            download_object(key, local_path)
        else:
            print(f"Exists: {filename}")

    print(f"\nDownloaded {len(sample)} images to {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
```

#### cluster.py

```python
#!/usr/bin/env python3
"""Generate embeddings and cluster images using imgbeddings + HDBSCAN."""

import json
from pathlib import Path
from imgbeddings import imgbeddings
from PIL import Image
import numpy as np
import hdbscan

INPUT_DIR = Path("sample-images")
OUTPUT_FILE = Path("output/clusters.json")

def main():
    OUTPUT_FILE.parent.mkdir(exist_ok=True)

    # Initialize embedding model
    print("Loading embedding model...")
    ibed = imgbeddings()

    # Load images and generate embeddings
    image_files = sorted(INPUT_DIR.glob("*.webp"))
    print(f"Processing {len(image_files)} images...")

    embeddings = []
    image_ids = []

    for img_path in image_files:
        img = Image.open(img_path)
        emb = ibed.to_embeddings(img)
        embeddings.append(emb.flatten())
        image_ids.append(img_path.stem)
        print(f"  Embedded: {img_path.name}")

    embeddings = np.array(embeddings)
    print(f"Embedding shape: {embeddings.shape}")

    # Cluster with HDBSCAN
    print("\nClustering...")
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=3,
        metric='cosine',
        cluster_selection_method='eom'
    )
    cluster_labels = clusterer.fit_predict(embeddings)

    # Group by cluster
    clusters = {}
    unclustered = []

    for img_id, label in zip(image_ids, cluster_labels):
        if label == -1:
            unclustered.append(img_id)
        else:
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(img_id)

    # Find representative (closest to centroid) for each cluster
    result = {
        "category": "bollards",
        "model": "imgbeddings-clip",
        "clusters": [],
        "unclustered": unclustered
    }

    for label, members in sorted(clusters.items()):
        # Get embeddings for cluster members
        member_indices = [image_ids.index(m) for m in members]
        member_embeddings = embeddings[member_indices]

        # Compute centroid and find closest
        centroid = member_embeddings.mean(axis=0)
        distances = np.linalg.norm(member_embeddings - centroid, axis=1)
        representative_idx = distances.argmin()

        result["clusters"].append({
            "id": f"cluster-{label}",
            "representativeImage": members[representative_idx],
            "images": members,
            "size": len(members)
        })

    # Save results
    with open(OUTPUT_FILE, "w") as f:
        json.dump(result, f, indent=2)

    # Print summary
    print(f"\n=== Results ===")
    print(f"Clusters formed: {len(result['clusters'])}")
    print(f"Unclustered images: {len(unclustered)}")
    for cluster in result["clusters"]:
        print(f"  {cluster['id']}: {cluster['size']} images (rep: {cluster['representativeImage']})")

    print(f"\nOutput saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
```

#### visualize.py

```python
#!/usr/bin/env python3
"""Generate HTML visualization of clustering results."""

import json
from pathlib import Path

INPUT_FILE = Path("output/clusters.json")
IMAGE_DIR = Path("sample-images")
OUTPUT_FILE = Path("output/clusters.html")

def main():
    with open(INPUT_FILE) as f:
        data = json.load(f)

    html = """<!DOCTYPE html>
<html>
<head>
    <title>Clustering Results</title>
    <style>
        body { font-family: system-ui; padding: 20px; background: #1a1a1a; color: #fff; }
        .cluster { margin-bottom: 40px; }
        .cluster h2 { border-bottom: 1px solid #444; padding-bottom: 10px; }
        .images { display: flex; flex-wrap: wrap; gap: 10px; }
        .images img { width: 200px; height: 150px; object-fit: cover; border-radius: 4px; }
        .representative { border: 3px solid #4CAF50; }
        .unclustered { opacity: 0.6; }
    </style>
</head>
<body>
    <h1>Clustering Results</h1>
"""

    for cluster in data["clusters"]:
        html += f"""
    <div class="cluster">
        <h2>{cluster['id']} ({cluster['size']} images)</h2>
        <div class="images">
"""
        for img_id in cluster["images"]:
            is_rep = img_id == cluster["representativeImage"]
            cls = "representative" if is_rep else ""
            html += f'            <img src="../sample-images/{img_id}-800w.webp" class="{cls}" title="{img_id}">\n'
        html += """        </div>
    </div>
"""

    if data["unclustered"]:
        html += """
    <div class="cluster">
        <h2>Unclustered</h2>
        <div class="images unclustered">
"""
        for img_id in data["unclustered"]:
            html += f'            <img src="../sample-images/{img_id}-800w.webp" title="{img_id}">\n'
        html += """        </div>
    </div>
"""

    html += """</body>
</html>"""

    OUTPUT_FILE.write_text(html)
    print(f"Visualization saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
```

---

## Phase 2: TypeScript Production

### Directory Structure

```
libs/image-cluster/
├── project.json
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── cli.ts
│   ├── config/
│   │   ├── index.ts
│   │   └── cluster-config.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── embedding-service.ts
│   │   ├── cluster-service.ts
│   │   └── r2-download-service.ts
│   └── types/
│       └── index.ts
└── models/                      # gitignored
    └── clip-vit-b32.onnx
```

### Key Services

#### EmbeddingService

```typescript
import { Context, Effect, Layer } from "effect";
import * as ort from "onnxruntime-node";
import sharp from "sharp";

export interface EmbeddingServiceShape {
  readonly embedImage: (imagePath: string) => Effect.Effect<Float32Array, EmbeddingError>;
  readonly embedBatch: (paths: string[]) => Effect.Effect<Float32Array[], EmbeddingError>;
}

export class EmbeddingService extends Context.Tag("@geohints/EmbeddingService")<
  EmbeddingService,
  EmbeddingServiceShape
>() {
  static readonly layer = Layer.effect(
    EmbeddingService,
    Effect.gen(function* () {
      // Load ONNX model
      const session = yield* Effect.tryPromise({
        try: () => ort.InferenceSession.create("models/clip-vit-b32.onnx"),
        catch: (e) => new EmbeddingError("Failed to load ONNX model", e),
      });

      const preprocess = (imagePath: string) =>
        Effect.tryPromise({
          try: async () => {
            // Resize to 224x224, normalize to [-1, 1]
            const buffer = await sharp(imagePath)
              .resize(224, 224, { fit: "cover" })
              .raw()
              .toBuffer();
            // ... normalization logic
            return new Float32Array(buffer);
          },
          catch: (e) => new EmbeddingError("Failed to preprocess", e),
        });

      const embedImage = (imagePath: string) =>
        Effect.gen(function* () {
          const input = yield* preprocess(imagePath);
          const tensor = new ort.Tensor("float32", input, [1, 3, 224, 224]);
          const result = yield* Effect.tryPromise({
            try: () => session.run({ input: tensor }),
            catch: (e) => new EmbeddingError("Inference failed", e),
          });
          return result.output.data as Float32Array;
        });

      return { embedImage, embedBatch };
    }),
  );
}
```

#### ClusterService

```typescript
import { Context, Effect, Layer } from "effect";

export interface ClusterServiceShape {
  readonly cluster: (
    embeddings: Float32Array[],
    options: ClusterOptions,
  ) => Effect.Effect<ClusterResult>;
}

interface ClusterOptions {
  minClusterSize: number;
  metric: "cosine" | "euclidean";
}

interface ClusterResult {
  labels: number[];
  numClusters: number;
}

// Implementation using custom HDBSCAN or k-means
```

### CLI Commands

```typescript
// cli.ts
import { Command } from "@effect/cli";

const download = Command.make("download", {
  category: Options.text("category").pipe(Options.withDefault("bollards")),
  sample: Options.integer("sample").pipe(Options.withDefault(20)),
  output: Options.text("output").pipe(Options.withDefault("./cluster-images")),
});

const cluster = Command.make("cluster", {
  category: Options.text("category").pipe(Options.withDefault("bollards")),
  input: Options.text("input").pipe(Options.withDefault("./cluster-images")),
  output: Options.text("output").pipe(Options.withDefault("./cluster-output")),
  minSize: Options.integer("min-size").pipe(Options.withDefault(3)),
});

const visualize = Command.make("visualize", {
  input: Options.text("input"),
  output: Options.text("output").pipe(Options.withDefault("./clusters.html")),
});

export const cli = Command.run(
  Command.make("image-cluster").pipe(
    Command.withSubcommands([download, cluster, visualize]),
  ),
  { name: "image-cluster", version: "1.0.0" },
);
```

### package.json Scripts

```json
{
  "scripts": {
    "cluster:download": "tsx libs/image-cluster/src/cli.ts download",
    "cluster:run": "tsx libs/image-cluster/src/cli.ts cluster",
    "cluster:visualize": "tsx libs/image-cluster/src/cli.ts visualize"
  }
}
```

---

## Data Integration

### Generated Output

After clustering and human curation:

```typescript
// apps/web/src/data/bollard-clusters.ts
export interface BollardCluster {
  id: string;
  name: string;              // Human-assigned
  description?: string;      // Visual characteristics
  representativeImage: {
    country: string;
    seq: number;
  };
  countries: Array<{
    code: string;
    images: number[];        // Sequence numbers
  }>;
}

export const bollardClusters: BollardCluster[] = [
  {
    id: "white-cylindrical",
    name: "White Cylindrical",
    description: "Tall white cylinder with reflective band",
    representativeImage: { country: "DE", seq: 1 },
    countries: [
      { code: "DE", images: [1, 3] },
      { code: "AT", images: [2] },
      { code: "CH", images: [1, 4] },
    ],
  },
  // ...
];
```

### UX Component Usage

```tsx
// apps/web/src/routes/bollards/types/index.tsx
import { bollardClusters } from "~/data/bollard-clusters";

export default component$(() => {
  return (
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {bollardClusters.map((cluster) => (
        <a href={`/bollards/types/${cluster.id}`} key={cluster.id}>
          <img
            src={getBollardImageUrl(
              cluster.representativeImage.country,
              cluster.representativeImage.seq,
            )}
            alt={cluster.name}
          />
          <h3>{cluster.name}</h3>
          <p>{cluster.countries.length} countries</p>
        </a>
      ))}
    </div>
  );
});
```

---

## Future: Object-Level Detection

If image-level clustering is insufficient (backgrounds dominate), implement:

```
Image → Detect Objects (YOLO) → Crop → Embed → Cluster
```

This requires:

1. Object detection model (YOLO-World for open-vocab)
2. Bounding box extraction
3. Cropped image embedding
4. Link cropped embeddings back to source images
