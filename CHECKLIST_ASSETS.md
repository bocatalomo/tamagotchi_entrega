# 📋 Checklist de Assets - Tamagotchi

## 🟤 Gato Café (Brown)

### Animaciones Automáticas
- [x] `idle.png` (256×24px, 8 frames) ✅ **COMPLETADO**
- [ ] `blink.png` (128×24px, 4 frames)
- [ ] `yawn.png` (192×24px, 6 frames)
- [ ] `scratch.png` (192×24px, 6 frames)

### Animaciones Manuales
- [ ] `eating.png` (192×24px, 6 frames)
- [ ] `sleeping.png` (128×24px, 4 frames)
- [ ] `playing.png` (256×24px, 8 frames)

**Progreso Brown: 1/7 (14%)**

---

## ⚪ Gato Blanco (White)

### Animaciones Automáticas
- [ ] `idle.png` (256×24px, 8 frames)
- [ ] `blink.png` (128×24px, 4 frames)
- [ ] `yawn.png` (192×24px, 6 frames)
- [ ] `scratch.png` (192×24px, 6 frames)

### Animaciones Manuales
- [ ] `eating.png` (192×24px, 6 frames)
- [ ] `sleeping.png` (128×24px, 4 frames)
- [ ] `playing.png` (256×24px, 8 frames)

**Progreso White: 0/7 (0%)**

---

## ⚫ Gato Negro (Black)

### Animaciones Automáticas
- [ ] `idle.png` (256×24px, 8 frames)
- [ ] `blink.png` (128×24px, 4 frames)
- [ ] `yawn.png` (192×24px, 6 frames)
- [ ] `scratch.png` (192×24px, 6 frames)

### Animaciones Manuales
- [ ] `eating.png` (192×24px, 6 frames)
- [ ] `sleeping.png` (128×24px, 4 frames)
- [ ] `playing.png` (256×24px, 8 frames)

**Progreso Black: 0/7 (0%)**

---

## 📊 Progreso Total

**Total de Assets:** 1/21 (4.8%)

```
████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  4.8%
```

---

## 🎨 Orden Recomendado de Creación

### Fase 1: Completar Brown (Café) - Prioridad Alta
1. [ ] `brown/blink.png` - Más fácil, solo 4 frames
2. [ ] `brown/eating.png` - Importante para funcionalidad
3. [ ] `brown/sleeping.png` - Importante para funcionalidad
4. [ ] `brown/playing.png` - Importante para funcionalidad
5. [ ] `brown/yawn.png`
6. [ ] `brown/scratch.png`

### Fase 2: Duplicar a White y Black - Prioridad Media
7. [ ] Copiar y recolorear todas las animaciones brown → white
8. [ ] Copiar y recolorear todas las animaciones brown → black

---

## 💡 Consejos

### Para Acelerar el Proceso:

1. **Usa el idle.png actual como plantilla**
   - Ya tiene las dimensiones correctas
   - Mantén el mismo estilo pixel art

2. **Crea primero en Brown**
   - Una vez que tengas todas las animaciones brown
   - Puedes duplicar y solo cambiar colores

3. **Prioriza funcionalidad**
   - `eating`, `sleeping`, `playing` son las más importantes
   - Son activadas por el usuario
   - Sin ellas, algunas acciones no tendrán feedback visual

4. **Herramientas recomendadas**
   - Aseprite (pixel art editor)
   - Piskel (online, gratis)
   - Photoshop (con grid de 32×24px)

---

## ✅ Verificación de Assets

Antes de marcar como completado, verifica:

- [ ] Dimensiones correctas (32px × frames, 24px altura)
- [ ] Fondo transparente (PNG con canal alpha)
- [ ] Frames alineados horizontalmente
- [ ] Sin espacios entre frames
- [ ] Gato centrado en cada frame
- [ ] Estilo consistente con idle.png

---

## 🚀 Testing

Para probar cada animación:

1. Coloca el archivo en la carpeta correcta:
   ```
   /public/assets/pets/{color}/{animation}.png
   ```

2. Reinicia el servidor de desarrollo

3. Para animaciones automáticas (idle, blink, yawn, scratch):
   - Solo espera, se reproducirán solas

4. Para animaciones manuales:
   - `eating`: Ve a Care → Feed
   - `sleeping`: Ve a Care → Sleep
   - `playing`: Ve a Play → Play

---

## 📝 Notas

Actualiza este checklist conforme vayas creando los assets.

Para marcar como completado, cambia:
```markdown
- [ ] nombre.png
```
a:
```markdown
- [x] nombre.png ✅
```

---

**¡Buena suerte creando los sprites! 🎨✨**
