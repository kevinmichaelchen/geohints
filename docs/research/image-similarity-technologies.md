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
| **MobileCLIP2**     | Apple MLX       | Local (Mac) | Free         | Fast mobile inference       | Low                    |
| **mlx-embeddings**  | Apple MLX       | Local (Mac) | Free         | Mac-native embeddings ⭐    | Very Low               |
| **YOLO-World**      | Object Detect   | Local       | Free         | Open-vocab detection        | Medium                 |
| **OWL-ViT**         | Object Detect   | Local       | Free         | CLIP-based detection        | Medium                 |

---

## 🔑 Critical Insight: Object-Level vs Image-Level Similarity

**The Problem:** Standard image embedding models (CLIP, DINOv2, imgbeddings) embed the **entire image**. When our bollard images have busy backgrounds (roads, cars, buildings), the embeddings capture the whole scene, not just the bollard.

**The Solution: Detect → Crop → Embed**

For true object-level similarity, we need a three-step workflow:

1. **Detect**: Use object detection (YOLO, OWL-ViT) to find bollards in images
2. **Crop**: Extract bounding boxes to isolate just the bollards
3. **Embed**: Generate embeddings from cropped objects only

This approach retrieves crops and links them back to parent images, enabling "which countries have THIS bollard?" queries.

### Implementation Workflow

```python
# Object-level similarity workflow
from ultralytics import YOLO
from imgbeddings import imgbeddings
from PIL import Image

# 1. Detect bollards in image
detector = YOLO("yolov8n.pt")  # Or fine-tuned model
results = detector("bollard_scene.jpg")

# 2. Crop detected objects
crops = []
for box in results[0].boxes:
    x1, y1, x2, y2 = box.xyxy[0].tolist()
    crop = Image.open("bollard_scene.jpg").crop((x1, y1, x2, y2))
    crops.append(crop)

# 3. Embed cropped objects
ibed = imgbeddings()
for i, crop in enumerate(crops):
    embedding = ibed.to_embeddings(crop)
    # Store with reference to parent image
    store_embedding(embedding, parent_image="bollard_scene.jpg", crop_index=i)
```

### When to Use Each Approach

| Approach         | Use Case                       | Our Situation                           |
| ---------------- | ------------------------------ | --------------------------------------- |
| **Image-level**  | Object fills most of frame     | ❌ Bollards are often small in frame    |
| **Object-level** | Object is part of larger scene | ✅ Street scenes with bollards          |
| **Hybrid**       | Mix of both                    | ✅ Some images are cropped, some aren't |

**Recommendation:** Start with image-level embeddings (simpler). If clustering quality is poor, implement detect→crop→embed for better isolation.

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

### 7. Apple MLX (Mac-Native)

For Mac users, Apple's MLX framework offers native GPU acceleration on Apple Silicon.

#### MobileCLIP2 (Apple Research)

- Released TMLR August 2025 with Featured Certification
- Matches SigLIP-SO400M accuracy with **2x fewer parameters**
- 2.5x lower latency than DFN ViT-L/14 on iPhone
- Available on HuggingFace with MLX checkpoints

#### mlx-embeddings Package

**What it is:** Best package for running vision and language embedding models locally on Mac using MLX.

**Key features:**

- Supports SigLIP models (`mlx-community/siglip-so400m-patch14-384`)
- Native Apple Silicon acceleration
- No PyTorch required

**Integration:**

```python
# pip install mlx-embeddings
from mlx_embeddings import load_model

model = load_model("mlx-community/siglip-so400m-patch14-384")
embedding = model.encode_image("bollard.jpg")
```

#### mlx_clip Package

Simple MLX wrapper for CLIP:

```python
# pip install mlx_clip
from mlx_clip import MLX_CLIP

clip = MLX_CLIP()
embedding = clip.embed_image("bollard.jpg")
```

**Links:**

- [mlx-embeddings GitHub](https://github.com/Blaizzy/mlx-embeddings)
- [mlx_clip GitHub](https://github.com/harperreed/mlx_clip)
- [MobileCLIP2 GitHub](https://github.com/apple/ml-mobileclip)

---

### 8. Object Detection Models (for Detect→Crop→Embed)

For object-level similarity, we need detection before embedding.

#### YOLO-World (Open Vocabulary)

- Released V2.1 February 2025
- **Open-vocabulary detection**: Detect any object by text description
- No fine-tuning required for new classes
- Supports prompt tuning and image prompts
- Ideal for: "Detect all bollards in this image"

**Integration:**

```python
from ultralytics import YOLO

model = YOLO("yolov8x-worldv2")
model.set_classes(["bollard", "post", "marker"])
results = model("street_scene.jpg")
```

#### OWL-ViT (CLIP-based Detection)

- Uses CLIP's shared embedding space
- Can detect objects using text OR image queries
- **Zero-shot detection**: No training needed
- HuggingFace Transformers integration

**Integration:**

```python
from transformers import OwlViTProcessor, OwlViTForObjectDetection

processor = OwlViTProcessor.from_pretrained("google/owlvit-base-patch32")
model = OwlViTForObjectDetection.from_pretrained("google/owlvit-base-patch32")

texts = [["a photo of a bollard", "a photo of a road marker"]]
inputs = processor(text=texts, images=image, return_tensors="pt")
outputs = model(**inputs)
```

**Links:**

- [YOLO-World GitHub](https://github.com/AILab-CVC/YOLO-World)
- [OWL-ViT HuggingFace](https://huggingface.co/docs/transformers/model_doc/owlvit)
- [YOLOv10 (NeurIPS 2024)](https://github.com/THU-MIG/yolov10)

---

### 9. SAM 3 Update (November 2025)

Meta's latest SAM 3 introduces concept-based segmentation:

**New capabilities:**

- Detect, segment, AND track all instances of a concept
- Text prompts, image exemplars, or both
- Finds every occurrence in images/videos (not just single objects)
- DETR-based architecture for detection

**Perfect for preprocessing:**

- Segment all bollards in a scene automatically
- Export cropped objects for embedding
- Link segments back to source images

---

## Recommendation

### Phased Approach

#### Phase 1: Start Simple (imgbeddings + HDBSCAN)

**Why start here:**

1. **Zero dependencies** - No PyTorch/TensorFlow installation needed
2. **Fast** - Can process all 154 images in under a minute
3. **Free** - Runs entirely locally
4. **Simple** - ~30 lines of Python for complete clustering
5. **Proven** - Built on CLIP's robust visual understanding

#### Phase 2: Upgrade if Needed (Object-Level Similarity)

If Phase 1 clustering quality is poor (backgrounds dominate embeddings), implement:

**Detect → Crop → Embed Pipeline:**

1. Use YOLO-World to detect bollards in each image
2. Crop bounding boxes to isolate bollards
3. Embed cropped objects with imgbeddings
4. Cluster on object embeddings

### Implementation Plan

**Phase 1: Quick Start**

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

**Phase 2: Object-Level (if needed)**

```python
# scripts/cluster-bollards-object-level.py
from ultralytics import YOLO
from imgbeddings import imgbeddings
from PIL import Image
import hdbscan
import numpy as np
import json
from pathlib import Path

# 1. Initialize models
detector = YOLO("yolov8x-worldv2")
detector.set_classes(["bollard", "road marker", "post", "traffic post"])
ibed = imgbeddings()

embeddings = []
metadata = []

# 2. Process each image
for image_path in Path("bollards/").glob("**/*.webp"):
    img = Image.open(image_path)
    results = detector(img)

    for i, box in enumerate(results[0].boxes):
        # Crop detected object
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        crop = img.crop((x1, y1, x2, y2))

        # Embed cropped object
        emb = ibed.to_embeddings(crop)
        embeddings.append(emb)
        metadata.append({
            "parent": image_path.stem,
            "crop_index": i,
            "bbox": [x1, y1, x2, y2]
        })

# 3. Cluster on object embeddings
embeddings = np.array(embeddings)
clusterer = hdbscan.HDBSCAN(min_cluster_size=3, metric='cosine')
cluster_labels = clusterer.fit_predict(embeddings)

# 4. Group by cluster with parent image references
clusters = {}
for meta, cluster in zip(metadata, cluster_labels):
    if cluster not in clusters:
        clusters[cluster] = []
    clusters[cluster].append(meta)

with open("bollard-object-clusters.json", "w") as f:
    json.dump(clusters, f, indent=2)
```

### Mac-Specific Alternative (MLX)

For Apple Silicon Macs, replace imgbeddings with mlx-embeddings for faster processing:

```python
# pip install mlx-embeddings
from mlx_embeddings import load_model

model = load_model("mlx-community/siglip-so400m-patch14-384")
embedding = model.encode_image("bollard.jpg")
```

### Optional Enhancement: SAM 3 Preprocessing

For highest quality isolation:

1. Run SAM 3 with text prompt "bollard" to segment all bollards
2. Extract masked regions as cropped images
3. Embed cropped objects
4. Cluster

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

### Embedding Models

- [imgbeddings PyPI](https://pypi.org/project/imgbeddings/)
- [imgbeddings GitHub](https://github.com/minimaxir/imgbeddings)
- [DINOv2 HuggingFace](https://huggingface.co/facebook/dinov2-base)
- [DINOv2 + HDBSCAN Tutorial](https://medium.com/@EnginDenizTangut/image-clustering-with-dinov2-and-hdbscan)
- [CLIP + FAISS Tutorial](https://towardsdatascience.com/building-an-image-similarity-search-engine-with-faiss-and-clip-2211126d08fa/)
- [OpenCLIP GitHub](https://github.com/mlfoundations/open_clip)

### Apple MLX

- [mlx-embeddings GitHub](https://github.com/Blaizzy/mlx-embeddings)
- [mlx_clip GitHub](https://github.com/harperreed/mlx_clip)
- [MobileCLIP2 GitHub](https://github.com/apple/ml-mobileclip)
- [CLIP with MLX Tutorial](https://unfoldai.com/clip-with-mlx-multimodal/)
- [FastVLM Apple Research](https://machinelearning.apple.com/research/fast-vision-language-models)

### Object Detection (Detect→Crop→Embed)

- [YOLO + CLIP Tutorial](https://www.akshaymakes.com/blogs/clip-yolo) - Key workflow reference
- [YOLO-World GitHub](https://github.com/AILab-CVC/YOLO-World)
- [YOLOv10 (NeurIPS 2024)](https://github.com/THU-MIG/yolov10)
- [OWL-ViT HuggingFace](https://huggingface.co/learn/computer-vision-course/en/unit4/multimodal-models/clip-and-relatives/owl_vit)
- [HuggingFace Object Detection](https://huggingface.co/docs/transformers/tasks/object_detection)

### Segmentation

- [SAM 3 Roboflow](https://blog.roboflow.com/what-is-sam3/)
- [Meta SAM 2](https://ai.meta.com/sam2/)
- [SAM GitHub](https://github.com/facebookresearch/segment-anything)
- [SAM Background Removal](https://github.com/MrSyee/SAM-remove-background)

### Vision-Language Models

- [Moondream](https://moondream.ai)
- [SigLIP 2 Blog](https://huggingface.co/blog/siglip2)
- [HuggingFace Image Similarity](https://huggingface.co/blog/image-similarity)

### Cloud APIs (Lower Priority)

- [Google Vision Pricing](https://cloud.google.com/vision/pricing)
- [AWS Rekognition Pricing](https://aws.amazon.com/rekognition/pricing/)
- [Roboflow CLIP Workflow](https://docs.roboflow.com/deploy/serverless/foundation-models/clip)
