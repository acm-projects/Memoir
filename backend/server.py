import traceback

from PIL import Image
from pillow_heif import register_heif_opener
from flask import Flask, render_template, request, redirect, jsonify 
import requests
import io
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS # allows requests from any origin
import os 
from openai import OpenAI
import TrOCR_Inference as trocr

register_heif_opener()  # enables HEIC/HEIF support
load_dotenv()
app = Flask(__name__)
CORS(app)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(url, key)

@app.route('/ocr', methods=['POST'])
def run_ocr():
    try:
        data = request.get_json(force=True)
        image_url = data['image_url']
        card_id = data['card_id']
        image_response = requests.get(image_url)
        image_bytes = image_response.content
        print("Status:", image_response.status_code)
        print("Content-Type:", image_response.headers.get('Content-Type'))
        print("Bytes length:", len(image_response.content))

        image = Image.open(io.BytesIO(image_bytes))
        ocr_result = trocr.ocr(image)
        supabase.table('cards').update({ # updates the supabase table based on ocr result
            'ocr_text': ocr_result
    }).eq('id', card_id).execute()
        
        return jsonify({
        'success': True,
        'ocr_text': ocr_result
        }), 200
    except Exception as e:
        print("Full error:", traceback.format_exc())
        return jsonify({
    'success': False,
    'error': str(e)
    }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'running'}), 200
if __name__ == '__main__':
    app.run(debug=True, port=5000) # listening 
           