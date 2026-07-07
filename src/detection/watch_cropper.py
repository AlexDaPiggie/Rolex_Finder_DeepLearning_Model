from __future__ import annotations
from functools import lru_cache
import torch
from PIL import Image
from transformers import AutoModelForZeroShotObjectDetection, AutoProcessor
import cv2
import numpy as np

MODEL_ID = "IDEA-Research/grounding-dino-base"
WATCH_PROMPT = "watch. wristwatch."
BOX_THRESHOLD = 0.30
TEXT_THRESHOLD = 0.25
PADDING_RATIO = 0.12
MIN_BOX_AREA_RATIO = 0.02 
BRACELET_CENTER_MASK_RATIO = 0.42
BRACELET_MIN_EDGE_PIXELS = 120
BRACELET_MIN_AXIS_CONFIDENCE = 1.8
BRACELET_ALREADY_VERTICAL_DEGREES = 12.0

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

def bracelet_edge_points (image: Image.Image): 
    array = np.array (image.convert ("RGB"))
    gray = cv2.cvtColor(array, cv2.COLOR_RGB2GRAY)
    blurred = cv2.GaussianBlur(gray, (5,5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    height, width = edges.shape
    center_width = int (width * BRACELET_CENTER_MASK_RATIO)
    center_height = int (height * BRACELET_CENTER_MASK_RATIO)
    x1 = max(0, (width - center_width) // 2)
    x2 = min(width, x1 + center_width)
    y1 = max(0, (height - center_height) // 2)
    y2 = min(height, y1 + center_height)

    mask = np.ones_like(edges, dtype = np.uint8)
    mask[y1:y2, x1:x2] = 0
    outer_edges = cv2.bitwise_and (edges, edges, mask = mask)

    ys, xs = np.where (outer_edges > 0)
    if len(xs) == 0:
        return np.empty ((0, 2), dtype = np.float32), outer_edges
    
    points = np.column_stack((xs, ys)).astype (np.float32)
    return points, outer_edges

def estimate_axis_from_points (points: np.ndarray):
    centered = points - points.mean (axis = 0)
    covariance = np.cov (centered, rowvar = False)
    eigenvalues, eigenvectors = np.linalg.eigh(covariance)
    order = np.argsort(eigenvalues)[::-1]
    eigenvalues = eigenvalues[order]
    eigenvectors = eigenvectors[:, order]

    primary = eigenvectors[:, 0]
    angle_radians = np.arctan2(primary[1], primary[0])
    angle_degrees = float (np.degrees(angle_radians))

    major = float (eigenvalues[0])
    minor = float (eigenvalues[1]) if len (eigenvalues) > 1 else 0.0
    confidence = major / minor if minor > 0 else float ("inf")

    return angle_degrees, confidence

def align_watch_crop(image: Image.Image):
    points, _ = bracelet_edge_points(image)
    bracelet_pixel_count = int(len(points))

    if bracelet_pixel_count < BRACELET_MIN_EDGE_PIXELS:
        return image, {
            "alignment_method": "opencv_bracelet_pca",
            "alignment_applied": False,
            "rotation_degrees": 0,
            "reason": "not_enough_bracelet_edges",
            "bracelet_pixel_count": bracelet_pixel_count,
        }

    axis_angle_degrees, axis_confidence = estimate_axis_from_points(points)

    # PCA angle is measured from the horizontal x-axis. A vertical bracelet has
    # an angle near +/-90 degrees, so rotate by the difference from vertical.
    if axis_angle_degrees >= 0:
        rotation_degrees = -90.0 - axis_angle_degrees
    else:
        rotation_degrees = 90.0 - axis_angle_degrees

    if axis_confidence < BRACELET_MIN_AXIS_CONFIDENCE:
        return image, {
            "alignment_method": "opencv_bracelet_pca",
            "alignment_applied": False,
            "rotation_degrees": 0,
            "reason": "bracelet_axis_not_confident",
            "bracelet_pixel_count": bracelet_pixel_count,
            "bracelet_axis_angle_degrees": axis_angle_degrees,
            "bracelet_axis_confidence": axis_confidence,
        }

    if abs(rotation_degrees) <= BRACELET_ALREADY_VERTICAL_DEGREES:
        return image, {
            "alignment_method": "opencv_bracelet_pca",
            "alignment_applied": False,
            "rotation_degrees": 0,
            "reason": "already_vertical",
            "bracelet_pixel_count": bracelet_pixel_count,
            "bracelet_axis_angle_degrees": axis_angle_degrees,
            "bracelet_axis_confidence": axis_confidence,
        }

    aligned = image.rotate(rotation_degrees, expand=True)
    return aligned, {
        "alignment_method": "opencv_bracelet_pca",
        "alignment_applied": True,
        "rotation_degrees": rotation_degrees,
        "reason": "bracelet_axis_rotated",
        "bracelet_pixel_count": bracelet_pixel_count,
        "bracelet_axis_angle_degrees": axis_angle_degrees,
        "bracelet_axis_confidence": axis_confidence,
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
    cropped_image, crop_info = crop_from_box (
        image, 
        box = boxes[best_index].tolist(),
        score = float (scores[best_index].item()),
        label = str(labels[best_index]),
    )

    if not crop_info.get ("crop_used"):
        return cropped_image, crop_info
    
    aligned_image, alignment_info = align_watch_crop(cropped_image)
    crop_info["alignment"] = alignment_info

    return aligned_image, crop_info,
