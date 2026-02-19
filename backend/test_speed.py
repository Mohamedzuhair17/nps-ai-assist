import requests
import time

url = "http://localhost:8000/chat"
payload = {
    "query": "என்பிஎஸ் என்றால் என்ன?",
    "top_k": 3
}

print(f"Sending request to {url}...")
start = time.time()
try:
    response = requests.post(url, json=payload, timeout=60)
    end = time.time()
    if response.status_code == 200:
        print(f"Success! Total request time: {end - start:.2f}s")
        print("Response segment:", response.json().get("response", "")[:200] + "...")
        print("Timing info:", response.json().get("timing", {}))
    else:
        print(f"Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
