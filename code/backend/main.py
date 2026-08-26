import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI

app = FastAPI(title="Ellenika API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

MODEL = os.getenv("OPENAI_MODEL", "gpt-5-mini")


class SynonymGroup(BaseModel):
    word: str
    items: List[str] = Field(default_factory=list)


class Suggestion(BaseModel):
    original: str
    suggestion: str
    type: str
    level: str
    reason: str


class Rewrite(BaseModel):
    level: str
    text: str
    reason: str


class WritingEnhancement(BaseModel):
    suggestions: List[Suggestion] = Field(default_factory=list)
    synonyms: List[SynonymGroup] = Field(default_factory=list)
    rewrites: List[Rewrite] = Field(default_factory=list)
    estimated_level: str = "B1"


class WritingRequest(BaseModel):
    text: str = Field(min_length=1, max_length=12000)
    level: Optional[str] = "B1"


@app.get("/api/health")
def health():
    return {"ok": True, "service": "ellenika-api"}


@app.post("/api/writing/enhance", response_model=WritingEnhancement)
def enhance_writing(request: WritingRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured on the server")

    client = OpenAI(api_key=api_key)

    instructions = """You are Ellenika's English writing coach.
Analyze the user's English text in context. Do not invent errors. Keep the user's meaning.
Return useful, concise suggestions for natural phrasing, vocabulary and synonyms.
For rewrites, preserve meaning and produce realistic CEFR-level alternatives.
Only suggest a replacement when it is genuinely better or more appropriate.
Do not make every sentence sound overly formal. Avoid changing correct simple English just to make it complicated.
"""

    prompt = f"Target learner level: {request.level or 'B1'}\n\nText:\n{request.text}"

    try:
        response = client.responses.parse(
            model=MODEL,
            instructions=instructions,
            input=prompt,
            text_format=WritingEnhancement,
        )
        result = response.output_parsed
        if not result:
            raise HTTPException(status_code=502, detail="AI returned no structured result")
        return result
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Writing analysis failed: {exc}")
