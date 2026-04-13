from PIL import Image
import io
import requests
import os
from dotenv import load_dotenv

import torchvision.models.vgg as vgg

# This fixes the "cannot import name 'model_urls'" error
if not hasattr(vgg, 'model_urls'):
    vgg.model_urls = {
        'vgg16_bn': 'https://download.pytorch.org/models/vgg16_bn-6c64b313.pth'
    }

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

def get_card_images(card_id):
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/card_images?card_id=eq.{card_id}&select=image_url,order_index&order=order_index.asc",
        headers=HEADERS
    )
    return response.json()

def update_card_ocr(card_id, ocr_text):
    url = f"{SUPABASE_URL}/rest/v1/cards?id=eq.{card_id}"
    response = requests.patch(url, json={'ocr_text': ocr_text}, headers=HEADERS)
    return response

def process_ocr(image_url):
    # Download image
    image_response = requests.get(image_url)
    image = Image.open(io.BytesIO(image_response.content)).convert('RGB')
    print(f"Image downloaded successfully from: {image_url}")
    
    # ============================================================
    # MOCK OCR - **TEJU** REPLACE THIS WITH REAL MODEL
    import TrOCR_Inference as trocr
    text, confidence = trocr.ocr(image)
    return text
    # ============================================================
    # return "Mock OCR text - image downloaded successfully!"