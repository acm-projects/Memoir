# from curses import raw
import numpy as np
import openai

# THE MONKEY PATCH: This intercepts the NumPy crash
# It forces NumPy to allow the "inhomogeneous" data the OCR library is sending.
original_array = np.array
def patched_array(*args, **kwargs):
    try:
        return original_array(*args, **kwargs)
    except ValueError:
        kwargs['dtype'] = object
        return original_array(*args, **kwargs)

np.array = patched_array

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
load_dotenv()
from pillow_heif import register_heif_opener
import requests
from openai import OpenAI
import json

from ocr import process_ocr, get_card_images, update_card_ocr
from tagging import generate_tags, save_tags_to_supabase
from embedding import get_card_text, generate_embedding, save_embedding

register_heif_opener()

app = Flask(__name__)
CORS(app)

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
                    if isinstance(ocr_result, tuple):
                        text, confidence = ocr_result
                    else:
                        text = ocr_result
                    all_ocr_text.append(text)
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
            'caption': card_caption,
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

        card_images = get_card_images(card_id)

        if not card_images:
            return jsonify({
                'success': False,
                'error': 'No images found for this card'
            }), 404

        all_ocr_text = []
        for image in card_images:
            image_url = image['image_url']
            ocr_result = process_ocr(image_url)
            print(f"OCR result for image {image_url}: {ocr_result}")
            all_ocr_text.append(ocr_result)

        combined_ocr_text = "\n".join(all_ocr_text)
        print(f"Combined OCR text: {combined_ocr_text}")

        update_card_ocr(card_id, str(combined_ocr_text))
        print(f"OCR text saved to card: {card_id}")

        return jsonify({
            'success': True,
            'card_id': card_id,
            'ocr_text': combined_ocr_text,
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
        use_mock = data.get('use_mock', True)

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

        tags = generate_tags(ocr_text, caption, title, use_mock)
        print(f"Tags generated: {tags}")

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

        combined_text, card = get_card_text(card_id)

        if not combined_text:
            return jsonify({
                'success': False,
                'error': 'Card not found'
            }), 404

        print(f"Embedding text: {combined_text}")

        embedding = generate_embedding(combined_text)
        print(f"Embedding generated: {len(embedding)} dimensions")

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
# PERSONA ENDPOINT (for testing LLM responses)
# ================================================================
@app.route("/persona", methods=["POST"])
def persona():
    prompt = request.json["prompt"]
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=150,
    )

    raw = res.choices[0].message.content

    return jsonify({"raw": raw})


# ================================================================
# SEARCH ENDPOINT
# ================================================================
@app.route('/search', methods=['POST'])
def search_cards():
    try:
        data = request.json
        query = data['query']
        user_id = data['user_id']
        match_count = data.get('match_count', 5)
        match_threshold = data.get('match_threshold', 0.3)

        query_embedding = generate_embedding(query)
        print(f"Query embedding generated for: {query}")

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
# SEED TEMPLATE EMBEDDINGS (temporary - remove after testing)
# ================================================================
@app.route('/seed-template-embeddings', methods=['POST'])
def seed_template_embeddings():
    try:
        templates = requests.get(
            f"{SUPABASE_URL}/rest/v1/templates2?embedding=is.null&select=id,name,tags,style_description",
            headers=HEADERS
        ).json()

        if not templates:
            return jsonify({'message': 'No templates need embedding'}), 200

        updated = []
        for template in templates:
            combined_text = " ".join(filter(None, [
                template.get('name', ''),
                template.get('tags', ''),
                template.get('style_description', '')
            ]))
            if combined_text:
                embedding = generate_embedding(combined_text)
                requests.patch(
                    f"{SUPABASE_URL}/rest/v1/templates2?id=eq.{template['id']}",
                    json={'embedding': embedding},
                    headers=HEADERS
                )
                updated.append(template['id'])

        return jsonify({
            'success': True,
            'templates_embedded': len(updated)
        }), 200

    except Exception as e:
        print(f"Seed error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=8000)