#!/usr/bin/env python3
"""
Generate HTML visualization of clustering results.

Usage:
    python visualize.py [--input output/clusters.json] [--output output/clusters.html]
"""

import argparse
import json
from pathlib import Path


def generate_html(data: dict, image_dir: str = "../sample-images") -> str:
    """Generate HTML visualization from clustering results."""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Clustering Results</title>
    <style>
        * {{
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #1a1a2e;
            color: #eee;
            line-height: 1.6;
        }}
        h1 {{
            color: #e94560;
            border-bottom: 2px solid #e94560;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }}
        .summary {{
            background: #16213e;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }}
        .summary-item {{
            text-align: center;
        }}
        .summary-value {{
            font-size: 2em;
            font-weight: bold;
            color: #e94560;
        }}
        .summary-label {{
            color: #888;
            font-size: 0.9em;
        }}
        .cluster {{
            background: #16213e;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }}
        .cluster h2 {{
            margin: 0 0 15px 0;
            color: #0f3460;
            background: #e94560;
            padding: 10px 15px;
            border-radius: 4px;
            display: inline-block;
        }}
        .cluster-meta {{
            color: #888;
            font-size: 0.9em;
            margin-bottom: 15px;
        }}
        .images {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
        }}
        .image-card {{
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            background: #0f3460;
        }}
        .image-card img {{
            width: 100%;
            height: 120px;
            object-fit: cover;
            display: block;
        }}
        .image-card.representative {{
            box-shadow: 0 0 0 3px #4ecca3;
        }}
        .image-card.representative::before {{
            content: '★ Representative';
            position: absolute;
            top: 5px;
            left: 5px;
            background: #4ecca3;
            color: #1a1a2e;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.7em;
            font-weight: bold;
            z-index: 1;
        }}
        .image-info {{
            padding: 8px;
            font-size: 0.8em;
        }}
        .image-info .country {{
            font-weight: bold;
            color: #e94560;
        }}
        .image-info .filename {{
            color: #888;
            word-break: break-all;
        }}
        .unclustered {{
            opacity: 0.7;
        }}
        .unclustered h2 {{
            background: #666;
        }}
        .meta {{
            color: #666;
            font-size: 0.8em;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #333;
        }}
    </style>
</head>
<body>
    <h1>Image Clustering Results</h1>

    <div class="summary">
        <div class="summary-item">
            <div class="summary-value">{data["summary"]["total_images"]}</div>
            <div class="summary-label">Total Images</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{data["summary"]["num_clusters"]}</div>
            <div class="summary-label">Clusters</div>
        </div>
        <div class="summary-item">
            <div class="summary-value">{data["summary"]["num_unclustered"]}</div>
            <div class="summary-label">Unclustered</div>
        </div>
    </div>
"""

    # Clusters
    for cluster in data["clusters"]:
        countries = sorted({m["country"] for m in cluster["members"]})
        rep_filename = cluster["representative"]["filename"]

        html += f"""
    <div class="cluster">
        <h2>{cluster["id"]}</h2>
        <div class="cluster-meta">
            {cluster["size"]} images | Countries: {", ".join(countries)}
        </div>
        <div class="images">
"""

        for member in cluster["members"]:
            is_rep = member["filename"] == rep_filename
            card_class = "image-card representative" if is_rep else "image-card"

            html += f"""            <div class="{card_class}">
                <img src="{image_dir}/{member["filename"]}" alt="{member["filename"]}" loading="lazy">
                <div class="image-info">
                    <span class="country">{member["country"]}</span>
                    <div class="filename">{member["identifier"]}</div>
                </div>
            </div>
"""

        html += """        </div>
    </div>
"""

    # Unclustered
    if data["unclustered"]:
        html += f"""
    <div class="cluster unclustered">
        <h2>Unclustered</h2>
        <div class="cluster-meta">
            {len(data["unclustered"])} images that didn't fit any cluster
        </div>
        <div class="images">
"""

        for member in data["unclustered"]:
            html += f"""            <div class="image-card">
                <img src="{image_dir}/{member["filename"]}" alt="{member["filename"]}" loading="lazy">
                <div class="image-info">
                    <span class="country">{member["country"]}</span>
                    <div class="filename">{member["identifier"]}</div>
                </div>
            </div>
"""

        html += """        </div>
    </div>
"""

    # Footer
    html += f"""
    <div class="meta">
        <p>Generated: {data["generatedAt"]}</p>
        <p>Model: {data["model"]}</p>
        <p>Settings: min_cluster_size={data["settings"]["min_cluster_size"]}, metric={data["settings"]["metric"]}</p>
    </div>
</body>
</html>
"""

    return html


def main():
    parser = argparse.ArgumentParser(
        description="Generate HTML visualization of clustering results"
    )
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(__file__).parent / "output" / "clusters.json",
        help="Input JSON file from cluster.py",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).parent / "output" / "clusters.html",
        help="Output HTML file",
    )
    args = parser.parse_args()

    if not args.input.exists():
        print(f"Input file not found: {args.input}")
        print("Run cluster.py first to generate clustering results.")
        return

    with open(args.input) as f:
        data = json.load(f)

    html = generate_html(data)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(html)

    print(f"Visualization saved to: {args.output}")
    print(f"Open in browser: file://{args.output.resolve()}")


if __name__ == "__main__":
    main()
