from abc import ABC, abstractmethod

class BaseProvider(ABC):
    @abstractmethod
    async def generate_plan(self, prompt: str, system_prompt: str) -> str:
        """
        Generate text response from the provider given a user prompt and system prompt.
        """
        pass
