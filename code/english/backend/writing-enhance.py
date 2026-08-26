import json
import os
from http.server import BaseHTTPRequestHandler

from openai import OpenAI


WRITING_SCHEMA = {
    "type": "object",
    "properties": {
        "suggestions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "original": {"type": "string"},
                    "suggestion": {"type": "string"},
                    "type": {"type": "string", "enum": ["grammar", "vocabulary", "phrasing", "naturalness"]},
                    "level": {"type": "string", "enum": ["A1", "A2", "B1", "B2", "C1", "C2"]},
                    "reason": {"type": "string"}
                },
                "required": ["original", "suggestion", "type", "level", "reason"],
                "additionalProperties": False
            }
        },
        "synonyms": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "word": {"type": "string"},
                    "items": {"type": "array", "items": {"type": "string"}}
                },
                "required": ["word", "items"],
                "additionalProperties": False
            }
        },
        "rewrites": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "level": {"type": "string", "enum": ["A1", "A2", "B1", "B2", "C1", "C2"]},
                    "text": {"type": "string"},
                    "reason": {"type": "string"}
                },
                "required": ["level", "text", "reason"],
                "additionalProperties": False
            }
        },
        "estimated_level": {"type": "string", "enum": ["A1", "A2", "B1", "B2", "C1", "C2"]}
    },
    "required": ["suggestions", "synonyms", "rewrites", "estimated_level"],
    "additionalProperties": False
}

INSTRUCTIONS = """You are the English writing assistant for Ellenika, a language-learning application.
Analyze the user's English writing in context. Do not rewrite everything unnecessarily.
Find useful opportunities to improve grammar, vocabulary, phrasing and naturalness.
Suggest contextually appropriate synonyms, not dictionary dumps.
Provide rewrites at realistic CEFR levels. Preserve the user's meaning.
Do not invent errors. If the sentence is already natural, return an empty suggestion list for that aspect.
Keep explanations short and educational. Return only the requested structured data."""


def enhance_writing(text: str):
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    response = client.responses.create(
        model=os.getenv("OPENAI_WRITING_MODEL", "gpt-5"),
        instructions=INSTRUCTIONS,
        input=f"Analyze this English writing:\n\n{text}",
        text={
            "format": {
                "type": "json_schema",
                "name": "english_writing_feedback",
                "strict": True,
                "schema": WRITING_SCHEMA,
            }
        },
        store=False,
    )
    return json.loads(response.output_text)


# Vercel-compatible Python serverless function entry point.
def handler(request):
    try:
        body = request.get_json(silent=True) or {}
        text = str(body.get("text", "")).strip()
        if not text:
            return {"statusCode": 400, "body": json.dumps({"error": "text is required"})}
        if len(text) > 6000:
            return {"statusCode": 400, "body": json.dumps({"error": "text is too long"})}
        result = enhance_writing(text)
        return {"statusCode": 200, "body": json.dumps(result, ensure_ascii=False)}
    except Exception:
        return {"statusCode": 500, "body": json.dumps({"error": "Writing analysis failed"})}
