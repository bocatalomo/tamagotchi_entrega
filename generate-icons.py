#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_background(size):
    """Crea un fondo con gradiente"""
    image = Image.new('RGB', size, color='#667eea')
    draw = ImageDraw.Draw(image)
    
    # Crear gradiente
    for y in range(size[1]):
        # Interpolación de color de #667eea a #764ba2
        ratio = y / size[1]
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
    
    return image

def create_icon(size, filename):
    """Crea un icono con emoji de huevo"""
    # Crear fondo con gradiente
    img = create_gradient_background((size, size))
    draw = ImageDraw.Draw(img)
    
    # Añadir círculo blanco semi-transparente en el centro
    circle_size = int(size * 0.7)
    circle_pos = (size - circle_size) // 2
    
    # Crear una capa para el círculo con transparencia
    overlay = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.ellipse(
        [circle_pos, circle_pos, circle_pos + circle_size, circle_pos + circle_size],
        fill=(255, 255, 255, 200)
    )
    
    # Convertir la imagen base a RGBA y componer
    img = img.convert('RGBA')
    img = Image.alpha_composite(img, overlay)
    
    # Intentar añadir texto emoji (funciona en algunos sistemas)
    try:
        font_size = int(size * 0.5)
        # Intentar usar una fuente del sistema que soporte emojis
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Apple Color Emoji.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf", font_size)
            except:
                font = ImageFont.truetype("seguiemj.ttf", font_size) if os.name == 'nt' else None
        
        if font:
            emoji = "🥚"
            bbox = draw.textbbox((0, 0), emoji, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            
            position = ((size - text_width) // 2, (size - text_height) // 2 - int(size * 0.05))
            draw.text(position, emoji, font=font, embedded_color=True)
    except Exception as e:
        print(f"No se pudo añadir emoji, usando círculo: {e}")
        # Si falla, dibujar un círculo amarillo como alternativa
        egg_size = int(size * 0.4)
        egg_pos = (size - egg_size) // 2
        draw.ellipse(
            [egg_pos, egg_pos + int(egg_size * 0.1), 
             egg_pos + egg_size, egg_pos + egg_size + int(egg_size * 0.1)],
            fill='#FFF3B0',
            outline='#FFD700',
            width=max(2, size // 100)
        )
    
    # Convertir de vuelta a RGB para PNG
    if img.mode == 'RGBA':
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    
    # Guardar
    img.save(filename, 'PNG', optimize=True)
    print(f"✓ Creado: {filename}")

# Crear directorio public si no existe
os.makedirs('public', exist_ok=True)

# Generar iconos
create_icon(192, 'public/icon-192.png')
create_icon(512, 'public/icon-512.png')

print("\n¡Iconos generados exitosamente!")
