import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part

# ✅ Use full path
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\varsh\OneDrive\Desktop\vertexai-crowd-summarizer\keys\vertexai-gemini-demo-1d71a77df95c.json"



vertexai.init(project="vertexai-gemini-demo", location="us-central1")

model = GenerativeModel("gemini-2.5-flash")

video_file = Part.from_uri(
    "gs://vertexai-video-bucket/sample.mp4", mime_type="video/mp4"
)

prompt = """
Analyze this video and return JSON with these fields:
{
  "density": "low/medium/high",
  "activities": "what people are doing",
  "safety_risk": "low/medium/high",
  "summary": "detailed description"
}
"""

response = model.generate_content([prompt, video_file])
print("\n📌 SUMMARY:\n", response.text)
