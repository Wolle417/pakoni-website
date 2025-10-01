import os
import json

image_folder = './images'
images = [f for f in os.listdir(image_folder) if f.endswith('.jpg')]

with open('images.json', 'w') as f:
    json.dump(images, f)

print(f"Found {len(images)} images")