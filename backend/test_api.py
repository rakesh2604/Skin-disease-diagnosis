import requests

# Test the enhanced /predict endpoint with patient metadata
url = "http://localhost:8000/predict"
image_path = r"C:\Users\RAKESH\.gemini\antigravity\brain\23d86168-7eff-4085-b445-115a893f9665\test_skin_sample_1768657567010.png"

# Prepare form data with patient metadata
with open(image_path, "rb") as f:
    files = {"file": ("test_image.png", f, "image/png")}
    data = {
        "age": 45,
        "lesion_location": "Face"
    }
    response = requests.post(url, files=files, data=data)

print("Status Code:", response.status_code)
print("\nResponse JSON:")
import json
print(json.dumps(response.json(), indent=2))
