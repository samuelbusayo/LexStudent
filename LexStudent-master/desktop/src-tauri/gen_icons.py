from PIL import Image, ImageDraw, ImageFont
import os

size = 1024
img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

margin = 40
draw.rounded_rectangle(
    [(margin, margin), (size - margin, size - margin)],
    radius=160,
    fill=(0, 10, 30, 255)
)

draw.rounded_rectangle(
    [(margin, margin), (size - margin, margin + 120)],
    radius=160,
    fill=(115, 92, 0, 255)
)
draw.rectangle(
    [(margin, margin + 60), (size - margin, margin + 120)],
    fill=(115, 92, 0, 255)
)

try:
    font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 460)
except Exception:
    font = ImageFont.load_default()

bbox = draw.textbbox((0, 0), "LS", font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = (size - tw) // 2
ty = (size - th) // 2 + 40
draw.text((tx, ty), "LS", fill=(255, 255, 255, 255), font=font)

cx = size // 2
by = size - margin - 80
draw.line([(cx - 100, by), (cx + 100, by)], fill=(254, 214, 91, 255), width=6)
draw.line([(cx, by), (cx, by - 40)], fill=(254, 214, 91, 255), width=6)

out = os.path.join(os.path.dirname(__file__), "icons")
img.save(os.path.join(out, "icon.png"))

for s in [32, 128, 256]:
    resized = img.resize((s, s), Image.LANCZOS)
    resized.save(os.path.join(out, f"{s}x{s}.png"))

img.resize((256, 256), Image.LANCZOS).save(os.path.join(out, "128x128@2x.png"))

ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
img.save(os.path.join(out, "icon.ico"), format="ICO", sizes=ico_sizes)

img.resize((512, 512), Image.LANCZOS).save(os.path.join(out, "icon.icns"), format="PNG")

print("Icons generated successfully")
