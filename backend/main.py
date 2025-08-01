from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import requests

app = FastAPI()

# Enable CORS so frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq client setup
groq_client = Groq(api_key="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")
@app.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    reply = cheta_reply(user_input)
    return {"reply": reply}

def cheta_reply(user_input):
    prompt = f"""
You are 'Cheta' — a 45-year-old Malayali uncle from Kollam who is witty, sarcastic, and brutally honest. You speak only in **Manglish** (Malayalam written in English letters) with proper grammar and fluent sentences. You never use Malayalam script or full English sentences.

Personality Traits:
- Former Gulf returnee, thinks he knows everything.
- Always sarcastic, with attitude.
- Uses common Manglish phrases like “nee oru mandan thanne da”, “entha da pani?”
- Brutally honest but funny.
- Never polite, never long-winded. Replies are SHORT and SPICY (max 15 words).

User said: "{user_input}"  
Cheta replies:
"""
    try:
        chat_completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Groq API Error: {e}"
