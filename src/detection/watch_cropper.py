from __future__ import annotations
from functools import lru_cache
import torch
from PIL import Image
from transformers import AutoModelForZeroShotObjectDetection, AutoProcessor

MODEL_ID = "IDEA-Research/grounding-dino-base"
WATCH_PROMPT = "watch. wristwatch."
BOX_THRESHOLD = 0.30
TEXT_THRESHOLD = 0.25
PADDING_RATIO = 0.12
MIN_BOX_AREA_RATIO = 0.02 

def expand_box (
    box: tuple [float, float, float, float] | list[float],
    image_size: tuple[int, int],
    padding_ratio: float = PADDING_RATIO,
): 
    width, height = image_size
    x1, y1, x2, y2 = box
    box_width = x2 - x1
    box_height = y2 - y1
    pad_x = box_width * padding_ratio
    pad_y = box_height * padding_ratio

    return (
        max(0, int(round(x1 - pad_x))),
        max(0, int(round(y1 - pad_y))),
        min(width, int(round(x2 + pad_x))),
        min(height, int(round(y2 +pad_y))),
    )

def is_valid_box(
    box: tuple[int, int, int, int],
    image_size: tuple [int, int],
    min_area_ratio: float = MIN_BOX_AREA_RATIO,
):
    image_width, image_height = image_size
    x1, y1, x2, y2 = box
    box_width = x2 - x1
    box_height = y2 - y1

    if box_width <= 0 or box_height <= 0:
        return False
    box_area = box_width * box_height 
    image_area = image_width * image_height
    return (box_area / image_area) >= min_area_ratio

def crop_from_box (
    image: Image.Image,
    box: tuple[float, float, float, float] | list[float],
    score: float, 
    label: str,
    padding_ratio: float = PADDING_RATIO,
):
    padded_box = expand_box(box, image.size, padding_ratio=padding_ratio)
    if not is_valid_box(padded_box, image.size): 
        return image, {
            "crop_used": False,
            "reason": "invalid_detection_box",
            "box": list(padded_box),
            "score": float (score),
            "label": label,
        }
    
    return image.crop (padded_box), {
        "crop_used": True,
        "box": list (padded_box),
        "score": float (score),
        "label": label,
    }

@lru_cache(maxsize = 1)
def get_detector ():
    processor = AutoProcessor.from_pretrained(MODEL_ID)
    model = AutoModelForZeroShotObjectDetection.from_pretrained (MODEL_ID)
    model.eval()
    return processor, model

def detect_watch (image: Image.Image): 
    processor, detector = get_detector()
    inputs = processor (
        images = image,
        text = WATCH_PROMPT,
        return_tensors = 'pt',
    )

    with torch.no_grad(): 
        outputs = detector(**inputs)

    return processor.post_process_grounded_object_detection(
        outputs, 
        inputs.input_ids,
        threshold = BOX_THRESHOLD,
        text_threshold = TEXT_THRESHOLD,
        target_sizes = [image.size[::-1]],
    )[0]

def crop_watch (image: Image.Image): 
    detections = detect_watch(image)
    boxes = detections["boxes"]
    scores = detections["scores"]
    labels = detections["text_labels"]

    if len(boxes) == 0:
        return image, {
            "crop_used": False,
            "reason": "no_watch_detected",
        }
    
    best_index = int(scores.argmax().item())
    return crop_from_box(
        image,
        box = boxes[best_index].tolist(),
        score = float (scores[best_index].item()),
        label = str (labels[best_index]),
    )
