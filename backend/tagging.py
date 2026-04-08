import json
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

# def generate_tags(ocr_text, caption, use_mock=True):
#     if use_mock:
#         return ['birthday', 'family', 'celebration']

#     import google.generativeai as genai
#     genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
#     model = genai.GenerativeModel("gemini-2.0-flash")

#     prompt = f"""
#     You are a tagging assistant for a greeting card database.
#     Task:
#     Generate 3–5 short, relevant tags that describe the theme, occasion, or emotion of the greeting card.
#     Rules:
#     - Tags must be lowercase
#     - Use single words or short phrases (max 2 words)
#     - Do not repeat tags
#     - Do not include punctuation
#     - Focus on occasions, emotions, relationships, or themes
#     - If no text is provided, generate general greeting card tags
#     - Return ONLY a JSON array
#     - Do NOT include explanations, text, or formatting outside the array
#     Example output:
#     ["birthday", "family", "celebration"]
#     Input:
#     Card OCR text: {ocr_text if ocr_text else "No text available"}
#     Card caption: {caption if caption else "No caption available"}
#     Output:
#     """

#     response = model.generate_content(prompt)
#     raw = response.text.strip()
#     raw = raw.replace("```json", "").replace("```", "").strip()
#     return json.loads(raw)

def generate_tags(ocr_text, caption, title, use_mock=True):
    # ============================================================
    # MOCK TAGS - no API credits used
    # Send { "use_mock": true } in Postman body to use this
    # ============================================================
    if use_mock:
        return ['birthday', 'family', 'celebration']
    
    # Real OpenAI tagging
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    prompt = f"""
    You are a tagging assistant for a greeting card database.
    Task:
    Generate 3–5 short, relevant tags that describe the theme, occasion, or emotion of the greeting card.
    Rules:
    - Tags must be lowercase
    - Use single words or short phrases (max 2 words)
    - Do not repeat tags
    - Do not include punctuation
    - Focus on occasions, emotions, relationships, or themes
    - If no text is provided, generate general greeting card tags
    - Return ONLY a JSON array
    - Do NOT include explanations, text, or formatting outside the array
    Example output:
    ["birthday", "family", "celebration"]
    Input:
    Card title: {title if title else "No title available"}
    Card OCR text: {ocr_text if ocr_text else "No text available"}
    Card caption: {caption if caption else "No caption available"}
    Output:
    """
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=50
    )
    
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)

def save_tags_to_supabase(card_id, user_id, tags):
    saved_tags = []
    for tag_name in tags:
        # Check if tag already exists for this user
        existing = requests.get(
            f"{SUPABASE_URL}/rest/v1/tags?name=eq.{tag_name}&user_id=eq.{user_id}",
            headers=HEADERS
        ).json()

        if existing:
            tag = existing[0] # Reuse existing tag
        else:
            # Create new tag
            tag_response = requests.post(
                f"{SUPABASE_URL}/rest/v1/tags",
                json={
                    'user_id': user_id,
                    'name': tag_name,
                    'is_auto_generated': True
                },
                headers={**HEADERS, 'Prefer': 'return=representation'}
            )
            tag = tag_response.json()[0]
        
        # Check if card_tag link already exists
        existing_link = requests.get(
            f"{SUPABASE_URL}/rest/v1/card_tags?card_id=eq.{card_id}&tag_id=eq.{tag['id']}",
            headers=HEADERS
        ).json()

        if not existing_link:
            # Link to card in card_tags table
            requests.post(
                f"{SUPABASE_URL}/rest/v1/card_tags",
                json={
                    'card_id': card_id,
                    'tag_id': tag['id']
                },
                headers=HEADERS
            )

        saved_tags.append(tag)
    return saved_tags