# 🔒 Guía de Seguridad Firebase - Tamagotchi App

## Configuración de Restricciones de Dominio

### Pasos para proteger tu API Key:

1. **Ve a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto: `tamagotchi-entrega`

2. **Navega a Configuración de Proyecto:**
   - Click en el ícono de engranaje (⚙️) junto a "Project Overview"
   - Selecciona "Project settings"

3. **Configura las restricciones de API Key:**
   - Busca la sección "Your apps" → Web app (tamagotchi)
   - Click en "API key" para expandir las opciones
   - **Actions** → **Edit API key**

4. **Establecer restricciones:**

   **Key restriction:**
   - ✅ **Accept requests from these HTTP referrers (websites)**
   - Agregar los dominios donde se usará la app:
     ```
     localhost:5173
     localhost:5174
     127.0.0.1:5173
     tamagotchi-app.vercel.app  (si desplegas)
     ```

   **Application restrictions:**
   - ✅ **Web browsers (HTTP referrers)**

5. **Guarda los cambios**

## ⚠️ Importante

- **NUNCA** expongas tu API key en repositorios públicos
- **SIEMPRE** usa variables de entorno (ya implementado en `.env.local`)
- **REVISA** regularmente el uso de tu Firebase Console
- **CONFIGURA** alertas de facturación

## 🔧 Si la app deja de funcionar

1. Verifica que `.env.local` existe y tiene los valores correctos
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Verifica las restricciones de dominio en Firebase Console
4. Contacta al desarrollador si persisten los problemas
