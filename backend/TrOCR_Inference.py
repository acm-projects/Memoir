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
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

printed_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-printed')
printed_model = VisionEncoderDecoderModel.from_pretrained(
    'microsoft/trocr-large-printed'
).to(device)

hand_processor = TrOCRProcessor.from_pretrained('microsoft/trocr-large-handwritten')
hand_model = VisionEncoderDecoderModel.from_pretrained(
    'microsoft/trocr-large-handwritten'
).to(device)

# In[3]:

import craft_text_detector.predict as predict
print(predict.__file__) #testing

# In[4]:

# ## Download Data
#TESTING PURPOSES ONLY - DELETE LATER
# In[5]:
# def download_and_unzip(url, save_path):
   # print(f"Downloading and extracting assets....", end="")

    # Downloading zip file using urllib package.
   # urlretrieve(url, save_path)

    #try:
        # Extracting zip file using the zipfile package.
       # with ZipFile(save_path) as z:
            # Extract ZIP file contents in the same directory.
           # z.extractall(os.path.split(save_path)[0])

       # print("Done")

   # except Exception as e:
       # print("\nInvalid file.", e)
# In[6]:


# URL = r"https://www.dropbox.com/scl/fi/jz74me0vc118akmv5nuzy/images.zip?rlkey=54flzvhh9xxh45czb1c8n3fp3&dl=1"
# asset_zip_path = os.path.join(os.getcwd(), "images.zip")
# Download if assest ZIP does not exists.
# if not os.path.exists(asset_zip_path):
    # download_and_unzip(URL, asset_zip_path)

#END OF TESTING PURPOSES ONLY - DELETE LATER

# In[7]:

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
# 
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
                {"role": "system", "content": "Correct any grammatical errors and/or correct individual letters that could be similar and make sense in context. Adjust spacing as needed."},
                {"role": "user", "content": ' '.join(texts)}
            ]
        )
    return response.choices[0].message.content
# In[11]:

# def eval_new_data(data_path=None, num_samples=None, model=None):
    # image_paths = glob.glob(data_path)
   # for i, image_path in tqdm(enumerate(image_paths), total=len(image_paths)):
       # if i == num_samples:
       #     break
        #image = read_image(image_path)
       # text = ocr(image)
       # plt.figure(figsize=(7, 4))
        #plt.imshow(image)
       # plt.title(text)
       # plt.axis('off')
       # plt.show()


# ## Printed Text

# In[12]:


# In[13]:


# eval_new_data(
   # data_path=os.path.join('images', 'newspaper', '*'),
   # model=hand_model
#)


# ## Handwritten Text

# In[14]:

# In[15]:

# eval_new_data(
   # data_path=os.path.join('images', 'handwritten', '*'),
   #  model=hand_model
# )


