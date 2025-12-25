#!/usr/bin/env python3
from PIL import Image, ImageDraw

# Configuración de colores para cada tipo de huevo
egg_colors = {
    'white': {
        'main': (245, 245, 245),      # Blanco principal
        'shadow': (200, 200, 200),    # Sombra
        'spots': (220, 220, 220)      # Manchas
    },
    'brown': {
        'main': (210, 180, 140),      # Café claro
        'shadow': (160, 130, 100),    # Sombra café
        'spots': (180, 150, 120)      # Manchas café
    },
    'black': {
        'main': (80, 80, 80),         # Gris oscuro
        'shadow': (40, 40, 40),       # Negro
        'spots': (60, 60, 60)         # Gris medio
    }
}

def create_egg_idle(color_name, colors):
    """Crea sprite de huevo idle (3 frames con ligero movimiento)"""
    frame_width = 32
    frame_height = 32
    frames = 3

    # Crear imagen con todos los frames
    img = Image.new('RGBA', (frame_width * frames, frame_height), (0, 0, 0, 0))

    for frame in range(frames):
        draw = ImageDraw.Draw(img)
        x_offset = frame * frame_width

        # Ligero movimiento vertical
        y_shift = 0 if frame == 1 else (1 if frame == 0 else -1)

        # Dibujar huevo (forma ovalada)
        # Base del huevo
        egg_points = [
            (x_offset + 11, 8 + y_shift),
            (x_offset + 21, 8 + y_shift),
            (x_offset + 24, 12 + y_shift),
            (x_offset + 25, 18 + y_shift),
            (x_offset + 24, 24 + y_shift),
            (x_offset + 21, 28 + y_shift),
            (x_offset + 11, 28 + y_shift),
            (x_offset + 8, 24 + y_shift),
            (x_offset + 7, 18 + y_shift),
            (x_offset + 8, 12 + y_shift),
        ]

        # Dibujar sombra (lado derecho)
        shadow_points = [
            (x_offset + 20, 10 + y_shift),
            (x_offset + 23, 14 + y_shift),
            (x_offset + 24, 20 + y_shift),
            (x_offset + 22, 26 + y_shift),
            (x_offset + 20, 27 + y_shift),
            (x_offset + 20, 10 + y_shift),
        ]

        draw.polygon(egg_points, fill=colors['main'])
        draw.polygon(shadow_points, fill=colors['shadow'])

        # Manchas decorativas
        draw.ellipse([x_offset + 12, 14 + y_shift, x_offset + 15, 17 + y_shift], fill=colors['spots'])
        draw.ellipse([x_offset + 18, 20 + y_shift, x_offset + 20, 22 + y_shift], fill=colors['spots'])

    return img

def create_egg_crack(color_name, colors):
    """Crea sprite de huevo rompiéndose (4 frames)"""
    frame_width = 32
    frame_height = 32
    frames = 4

    img = Image.new('RGBA', (frame_width * frames, frame_height), (0, 0, 0, 0))

    for frame in range(frames):
        draw = ImageDraw.Draw(img)
        x_offset = frame * frame_width

        # Huevo base (mismo para todos los frames)
        egg_points = [
            (x_offset + 11, 8),
            (x_offset + 21, 8),
            (x_offset + 24, 12),
            (x_offset + 25, 18),
            (x_offset + 24, 24),
            (x_offset + 21, 28),
            (x_offset + 11, 28),
            (x_offset + 8, 24),
            (x_offset + 7, 18),
            (x_offset + 8, 12),
        ]

        draw.polygon(egg_points, fill=colors['main'])

        # Grietas progresivas
        crack_color = (50, 50, 50)

        if frame >= 1:
            # Primera grieta (arriba)
            draw.line([x_offset + 14, 10, x_offset + 16, 8], fill=crack_color, width=1)
            draw.line([x_offset + 16, 8, x_offset + 18, 10], fill=crack_color, width=1)

        if frame >= 2:
            # Segunda grieta (medio)
            draw.line([x_offset + 12, 18, x_offset + 16, 16], fill=crack_color, width=1)
            draw.line([x_offset + 16, 16, x_offset + 20, 18], fill=crack_color, width=1)
            # Movimiento (shake)
            if frame == 2:
                draw.rectangle([x_offset, 0, x_offset + frame_width, frame_height], fill=None)

        if frame >= 3:
            # Grietas más grandes
            draw.line([x_offset + 10, 12, x_offset + 14, 14], fill=crack_color, width=2)
            draw.line([x_offset + 18, 14, x_offset + 22, 12], fill=crack_color, width=2)
            draw.line([x_offset + 13, 22, x_offset + 16, 24], fill=crack_color, width=2)

    return img

def create_egg_shake(color_name, colors):
    """Crea sprite de huevo temblando (6 frames)"""
    frame_width = 32
    frame_height = 32
    frames = 6

    img = Image.new('RGBA', (frame_width * frames, frame_height), (0, 0, 0, 0))

    for frame in range(frames):
        draw = ImageDraw.Draw(img)
        x_offset = frame * frame_width

        # Movimiento de shake más pronunciado
        shake_x = [0, 2, -2, 2, -1, 0][frame]
        shake_y = [0, -1, 1, -1, 1, 0][frame]

        # Dibujar huevo con offset de shake
        egg_points = [
            (x_offset + 11 + shake_x, 8 + shake_y),
            (x_offset + 21 + shake_x, 8 + shake_y),
            (x_offset + 24 + shake_x, 12 + shake_y),
            (x_offset + 25 + shake_x, 18 + shake_y),
            (x_offset + 24 + shake_x, 24 + shake_y),
            (x_offset + 21 + shake_x, 28 + shake_y),
            (x_offset + 11 + shake_x, 28 + shake_y),
            (x_offset + 8 + shake_x, 24 + shake_y),
            (x_offset + 7 + shake_x, 18 + shake_y),
            (x_offset + 8 + shake_x, 12 + shake_y),
        ]

        draw.polygon(egg_points, fill=colors['main'])

        # Sombra
        shadow_points = [
            (x_offset + 20 + shake_x, 10 + shake_y),
            (x_offset + 23 + shake_x, 14 + shake_y),
            (x_offset + 24 + shake_x, 20 + shake_y),
            (x_offset + 22 + shake_x, 26 + shake_y),
            (x_offset + 20 + shake_x, 27 + shake_y),
        ]
        draw.polygon(shadow_points, fill=colors['shadow'])

        # Manchas
        draw.ellipse([x_offset + 12 + shake_x, 14 + shake_y, x_offset + 15 + shake_x, 17 + shake_y], fill=colors['spots'])
        draw.ellipse([x_offset + 18 + shake_x, 20 + shake_y, x_offset + 20 + shake_x, 22 + shake_y], fill=colors['spots'])

    return img

# Generar sprites para cada color
for color_name, colors in egg_colors.items():
    print(f"Generando sprites de huevo para {color_name}...")

    # Idle
    egg_idle = create_egg_idle(color_name, colors)
    egg_idle.save(f'public/assets/pets/{color_name}/egg-idle.png')

    # Crack
    egg_crack = create_egg_crack(color_name, colors)
    egg_crack.save(f'public/assets/pets/{color_name}/egg-crack.png')

    # Shake
    egg_shake = create_egg_shake(color_name, colors)
    egg_shake.save(f'public/assets/pets/{color_name}/egg-shake.png')

    print(f"  ✓ egg-idle.png")
    print(f"  ✓ egg-crack.png")
    print(f"  ✓ egg-shake.png")

print("\n¡Sprites de huevo generados exitosamente!")
