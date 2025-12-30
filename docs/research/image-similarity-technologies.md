# Image Similarity Technologies Research

## Purpose

Research AI technologies to automatically cluster similar bollard images, enabling a "type-first" UX where users browse by bollard appearance rather than geography.

---

## Technology Comparison Matrix

| Technology          | Type            | Local/Cloud | Cost         | Best For                    | Integration Complexity |
| ------------------- | --------------- | ----------- | ------------ | --------------------------- | ---------------------- |
| **imgbeddings**     | CLIP embeddings | Local       | Free         | Our use case ⭐             | Very Low               |
| **CLIP (OpenAI)**   | Embeddings      | Local       | Free         | Semantic similarity         | Medium                 |
| **DINOv2** (Meta)   | Self-supervised | Local       | Free         | Pure visual similarity      | Medium                 |
| **Moondream**       | Vision-language | Local/Cloud | Free tier    | Descriptions + segmentation | Medium                 |
| **SAM** (Meta)      | Segmentation    | Local       | Free         | Preprocessing (bg removal)  | Medium                 |
| **Google Vision**   | Cloud API       | Cloud       | $1.50/1K     | Labels, not similarity      | Low                    |
| **AWS Rekognition** | Cloud API       | Cloud       | $0.10+/image | Face matching only          | Low                    |

---

## Detailed Analysis

### 1. imgbeddings (⭐ RECOMMENDED)

**What it is:** Lightweight Python package using ONNX-quantized CLIP models.

**Key advantages:**

- **No PyTorch/TensorFlow required** - uses ONNX runtime
- Model is only 88MB (vs 400MB+ for full CLIP)
- 20-30% faster on CPU than standard CLIP
- Perfect for our 154 images - can run in seconds
- Built-in PCA for dimensionality reduction
- Designed specifically for image clustering use cases

**Integration:**

```python
from imgbeddings import imgbeddings
from PIL import Image

ibed = imgbeddings()
img = Image.open("bollard.jpg")
embedding = ibed.to_embeddings(img)  # Returns 512-dim vector
```

**Clustering workflow:**

1. Generate embeddings for all 154 bollard images
2. Use HDBSCAN or K-means to cluster similar embeddings
3. Manually review/name clusters
4. Store cluster assignments in data model

**Links:**

- [PyPI](https://pypi.org/project/imgbeddings/)
- [GitHub](https://github.com/minimaxir/imgbeddings)

---

### 2. CLIP (OpenAI)

**What it is:** Contrastive Language-Image Pre-Training model that creates embeddings where similar images are close in vector space.

**Key features:**

- 512-dimensional embeddings
- Can compare text to images (e.g., "red and white striped bollard")
- Well-documented with many tutorials
- Works with FAISS for fast similarity search

**Integration:**

```python
import torch
import clip
from PIL import Image

model, preprocess = clip.load("ViT-B/32")
image = preprocess(Image.open("bollard.jpg")).unsqueeze(0)
embedding = model.encode_image(image)
```

**Pros:** Most tutorials/examples available, text-image matching
**Cons:** Requires PyTorch (~2GB), heavier than imgbeddings

**Links:**

- [Roboflow Tutorial](https://blog.roboflow.com/embeddings-clustering-computer-vision-clip-umap/)
- [FAISS + CLIP Tutorial](https://towardsdatascience.com/building-an-image-similarity-search-engine-with-faiss-and-clip-2211126d08fa/)

---

### 3. DINOv2 (Meta)

**What it is:** Self-supervised vision model trained on 142M images without labels. Excellent for pure visual similarity.

**Key features:**

- Focuses on visual features (not semantic/text)
- Strong for finding visually similar objects regardless of context
- DINOv3 released August 2025 with improved performance

**Integration:**

```python
import torch
from transformers import AutoImageProcessor, AutoModel

processor = AutoImageProcessor.from_pretrained('facebook/dinov2-base')
model = AutoModel.from_pretrained('facebook/dinov2-base')

inputs = processor(images=image, return_tensors="pt")
outputs = model(**inputs)
embedding = outputs.last_hidden_state.mean(dim=1)
```

**Pros:** Best for pure visual similarity, robust features
**Cons:** Requires PyTorch, heavier compute

**Links:**

- [HDBSCAN Tutorial](https://medium.com/@EnginDenizTangut/image-clustering-with-dinov2-and-hdbscan)
- [Official Repo](https://github.com/facebookresearch/dinov2)

---

### 4. Moondream

**What it is:** Vision-language model for image understanding with natural language queries.

**Key features:**

- Can describe images: "What type of bollard is this?"
- Segmentation capabilities
- Free self-hosted option (Moondream Station)
- 9K GitHub stars, 2M+ monthly downloads

**Potential use:**

- Generate descriptive attributes: "white cylindrical with red stripe"
- Could create searchable text descriptions alongside embeddings

**Links:**

- [Homepage](https://moondream.ai)
- [Segment skill](https://moondream.ai/skills/segment)

---

### 5. SAM (Segment Anything)

**What it is:** Meta's segmentation model for isolating objects from backgrounds.

**Potential use:**

- **Preprocessing step**: Remove backgrounds from bollard images
- Cleaner images → better embeddings
- SAM 3 released November 2025

**Integration:**

```python
from segment_anything import sam_model_registry, SamPredictor

sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
predictor = SamPredictor(sam)
predictor.set_image(image)
masks, _, _ = predictor.predict(point_coords=[[x, y]], point_labels=[1])
```

**Links:**

- [Background Removal Project](https://github.com/MrSyee/SAM-remove-background)
- [Official Repo](https://github.com/facebookresearch/segment-anything)

---

### 6. Cloud APIs (Lower Priority)

#### Google Cloud Vision

- **Cost:** $1.50/1,000 images (first 1,000 free/month)
- **Feature:** Label detection (e.g., "street sign", "post")
- **Limitation:** Returns generic labels, not similarity scores
- Not ideal for clustering similar bollards

#### AWS Rekognition

- **Cost:** ~$0.10/image
- **Feature:** Face similarity search
- **Limitation:** Designed for faces, not general objects
- Not suitable for bollard comparison

---

## Recommendation

### Primary Approach: imgbeddings + HDBSCAN

**Why:**

1. **Zero dependencies** - No PyTorch/TensorFlow installation needed
2. **Fast** - Can process all 154 images in under a minute
3. **Free** - Runs entirely locally
4. **Simple** - ~30 lines of Python for complete clustering
5. **Proven** - Built on CLIP's robust visual understanding

### Implementation Plan

```python
# scripts/cluster-bollards.py
from imgbeddings import imgbeddings
from PIL import Image
import hdbscan
import numpy as np
import json
from pathlib import Path

# 1. Load all bollard images and generate embeddings
ibed = imgbeddings()
embeddings = []
image_ids = []

for image_path in Path("bollards/").glob("**/*.webp"):
    img = Image.open(image_path)
    emb = ibed.to_embeddings(img)
    embeddings.append(emb)
    image_ids.append(image_path.stem)

embeddings = np.array(embeddings)

# 2. Cluster with HDBSCAN
clusterer = hdbscan.HDBSCAN(min_cluster_size=3, metric='cosine')
cluster_labels = clusterer.fit_predict(embeddings)

# 3. Output cluster assignments
clusters = {}
for img_id, cluster in zip(image_ids, cluster_labels):
    if cluster not in clusters:
        clusters[cluster] = []
    clusters[cluster].append(img_id)

# 4. Save for manual review
with open("bollard-clusters.json", "w") as f:
    json.dump(clusters, f, indent=2)
```

### Optional Enhancement: SAM Preprocessing

If clustering quality is poor due to background noise:

1. Run SAM on each image to isolate the bollard
2. Generate embeddings from masked images
3. Re-cluster

---

## Next Steps

1. **Install imgbeddings:** `pip install imgbeddings pillow hdbscan`
2. **Download bollard images** from R2 bucket
3. **Run clustering script** and review results
4. **Manually name clusters** (e.g., "white-cylindrical", "red-white-stripe")
5. **Create bollard-types.ts** data file
6. **Build new UX** around type-first navigation

---

## Sources

- [imgbeddings PyPI](https://pypi.org/project/imgbeddings/)
- [imgbeddings GitHub](https://github.com/minimaxir/imgbeddings)
- [CLIP + FAISS Tutorial](https://towardsdatascience.com/building-an-image-similarity-search-engine-with-faiss-and-clip-2211126d08fa/)
- [DINOv2 + HDBSCAN Tutorial](https://medium.com/@EnginDenizTangut/image-clustering-with-dinov2-and-hdbscan)
- [Roboflow CLIP Clustering](https://blog.roboflow.com/embeddings-clustering-computer-vision-clip-umap/)
- [Moondream](https://moondream.ai)
- [SAM Background Removal](https://github.com/MrSyee/SAM-remove-background)
- [Google Vision Pricing](https://cloud.google.com/vision/pricing)
- [AWS Rekognition Pricing](https://aws.amazon.com/rekognition/pricing/)
