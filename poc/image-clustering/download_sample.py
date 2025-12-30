#!/usr/bin/env python3
"""
Download sample images from R2 for clustering POC.

Uses the public R2 URL to download images without wrangler authentication.

Usage:
    python download_sample.py [--category bollards] [--sample 20]
"""

import argparse
import urllib.request
from pathlib import Path

# Public R2 bucket URL
R2_BASE_URL = "https://pub-3d7bacd76def438caae68643612e60f9.r2.dev"
OUTPUT_DIR = Path(__file__).parent / "sample-images"

# Sample bollard images - diverse selection from different countries
# Format: (country_code, sequence_number)
BOLLARD_SAMPLES = [
    ("al", 1),
    ("ad", 1),
    ("ad", 2),
    ("ar", 1),
    ("au", 1),
    ("au", 2),
    ("au", 3),
    ("at", 1),
    ("at", 2),
    ("at", 3),
    ("be", 1),
    ("be", 2),
    ("br", 1),
    ("ca", 1),
    ("ca", 2),
    ("ca", 3),
    ("cl", 1),
    ("dk", 1),
    ("dk", 2),
    ("de", 1),
    ("de", 2),
    ("de", 3),
    ("fi", 1),
    ("fr", 1),
    ("fr", 2),
    ("gb", 1),
    ("gb", 2),
    ("gr", 1),
    ("ie", 1),
    ("it", 1),
    ("it", 2),
    ("jp", 1),
    ("mx", 1),
    ("nl", 1),
    ("nl", 2),
    ("nz", 1),
    ("no", 1),
    ("pl", 1),
    ("pt", 1),
    ("es", 1),
    ("se", 1),
    ("ch", 1),
    ("us", 1),
    ("us", 2),
    ("us", 3),
]

# Sample follow-car images - UUIDs from different countries
FOLLOW_CAR_SAMPLES = [
    ("ar", "2bab7d9f"),
    ("at", "8e8d1e7d"),
    ("au", "05f0ff9d"),
    ("br", "84d9b2ad"),
    ("ca", "5efdae3c"),
    ("ch", "9b11ad04"),
    ("de", "7a5f3f02"),
    ("es", "2d2ae16a"),
    ("fr", "b3f5accc"),
    ("gb", "0a820fb2"),
    ("it", "01b0dfd9"),
    ("jp", "7bfac1e6"),
    ("mx", "b0b89c35"),
    ("nl", "50bfcbe8"),
    ("nz", "24e6f3b9"),
    ("pl", "73bb9f1c"),
    ("pt", "a8a32f9a"),
    ("se", "3e8ae5f1"),
    ("us", "d74aafc8"),
    ("za", "25adebfc"),
]


def download_image(url: str, local_path: Path) -> bool:
    """Download single image from URL."""
    try:
        request = urllib.request.Request(
            url,
            headers={"User-Agent": "GeoHints-ImageClustering-POC/1.0"},
        )
        with urllib.request.urlopen(request) as response:
            local_path.write_bytes(response.read())
        return True
    except Exception as e:
        print(f"  [error] {e}")
        return False


def bollard_url(cc: str, seq: int) -> str:
    """Generate URL for bollard image."""
    return f"{R2_BASE_URL}/bollards/{cc}/{cc}-{seq:03d}-800w.webp"


def bollard_filename(cc: str, seq: int) -> str:
    """Generate filename for bollard image."""
    return f"{cc}-{seq:03d}-800w.webp"


def follow_car_url(cc: str, hash_id: str) -> str:
    """Generate URL for follow-car image."""
    return f"{R2_BASE_URL}/follow-cars/{cc}/{hash_id}-800w.webp"


def follow_car_filename(cc: str, hash_id: str) -> str:
    """Generate filename for follow-car image."""
    return f"{cc}-{hash_id}-800w.webp"


def main():
    parser = argparse.ArgumentParser(description="Download sample images from R2")
    parser.add_argument(
        "--category",
        default="bollards",
        choices=["bollards", "follow-cars"],
        help="Category to download (default: bollards)",
    )
    parser.add_argument(
        "--sample", type=int, default=20, help="Number of images to download (default: 20)"
    )
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(exist_ok=True)

    downloaded = 0
    skipped = 0
    failed = 0

    def process_download(filename: str, url: str) -> None:
        nonlocal downloaded, skipped, failed
        local_path = OUTPUT_DIR / filename
        if local_path.exists():
            print(f"  [skip] {filename}")
            skipped += 1
        else:
            print(f"  [download] {filename}")
            if download_image(url, local_path):
                downloaded += 1
            else:
                failed += 1

    if args.category == "bollards":
        samples = BOLLARD_SAMPLES[: args.sample]
        print(f"Downloading {len(samples)} bollard images...")
        for cc, seq in samples:
            process_download(bollard_filename(cc, seq), bollard_url(cc, seq))
    else:
        samples = FOLLOW_CAR_SAMPLES[: args.sample]
        print(f"Downloading {len(samples)} follow-car images...")
        for cc, hash_id in samples:
            process_download(follow_car_filename(cc, hash_id), follow_car_url(cc, hash_id))

    print(f"\nComplete: {downloaded} downloaded, {skipped} skipped, {failed} failed")
    print(f"Images saved to: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
