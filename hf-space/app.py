import os
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
MAX_TOKENS = int(os.environ.get("MAX_TOKENS", "50000"))
ALLOWED = [o.strip() for o in os.environ.get(
    "ALLOWED_ORIGINS",
    "https://tbenitz.github.io,http://localhost:8787,http://127.0.0.1:8787,*"
).split(",") if o.strip()]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health():
    return {"ok": True, "configured": bool(os.environ.get("DEEPSEEK_API_KEY"))}

@app.post("/api/chat")
async def chat(request: Request):
    key = os.environ.get("DEEPSEEK_API_KEY")
    visitor = (request.headers.get("authorization") or "").replace("Bearer", "").strip()
    token = visitor or key
    if not token:
        return Response(
            '{"error":"DEEPSEEK_API_KEY missing on the Space"}',
            status_code=500,
            media_type="application/json",
        )

    payload = await request.json()
    payload["stream"] = True
    if payload.get("max_tokens"):
        payload["max_tokens"] = min(int(payload["max_tokens"]), MAX_TOKENS)

    client = httpx.AsyncClient(timeout=None)
    upstream = await client.send(
        client.build_request(
            "POST",
            DEEPSEEK_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            json=payload,
        ),
        stream=True,
    )

    async def gen():
        try:
            async for chunk in upstream.aiter_bytes():
                yield chunk
        finally:
            await upstream.aclose()
            await client.aclose()

    return StreamingResponse(
        gen(),
        status_code=upstream.status_code,
        media_type=upstream.headers.get("content-type", "text/event-stream"),
    )
