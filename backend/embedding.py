import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

def get_card_text(card_id):
    card_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/cards?id=eq.{card_id}&select=title,caption,ocr_text",
        headers=HEADERS
    ).json()

    if not card_response:
        return None, None

    card = card_response[0]

    tags_response = requests.get(
        f"{SUPABASE_URL}/rest/v1/card_tags?card_id=eq.{card_id}&select=tag_id",
        headers=HEADERS
    ).json()

    tag_ids = [t['tag_id'] for t in tags_response]
    tag_names = []

    for tag_id in tag_ids:
        tag = requests.get(
            f"{SUPABASE_URL}/rest/v1/tags?id=eq.{tag_id}&select=name",
            headers=HEADERS
        ).json()
        if tag:
            tag_names.append(tag[0]['name'])

    combined_text = " ".join(filter(None, [
        card.get('title', ''),
        card.get('caption', ''),
        card.get('ocr_text', ''),
        " ".join(tag_names)
    ]))

    return combined_text, card

def generate_embedding(text):
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def save_embedding(card_id, embedding):
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/cards?id=eq.{card_id}",
        json={'embedding': embedding},
        headers=HEADERS
    )