#!/usr/bin/env python
# coding: utf-8
# In[1]:
# Install Hugging Face transformers library.
# In[2]:
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
from craft_text_detector import Craft
from pillow_heif import register_heif_opener
register_heif_opener()

if torch.backends.mps.is_available():
    device = torch.device("mps")  # Apple Silicon GPU
elif torch.cuda.is_available():
    device = torch.device("cuda")  # NVIDIA GPU
else:
    device = torch.device("cpu")  # fallback

printed_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-printed')
printed_model = VisionEncoderDecoderModel.from_pretrained(
    'microsoft/trocr-base-printed'
).to(device)

hand_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
hand_model = VisionEncoderDecoderModel.from_pretrained(
    'microsoft/trocr-base-handwritten'
).to(device)
# In[3]:
import craft_text_detector.predict as predict
print(predict.__file__) #testing
# The `read_image()` function will take an image path as input, read the image, visualize it, and return the image.
def read_image(image_path):
    """
    :param image_path: String, path to the input image.

    Returns:
        image: PIL Image.
    """
    if isinstance(image_path, Image.Image):
        return image_path.convert('RGB')
    return Image.open(image_path).convert('RGB')
# In[8]:
# instantiate CRAFT once
craft = Craft(output_dir=None, crop_type="box", cuda=False)
# In[9]:
def sort_boxes(boxes, line_threshold=20):
    # sort by y first
    boxes = sorted(boxes, key=lambda box: box[0][1])
    lines = []
    current_line = [boxes[0]]
    for box in boxes[1:]:
        # if y is close to current line, it's on the same line
        if abs(box[0][1] - current_line[0][0][1]) < line_threshold:
            current_line.append(box)
        else:
            # sort current line left to right, start new line
            lines.append(sorted(current_line, key=lambda box: box[0][0]))
            current_line = [box]
    lines.append(sorted(current_line, key=lambda box: box[0][0]))
    # flatten back to list of boxes
    return [box for line in lines for box in line]

# In[10]:
# The following `ocr()` functions performs Optical Character Recognition on a cropped image of text.
# It takes the image in PIL format, passes it through the OCR processor and model and returns the generated text in String format.
def ocr(image_path):
    image = read_image(image_path)  # PIL handles all formats including HEIC
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    ##-OCR--##
    image_np = np.array(image)
    result = craft.detect_text(image_np)
    boxes = result["boxes"]
    texts = []
     # sort boxes top-to-bottom, then left-to-right
    boxes = sort_boxes(boxes)
    crop = [image.crop([box[0][0], box[0][1], box[2][0], box[2][1]]) for box in boxes]
    pixel_values = hand_processor(crop, return_tensors="pt", padding=True).pixel_values
    with torch.no_grad():
        generated_ids = hand_model.generate(pixel_values)
        texts = hand_processor.batch_decode(generated_ids, max_new_tokens=20)
    # fine tune 
    response = client.chat.completions.create(
            model="gpt-4o-mini",  # fix: valid model name
            messages=[
                {"role": "system", "content": "You are correcting OCR output from handwritten greeting cards. Only fix clear OCR errors like misread letters (e.g. 'rn' vs 'm', 'cl' vs 'd'). Do not rephrase, rewrite, or change the tone or wording. Preserve the original message as closely as possible. Only correct what is clearly wrong. Please fix grammar and punctuation from the ocr text and fill in any missing gaps in the text. If the text is perfect, return it as is without any changes."},
                {"role": "user", "content": ' '.join(texts)}
            ]
        )
    return response.choices[0].message.content
