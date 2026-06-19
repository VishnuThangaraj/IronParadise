import httpx
import logging
from src.ai.providers.base_provider import BaseProvider

logger = logging.getLogger(__name__)

class OllamaProvider(BaseProvider):
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "qwen2.5:3b"):
        self.base_url = base_url
        self.model = model

    async def generate_plan(self, prompt: str, system_prompt: str) -> str:
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "format": "json",
            "stream": False,
            "think": False,  # Disable thinking mode for faster responses (API root level)
            "options": {
                "num_predict": 1500,  # Limit output tokens to prevent timeout
                "temperature": 0.3,   # Lower temp for structured JSON output
                "think": False,       # Disable thinking mode for faster responses (options level)
            }
        }
        
        logger.info(f"Sending request to Ollama provider at {url} using model {self.model}")
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                logger.error(f"Ollama request failed with status code {response.status_code}: {response.text}")
                raise RuntimeError(f"Ollama request failed: {response.text}")
            
            data = response.json()
            content = data.get("message", {}).get("content", "")
            return content
