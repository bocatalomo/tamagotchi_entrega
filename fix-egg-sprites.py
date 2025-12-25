#!/usr/bin/env python3
from PIL import Image
import os

def make_white_transparent(image_path):
    """Convierte los píxeles blancos o casi blancos a transparentes"""
    try:
        # Abrir la imagen
        img = Image.open(image_path)

        # Convertir a RGBA si no lo está
        img = img.convert("RGBA")

        # Obtener los datos de píxeles
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Cambiar todos los píxeles blancos (o casi blancos) a transparentes
            # Umbral: si R, G, B están todos por encima de 240, considerarlo blanco
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                # Hacer transparente (alpha = 0)
                new_data.append((255, 255, 255, 0))
            else:
                # Mantener el píxel original
                new_data.append(item)

        # Actualizar los datos de la imagen
        img.putdata(new_data)

        # Guardar la imagen con transparencia
        img.save(image_path, "PNG")
        print(f"✓ Procesado: {image_path}")
        return True

    except Exception as e:
        print(f"✗ Error procesando {image_path}: {e}")
        return False

# Colores de mascotas
colors = ['white', 'brown', 'black']

# Archivos de huevo a procesar
egg_files = ['egg-idle.png', 'egg-shake.png', 'egg-crack.png']

print("Procesando sprites de huevo...")
print("-" * 50)

for color in colors:
    color_path = f'public/assets/pets/{color}'

    if not os.path.exists(color_path):
        print(f"⚠ Directorio no encontrado: {color_path}")
        continue

    print(f"\nProcesando color: {color}")

    for egg_file in egg_files:
        file_path = os.path.join(color_path, egg_file)

        if os.path.exists(file_path):
            make_white_transparent(file_path)
        else:
            print(f"⚠ Archivo no encontrado: {file_path}")

print("\n" + "=" * 50)
print("¡Proceso completado!")
print("Los sprites de huevo ahora tienen fondo transparente.")
