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
    from pillow_heif import register_heif_opener
    register_heif_opener()

    image_response = requests.get(image_url)
    print(f"Image fetch status: {image_response.status_code} for {image_url}", flush=True)
    print(f"Content length: {len(image_response.content)} bytes", flush=True)
    print(f"Response headers: {dict(image_response.headers)}", flush=True)

    if image_response.status_code != 200:
        raise Exception(f"Failed to download image: {image_response.status_code} — {image_url}")

    if len(image_response.content) == 0:
        raise Exception(f"Image downloaded but empty: {image_url}")

    image_bytes = io.BytesIO(image_response.content)
    image = Image.open(image_bytes).convert('RGB')
    print(f"Image opened successfully, size: {image.size}", flush=True)

    import TrOCR_Inference as trocr
    result = trocr.ocr(image)

    if isinstance(result, tuple):
        text, confidence = result
    else:
        text = result

    return text