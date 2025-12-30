#!/usr/bin/env python3
"""
Download sample images from R2 for clustering POC.

Usage:
    python download_sample.py [--category bollards] [--sample 20]
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

R2_BUCKET = "geohints-images"
OUTPUT_DIR = Path(__file__).parent / "sample-images"


def list_r2_objects(prefix: str) -> list[dict]:
    """List objects in R2 bucket with given prefix."""
    try:
        result = subprocess.run(
            [
                "npx",
                "wrangler",
                "r2",
                "object",
                "list",
                R2_BUCKET,
                f"--prefix={prefix}",
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        data = json.loads(result.stdout)
        return data.get("objects", [])
    except subprocess.CalledProcessError as e:
        print(f"Error listing R2 objects: {e.stderr}", file=sys.stderr)
        return []
    except json.JSONDecodeError:
        print("Error parsing R2 response", file=sys.stderr)
        return []


def download_object(key: str, local_path: Path) -> bool:
    """Download single object from R2."""
    try:
        subprocess.run(
            [
                "npx",
                "wrangler",
                "r2",
                "object",
                "get",
                f"{R2_BUCKET}/{key}",
                f"--file={local_path}",
                "--remote",
            ],
            check=True,
            capture_output=True,
        )
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error downloading {key}: {e.stderr}", file=sys.stderr)
        return False


def main():
    parser = argparse.ArgumentParser(description="Download sample images from R2")
    parser.add_argument(
        "--category", default="bollards", help="Category to download (default: bollards)"
    )
    parser.add_argument(
        "--sample", type=int, default=20, help="Number of images to download (default: 20)"
    )
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(exist_ok=True)

    print(f"Listing images in {args.category}/...")
    objects = list_r2_objects(f"{args.category}/")

    if not objects:
        print("No objects found. Check if wrangler is authenticated.", file=sys.stderr)
        sys.exit(1)

    # Filter to 800w images only (good balance of quality and size)
    keys_800w = [obj["key"] for obj in objects if "-800w.webp" in obj["key"]]
    print(f"Found {len(keys_800w)} 800w images")

    # Sample from different countries by sorting and spacing
    keys_800w.sort()  # Sort to group by country
    step = max(1, len(keys_800w) // args.sample)
    sample = keys_800w[::step][: args.sample]

    print(f"Downloading {len(sample)} sample images...")

    downloaded = 0
    skipped = 0

    for key in sample:
        filename = key.split("/")[-1]
        local_path = OUTPUT_DIR / filename

        if local_path.exists():
            print(f"  [skip] {filename}")
            skipped += 1
        else:
            print(f"  [download] {filename}")
            if download_object(key, local_path):
                downloaded += 1
            else:
                print(f"  [failed] {filename}")

    print(f"\nComplete: {downloaded} downloaded, {skipped} skipped")
    print(f"Images saved to: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
