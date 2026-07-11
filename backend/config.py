import os
from dotenv import load_dotenv

load_dotenv()

# Fireworks AI Configuration
# The user specified the key in the prompt
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY", "")
FIREWORKS_MODEL = "accounts/fireworks/models/llama-v3p3-70b-instruct"

# LLM Parameters
LLM_TEMPERATURE = 0.3
LLM_MAX_TOKENS = 1024
MAX_AGENT_ITERATIONS = 3

# AMD Developer Cloud Config (placeholder)
AMD_CLOUD_ENDPOINT = os.getenv("AMD_CLOUD_ENDPOINT", "https://amd-developer-cloud.example.com")
AMD_ROCM_VERSION = "6.0"

# Service URLs
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8001/sse")
