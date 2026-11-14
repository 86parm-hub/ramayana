from PIL import Image
import numpy as np

orig_path = r'C:/Users/HP/.gemini/antigravity/brain/f2d59d98-9e0a-4517-9d26-489f1f730079/.user_uploaded/media_1794644201168_f3d8c88d.png'
im = Image.open(orig_path).convert('RGBA')
arr = np.array(im)
alpha = arr[:, :, 3]
non_zero = np.where(alpha > 10)
ymin, ymax = non_zero[0].min(), non_zero[0].max()
xmin, xmax = non_zero[1].min(), non_zero[1].max()
bbox_w = xmax - xmin + 1
bbox_h = ymax - ymin + 1

print(f"Original image: size={im.size}, bbox=({xmin}, {ymin}, {xmax}, {ymax}), bbox_size=({bbox_w}, {bbox_h})")
print(f"Aspect ratio of S: {bbox_w / bbox_h:.4f}")

