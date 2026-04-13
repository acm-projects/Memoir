#!/usr/bin/env python
# coding: utf-8

from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
from tqdm.auto import tqdm
import cv2
from urllib.request import urlretrieve
from zipfile import ZipFile
from craft_text_detector import Craft
from openai import OpenAI
import numpy as np
import matplotlib.pyplot as plt
import torch
import os
import glob
import io
import requests
import base64
from dotenv import load_dotenv
from pillow_heif import register_heif_opener

load_dotenv()
register_heif_opener()

if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

hand_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
hand_model = VisionEncoderDecoderModel.from_pretrained(
    'microsoft/trocr-base-handwritten'
).to(device)

import craft_text_detector.predict as predict
print(predict.__file__)

# instantiate CRAFT once
craft = Craft(output_dir=None, crop_type="box", cuda=False)

def read_image(image_path): # reads the image and converts it to grayscale to its easer to detect text
    if isinstance(image_path, Image.Image):
        return image_path.convert('RGB')
    return Image.open(image_path).convert('RGB')


def sort_boxes(boxes, line_threshold=20): # sort the boxes so it reads legibly 
    boxes = sorted(boxes, key=lambda box: box[0][1])
    lines = []
    current_line = [boxes[0]]
    for box in boxes[1:]:
        if abs(box[0][1] - current_line[0][0][1]) < line_threshold:
            current_line.append(box)
        else:
            lines.append(sorted(current_line, key=lambda box: box[0][0]))
            current_line = [box]
    lines.append(sorted(current_line, key=lambda box: box[0][0]))
    return [box for line in lines for box in line]

#--safe crop function, so ocr still works, no coordinate errors --
def safe_crop(image, box, padding=4):
    x1 = int(box[0][0])
    y1 = int(box[0][1])
    x2 = int(box[2][0])
    y2 = int(box[2][1])

    # Swap if inverted
    if x1 > x2:
        x1, x2 = x2, x1
    if y1 > y2:
        y1, y2 = y2, y1

    # Add padding
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(image.width, x2 + padding)
    y2 = min(image.height, y2 + padding)

    # Skip if too small
    if (x2 - x1) < 5 or (y2 - y1) < 5:
        return None

    return image.crop((x1, y1, x2, y2)).convert("RGB")

#--gets the confidence score, if it's really low can switch to other model--
def get_trocr_confidence(model, processor, crops, device):
    pixel_values = processor(
        crops, return_tensors="pt", padding=True
    ).pixel_values.float().to(device)

    with torch.no_grad():
        outputs = model.generate(
            pixel_values,
            output_scores=True,
            return_dict_in_generate=True
        )

    sequences = outputs.sequences
    scores = outputs.scores  # tuple of (num_crops, vocab_size) per step

    texts = processor.batch_decode(sequences, skip_special_tokens=True)

    # average token probability per crop as confidence
    stacked = torch.stack(scores, dim=1)  # (num_crops, seq_len, vocab_size)
    probs = torch.softmax(stacked, dim=-1)
    top_probs = probs.max(dim=-1).values  # (num_crops, seq_len)
    confidence = top_probs.mean(dim=-1).tolist()  # one score per crop

    return texts, confidence

def google_cloud_vision_ocr(image_path): # calls google cloud vision api in hard or complex cards 
    api_key = os.getenv("GOOGLE_CLOUD_VISION_API_KEY") # performs ocr 

    if isinstance(image_path, Image.Image):
        buffer = io.BytesIO()
        image_path.save(buffer, format="PNG")
        content = base64.b64encode(buffer.getvalue()).decode("utf-8")
    else:
        with open(image_path, "rb") as f:
            content = base64.b64encode(f.read()).decode("utf-8")

    payload = {
        "requests": [
            {
                "image": {"content": content},
                "features": [{"type": "DOCUMENT_TEXT_DETECTION"}]
            }
        ]
    }
    response = requests.post(
        f"https://vision.googleapis.com/v1/images:annotate?key={api_key}",
        json=payload
    )
    result = response.json()
    return result["responses"][0]["fullTextAnnotation"]["text"]

def ocr(image_path, confidence_threshold=0.75):
    image = read_image(image_path)

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    image_np = np.array(image)
    result = craft.detect_text(image_np)
    boxes = result["boxes"]

    if boxes is None or len(boxes) == 0:
        return ""

    boxes = sort_boxes(boxes)
    crops = []
    for box in boxes:
        crop = safe_crop(image, box) # safe crop if coordinates look weird
        if crop is None:
            continue
        crops.append(crop)

    if len(crops) == 0:
        return ""
    texts, confidences = get_trocr_confidence(hand_model, hand_processor, crops, device)
    avg_confidence = sum(confidences) / len(confidences) # confidence level 
    print(f"Confidence: {avg_confidence:.2f}, using {'Cloud Vision' if avg_confidence < confidence_threshold else 'TrOCR'}") 

    if avg_confidence < confidence_threshold:
        raw_text = google_cloud_vision_ocr(image_path) # below threshold, switch to google cloud vision
    else:
        raw_text = ' '.join(texts)
    response = client.chat.completions.create( # open api to correct trocr or cloud vision output, just corrects small misspellings
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are correcting OCR output from handwritten greeting cards. Only fix clear OCR errors like misread letters (e.g. 'rn' vs 'm', 'cl' vs 'd'). Do not rephrase, rewrite, or change the tone or wording. Preserve the original message as closely as possible. Only correct what is clearly wrong. Please fix grammar and punctuation from the ocr text and fill in any missing gaps in the text. If the text is perfect, return it as is without any changes."
            },
            {
                "role": "user",
                "content": raw_text
            }
        ]
    )
    return response.choices[0].message.content, avg_confidence