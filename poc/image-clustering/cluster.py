#!/usr/bin/env python3
"""
Generate embeddings and cluster images using imgbeddings + HDBSCAN.

Usage:
    python cluster.py [--input sample-images] [--output output/clusters.json]
"""

import argparse
import json
import re
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import hdbscan
import numpy as np
from imgbeddings import imgbeddings
from PIL import Image

# Type aliases for clarity (not strict TypedDicts for POC simplicity)
ImageData = dict[str, str]
ClusterInfo = dict[str, Any]
ClusterResult = dict[str, Any]

# Parse image filename to extract country and identifier
# Formats:
#   bollards: de-001-800w.webp -> (de, 001)
#   follow-cars: us/66e09dbb-800w.webp -> (us, 66e09dbb)
BOLLARD_PATTERN = re.compile(r"^([a-z]{2})-(\d+)-\d+w\.webp$")
FOLLOW_CAR_PATTERN = re.compile(r"^([a-z]{2})-([a-f0-9]{8})-\d+w\.webp$")


def parse_image_id(filename: str) -> ImageData:
    """Parse image filename into country and identifier."""
    name = filename.lower()

    match = BOLLARD_PATTERN.match(name)
    if match:
        return {
            "country": match.group(1).upper(),
            "identifier": match.group(2),
            "type": "bollard",
        }

    match = FOLLOW_CAR_PATTERN.match(name)
    if match:
        return {
            "country": match.group(1).upper(),
            "identifier": match.group(2),
            "type": "follow-car",
        }

    # Fallback: use filename as identifier
    return {
        "country": "XX",
        "identifier": Path(filename).stem,
        "type": "unknown",
    }


def main():
    parser = argparse.ArgumentParser(description="Cluster images using CLIP embeddings")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).parent / "sample-images",
        help="Input directory with images",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).parent / "output" / "clusters.json",
        help="Output JSON file",
    )
    parser.add_argument(
        "--min-cluster-size",
        type=int,
        default=2,
        help="Minimum cluster size for HDBSCAN (default: 2 for small samples)",
    )
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)

    # Find images
    image_files = sorted(args.input.glob("*.webp"))
    if not image_files:
        print(f"No .webp images found in {args.input}", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(image_files)} images")

    # Load embedding model
    print("\nLoading CLIP embedding model (first run downloads ~88MB)...")
    ibed = imgbeddings()

    # Generate embeddings
    print("\nGenerating embeddings...")
    embedding_list: list[np.ndarray] = []
    image_data: list[ImageData] = []

    for i, img_path in enumerate(image_files, 1):
        try:
            img = Image.open(img_path)
            emb = ibed.to_embeddings(img)
            embedding_list.append(emb.flatten())
            image_data.append(
                {
                    "filename": img_path.name,
                    **parse_image_id(img_path.name),
                }
            )
            print(f"  [{i}/{len(image_files)}] {img_path.name}")
        except Exception as e:
            print(f"  [ERROR] {img_path.name}: {e}", file=sys.stderr)

    if not embedding_list:
        print("No embeddings generated", file=sys.stderr)
        sys.exit(1)

    embeddings = np.array(embedding_list)
    print(f"\nEmbedding shape: {embeddings.shape}")

    # Normalize embeddings for cosine similarity
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    normalized = embeddings / norms

    # Cluster with HDBSCAN
    print(f"\nClustering with HDBSCAN (min_cluster_size={args.min_cluster_size})...")
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=args.min_cluster_size,
        metric="euclidean",  # On normalized vectors, euclidean ~ cosine
        cluster_selection_method="eom",
    )
    labels = clusterer.fit_predict(normalized)

    # Group by cluster
    clusters_dict: dict[int, list[int]] = {}
    unclustered_indices: list[int] = []

    for idx, label in enumerate(labels):
        if label == -1:
            unclustered_indices.append(idx)
        else:
            if label not in clusters_dict:
                clusters_dict[label] = []
            clusters_dict[label].append(idx)

    # Build result
    result: ClusterResult = {
        "generatedAt": datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        "model": "imgbeddings-clip-vit-b32",
        "settings": {
            "min_cluster_size": args.min_cluster_size,
            "metric": "cosine",
        },
        "summary": {
            "total_images": len(image_data),
            "num_clusters": len(clusters_dict),
            "num_unclustered": len(unclustered_indices),
        },
        "clusters": [],
        "unclustered": [],
    }

    # Process each cluster
    for label in sorted(clusters_dict.keys()):
        member_indices = clusters_dict[label]
        member_embeddings = normalized[member_indices]

        # Find representative (closest to centroid)
        centroid = member_embeddings.mean(axis=0)
        distances = np.linalg.norm(member_embeddings - centroid, axis=1)
        rep_local_idx = int(distances.argmin())
        rep_global_idx = member_indices[rep_local_idx]

        cluster_info: ClusterInfo = {
            "id": f"cluster-{label}",
            "size": len(member_indices),
            "representative": image_data[rep_global_idx],
            "members": [image_data[idx] for idx in member_indices],
        }
        result["clusters"].append(cluster_info)

    # Add unclustered
    result["unclustered"] = [image_data[idx] for idx in unclustered_indices]

    # Save results
    with open(args.output, "w") as f:
        json.dump(result, f, indent=2)

    # Print summary
    print("\n" + "=" * 50)
    print("CLUSTERING RESULTS")
    print("=" * 50)
    print(f"Total images:     {result['summary']['total_images']}")
    print(f"Clusters formed:  {result['summary']['num_clusters']}")
    print(f"Unclustered:      {result['summary']['num_unclustered']}")
    print()

    for cluster in result["clusters"]:
        countries = {m["country"] for m in cluster["members"]}
        print(
            f"  {cluster['id']}: {cluster['size']} images "
            f"(countries: {', '.join(sorted(countries))})"
        )
        print(f"    Representative: {cluster['representative']['filename']}")

    if result["unclustered"]:
        print(f"\n  Unclustered ({len(result['unclustered'])} images):")
        for item in result["unclustered"]:
            print(f"    - {item['filename']}")

    print(f"\nOutput saved to: {args.output}")


if __name__ == "__main__":
    main()
