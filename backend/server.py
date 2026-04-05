import numpy as np

# THE MONKEY PATCH: This intercepts the NumPy crash
# It forces NumPy to allow the "inhomogeneous" data the OCR library is sending.
original_array = np.array
def patched_array(*args, **kwargs):
    try:
        return original_array(*args, **kwargs)
    except ValueError:
        # If it fails, we force it to be an 'object' array
        kwargs['dtype'] = object
        return original_array(*args, **kwargs)

np.array = patched_array

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pillow_heif import register_heif_opener
import requests
from openai import OpenAI
import os
import json

from ocr import process_ocr, get_card_images, update_card_ocr  # Import the OCR function from ocr.py
from tagging import generate_tags, save_tags_to_supabase # Import tagging functions from tagging.py
from embedding import get_card_text, generate_embedding, save_embedding # Import embedding functions from embedding.py

register_heif_opener()  # enables HEIC/HEIF support
load_dotenv()

app = Flask(__name__)
CORS(app)

# Supabase connection details
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# ================================================================
# HEALTH CHECK
# ================================================================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'running'}), 200

# ================================================================
# PROCESS CARD ENDPOINT (chains OCR → tag → embed)
# ================================================================
@app.route('/process-card', methods=['POST'])
def process_card():
    try:
        data = request.json
        card_id = data['card_id']
        user_id = data['user_id']
        use_mock = data.get('use_mock', True)

        # Initialize placeholders for the response
        card_title = "Unknown"
        card_caption = ""

        results = {
            'card_id': card_id,
            'ocr': None,
            'tagging': None,
            'embedding': None,
            'errors': []
        }

        # ── Step 1: OCR ──────────────────────────────────────────
        try:
            card_images = get_card_images(card_id)
            if not card_images:
                results['errors'].append('OCR: No images found')
            else:
                all_ocr_text = []
                for image in card_images:
                    ocr_result = process_ocr(image['image_url'])
                    all_ocr_text.append(ocr_result)
                combined_ocr_text = "\n".join(all_ocr_text)
                update_card_ocr(card_id, combined_ocr_text)
                results['ocr'] = {'success': True, 'images_processed': len(card_images), 'ocr_text': combined_ocr_text}
        except Exception as e:
            results['errors'].append(f'OCR failed: {str(e)}')

        # ── Step 2: Tagging ──────────────────────────────────────
        try:
            card_response = requests.get(
                f"{SUPABASE_URL}/rest/v1/cards?id=eq.{card_id}&select=ocr_text,caption,title",
                headers=HEADERS
            ).json()
            if card_response:
                card = card_response[0]

                # EXTRACT TITLE AND CAPTION HERE
                card_title = card.get('title', 'Untitled Card')
                card_caption = card.get('caption', '')

                tags = generate_tags(card.get('ocr_text', ''), card_caption, card_title, use_mock)
                saved_tags = save_tags_to_supabase(card_id, user_id, tags)
                results['tagging'] = {'success': True, 'tags': [t['name'] for t in saved_tags]}
        except Exception as e:
            results['errors'].append(f'Tagging failed: {str(e)}')

        # ── Step 3: Embedding ────────────────────────────────────
        try:
            combined_text, card = get_card_text(card_id)
            if combined_text:
                embedding = generate_embedding(combined_text)
                save_embedding(card_id, embedding)
                results['embedding'] = {'success': True, 'dimensions': len(embedding)}
        except Exception as e:
            results['errors'].append(f'Embedding failed: {str(e)}')

        return jsonify({
            'success': len(results['errors']) == 0,
            'card_id': card_id,
            'card_name': card_title,
            'caption' : card_caption,
            'results': results
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ================================================================
# OCR ENDPOINT
# ================================================================
@app.route('/ocr', methods=['POST'])
def run_ocr():
    try:
        data = request.json
        card_id = data['card_id']

        # Fetch all images for this card from Supabase ordered by order_index
        card_images = get_card_images(card_id)

        if not card_images:
            return jsonify({
                'success': False,
                'error': 'No images found for this card'
            }), 404
        
        # Run OCR on each image and concatente results
        all_ocr_text = []
        for image in card_images:
            image_url = image['image_url']
            ocr_result = process_ocr(image_url)
            print(f"OCR result for image {image_url}: {ocr_result}") #TESTING
            all_ocr_text.append(ocr_result)

        # Join all image OC results into one string
        combined_ocr_text = "\n".join(all_ocr_text)
        print(f"Combined OCR text: {combined_ocr_text}")

        # Save combined OCR text to Supabase cards table
        update_card_ocr(card_id, str(combined_ocr_text))
        print(f"OCR text saved to card: {card_id}") #TESTING

        return jsonify({
            'success': True,
            'card_id': card_id,
            'ocr_text': combined_ocr_text,  # the full concatenated text
            'images_processed': len(card_images)
        }), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ================================================================
# AUTO TAGGING ENDPOINT
# ================================================================
@app.route('/tag', methods=['POST'])
def auto_tag():
    try:
        data = request.json
        card_id = data['card_id']
        user_id = data['user_id']
        use_mock = data.get('use_mock', True)  # defaults to mock to save API credits

        # Fetch ocr_text and caption from Supabase for this card
        card_response = requests.get(
            f"{SUPABASE_URL}/rest/v1/cards?id=eq.{card_id}&select=ocr_text,caption,title",
            headers=HEADERS
        )

        card = card_response.json()

        if not card:
            return jsonify({
                'success': False,
                'error': 'Card not found'
            }), 404
        
        ocr_text = card[0].get('ocr_text', '')
        caption = card[0].get('caption', '')
        title = card[0].get('title', '')

        # Generate tags from tagging.py
        tags = generate_tags(ocr_text, caption, title, use_mock)
        print(f"Tags generated: {tags}")

        # Save to Supabase from tagging.py
        saved_tags = save_tags_to_supabase(card_id, user_id, tags)

        return jsonify({
            'success': True,
            'card_id': card_id,
            'tags': [t['name'] for t in saved_tags]
        }), 200

    except Exception as e:
        print(f"Tagging error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ================================================================
# EMBED ENDPOINT
# ================================================================
@app.route('/embed', methods=['POST'])
def embed_card():
    try:
        data = request.json
        card_id = data['card_id']

        # Fetch card text and tags
        combined_text, card = get_card_text(card_id)

        if not combined_text:
            return jsonify({
                'success': False,
                'error': 'Card not found'
            }), 404

        print(f"Embedding text: {combined_text}")

        # Generate embedding via OpenAI
        embedding = generate_embedding(combined_text)
        print(f"Embedding generated: {len(embedding)} dimensions")

        # Save embedding to Supabase
        save_embedding(card_id, embedding)
        print(f"Embedding saved to card: {card_id}")

        return jsonify({
            'success': True,
            'card_id': card_id,
            'text_embedded': combined_text,
            'dimensions': len(embedding)
        }), 200

    except Exception as e:
        print(f"Embed error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ================================================================
# SEARCH ENDPOINT
# ================================================================
@app.route('/search', methods=['POST'])
def search_cards():
    try:
        data = request.json
        query = data['query']
        user_id = data['user_id']
        match_count = data.get('match_count', 5)      # how many results to return
        match_threshold = data.get('match_threshold', 0.3)  # similarity threshold 0-1

        # Generate embedding for the search query
        query_embedding = generate_embedding(query)
        print(f"Query embedding generated for: {query}")

        # Search Supabase using match_cards function
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/match_cards",
            json={
                'query_embedding': query_embedding,
                'match_threshold': match_threshold,
                'match_count': match_count,
                'p_user_id': user_id
            },
            headers=HEADERS
        )

        matches = response.json()
        print(f"Found {len(matches)} matches")

        if not matches:
            return jsonify({
                'success': True,
                'query': query,
                'results': [],
                'message': 'No matches found'
            }), 200

        # Fetch folder name for each matched card
        results = []
        for match in matches:
            folder_response = requests.get(
                f"{SUPABASE_URL}/rest/v1/folders?id=eq.{match['folder_id']}&select=name",
                headers=HEADERS
            ).json()

            folder_name = folder_response[0]['name'] if folder_response else 'Unknown'

            results.append({
                'card_id': match['id'],
                'title': match['title'],
                'caption': match['caption'],
                'ocr_text': match['ocr_text'],
                'folder_name': folder_name,
                'similarity': round(match['similarity'], 4)
            })

        return jsonify({
            'success': True,
            'query': query,
            'results': results
        }), 200

    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
# ================================================================
# TEMPLATE RECOMMENDATION ENDPOINT
# ================================================================
# ================================================================
# TEMPLATE RECOMMENDATION ENDPOINT
# ================================================================
def get_user_headers(token):
    return {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

@app.route('/recommend-template', methods=['POST'])
def recommend_template():
    try:
        data = request.json
        user_prompt = data['prompt']
        user_id = data.get('user_id')
        match_count = data.get('match_count', 5)

        # grab the user's token from the request header
        auth_header = request.headers.get('Authorization', '')
        user_token = auth_header.replace('Bearer ', '') if auth_header else SUPABASE_KEY
        user_headers = get_user_headers(user_token)

        # ── Step 1: Ask OpenAI to structure the prompt into JSON ──
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are a card design assistant. Convert the user's request into structured JSON.
                    Return ONLY valid JSON, no extra text, in this exact format:
                    {
                        "occasion": "",
                        "recipient": "",
                        "age": null,
                        "vibe": [],
                        "color_preference": null,
                        "avoid_colors": [],
                        "sticker_preferences": [],
                        "music_mood": "",
                        "embedding_text": "one sentence summarizing the card vibe and purpose"
                    }"""
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        )

        raw = completion.choices[0].message.content
        card_json = json.loads(raw)

        # ── Step 2: Store card request in Supabase ────────────────
        insert_response = requests.post(
            f"{SUPABASE_URL}/rest/v1/card_requests",
            json={
                "user_id": user_id,
                "occasion": card_json.get("occasion"),
                "recipient": card_json.get("recipient"),
                "age": card_json.get("age"),
                "vibe": card_json.get("vibe"),
                "color_preference": card_json.get("color_preference"),
                "avoid_colors": card_json.get("avoid_colors"),
                "sticker_preferences": card_json.get("sticker_preferences"),
                "music_mood": card_json.get("music_mood"),
                "embedding_text": card_json.get("embedding_text")
            },
            headers={**user_headers, "Prefer": "return=representation"}
        ).json()

        card_request_id = insert_response[0]['id']

        # ── Step 3: Generate embedding from embedding_text ────────
        embedding = generate_embedding(card_json.get("embedding_text"))

        # ── Step 4: Save embedding back to that row ───────────────
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/card_requests?id=eq.{card_request_id}",
            json={"embedding": embedding},
            headers=user_headers
        )

        # ── Step 5: Run similarity search against templates ───────
        matches = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/match_templates",
            json={
                "query_embedding": embedding,
                "match_count": match_count
            },
            headers=user_headers
        ).json()

        return jsonify({
            "success": True,
            "card_request_id": card_request_id,
            "design_intent": card_json,
            "suggested_templates": matches
        }), 200

    except Exception as e:
        print(f"Recommend template error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# for the endpoint
if __name__ == '__main__':
    app.run(debug=True, port=5000)