import os
from google.cloud import storage

# 🔑 Set credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"keys/vertexai-gemini-demo-f40cbeadb017.json"

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_name)
    print(f"✅ Uploaded {source_file_name} to gs://{bucket_name}/{destination_blob_name}")

bucket_name = "vertexai-video-bucket"   # Your bucket name
source_file_name = r"videos/sample.mp4" # Local file path
destination_blob_name = "sample.mp4"    # File name in bucket

upload_blob(bucket_name, source_file_name, destination_blob_name)
