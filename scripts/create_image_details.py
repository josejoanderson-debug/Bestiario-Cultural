from pathlib import Path
from PIL import Image, ImageEnhance

ASSET_DIR = Path("/home/ubuntu/webdev-static-assets")

for source in ASSET_DIR.glob("cultura-*"):
    if "-detalhe" in source.stem:
        continue
    try:
        with Image.open(source) as opened:
            image = opened.convert("RGB")
            width, height = image.size
            left = int(width * 0.22)
            top = int(height * 0.08)
            right = int(width * 0.94)
            bottom = int(height * 0.9)
            detail = image.crop((left, top, right, bottom))
            detail = ImageEnhance.Color(detail).enhance(1.08)
            detail = ImageEnhance.Contrast(detail).enhance(1.04)
            detail.thumbnail((960, 720), Image.Resampling.LANCZOS)
            destination = source.with_name(f"{source.stem}-detalhe.webp")
            detail.save(destination, "WEBP", quality=86, method=6)
            print(destination.name)
    except Exception as error:
        raise RuntimeError(f"Não foi possível processar {source.name}: {error}") from error
