# 🚀 Guía de Deployment - App Tamagotchi en Vercel

Esta guía explica cómo desplegar la app Tamagotchi con integración de IA en Vercel.

---

## 📋 Pre-requisitos

1. ✅ API de IA desplegada en Render.com (ver `DEPLOYMENT.md` en el proyecto Python)
2. ✅ Cuenta en [Vercel](https://vercel.com) (gratis)
3. ✅ Cuenta en [GitHub](https://github.com)
4. ✅ Repositorio GitHub creado para la app React

---

## 🎯 Paso 1: Crear Repositorio en GitHub

### Desde Terminal

```bash
# Ir al directorio del proyecto
cd /Users/diego/Downloads/tamagotchi-app-11-backup_20260127_163746

# Inicializar repositorio Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "feat: App Tamagotchi con integración de IA"

# Crear repositorio en GitHub (usando GitHub CLI)
gh repo create tamagotchi-app --public --source=. --remote=origin --push
```

### Sin GitHub CLI

1. Crea el repositorio en https://github.com/new
   - Nombre: `tamagotchi-app`
   - Visibilidad: Public o Private (Vercel funciona con ambos)
   
2. Conecta con tu repo local:
```bash
git remote add origin https://github.com/TU_USUARIO/tamagotchi-app.git
git branch -M main
git push -u origin main
```

---

## 🌐 Paso 2: Desplegar en Vercel

### 2.1 Importar Proyecto

1. Ve a https://vercel.com/new
2. Haz clic en **"Import Git Repository"**
3. Conecta con GitHub (si no lo has hecho)
4. Selecciona el repositorio `tamagotchi-app`
5. Haz clic en **"Import"**

### 2.2 Configurar Proyecto

Vercel detectará automáticamente que es un proyecto Vite + React.

**Configuración predeterminada:**
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**NO cambies nada**, Vercel lo detecta correctamente.

### 2.3 Variables de Entorno

**MUY IMPORTANTE:** Configura las variables de entorno ANTES de desplegar.

1. En la página de configuración, expande **"Environment Variables"**

2. Agrega todas tus variables de Firebase + la variable de IA:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | (tu clave de Firebase) | Production, Preview, Development |
| `VITE_FIREBASE_AUTH_DOMAIN` | (tu dominio) | Production, Preview, Development |
| `VITE_FIREBASE_PROJECT_ID` | (tu proyecto ID) | Production, Preview, Development |
| `VITE_FIREBASE_STORAGE_BUCKET` | (tu bucket) | Production, Preview, Development |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | (tu sender ID) | Production, Preview, Development |
| `VITE_FIREBASE_APP_ID` | (tu app ID) | Production, Preview, Development |
| **`VITE_AI_API_URL`** | **`https://tu-api.onrender.com`** | **Production, Preview, Development** |

**⚠️ IMPORTANTE:**  
Cambia `https://tu-api.onrender.com` por la URL real de tu API en Render.com.

### 2.4 Desplegar

1. Haz clic en **"Deploy"**
2. Espera 2-3 minutos mientras Vercel:
   - Clona el repositorio
   - Instala dependencias (`npm install`)
   - Ejecuta build (`npm run build`)
   - Despliega a CDN global

### 2.5 Verificar Deployment

Una vez completado, verás:

✅ Estado: **"Ready"**  
✅ URL: `https://tamagotchi-app-xxx.vercel.app`

**Probar la app:**
1. Haz clic en la URL de deployment
2. La app debería cargar normalmente
3. Ve al juego "🤖 Piedra, Papel o Tijera IA"
4. Deberías ver "🤖 IA conectada" (verde)
5. Juega unas rondas para verificar

---

## 🔄 Paso 3: Actualizar CORS en la API

Ahora que conoces la URL de Vercel, actualiza el servidor de IA:

1. Ve a Render.com → Tu servicio → **"Environment"**
2. Actualiza `ALLOWED_ORIGINS`:

```
https://tamagotchi-app-xxx.vercel.app,http://localhost:5173
```

3. Guarda y re-despliega el servicio

---

## 🎮 Paso 4: Probar en Producción

1. Abre tu app: `https://tamagotchi-app-xxx.vercel.app`
2. Crea una mascota o continúa con una existente
3. Haz clic en "Jugar" → "🤖 Piedra, Papel o Tijera IA"
4. Verifica:
   - ✅ Indicador verde "🤖 IA conectada"
   - ✅ La IA responde en <3 segundos
   - ✅ Las rondas se guardan (verificar en Render logs)

---

## 📊 Dominio Personalizado (Opcional)

### Agregar Dominio Propio

Si tienes un dominio (ej: `tamagotchi.midominio.com`):

1. En Vercel → **"Settings"** → **"Domains"**
2. Haz clic en **"Add"**
3. Ingresa tu dominio: `tamagotchi.midominio.com`
4. Sigue las instrucciones para configurar DNS

**Configuración DNS:**
```
Type: CNAME
Name: tamagotchi
Value: cname.vercel-dns.com
```

---

## 🔄 Actualizaciones Automáticas

Vercel se despliega automáticamente cuando haces push a GitHub:

```bash
# Hacer cambios al código
git add .
git commit -m "feat: Mejorar UI del juego"
git push origin main

# Vercel detecta el push y despliega automáticamente
```

### Branches de Preview

Cada branch en GitHub obtiene su propia URL de preview:

```bash
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad

# Vercel crea: https://tamagotchi-app-git-feature-nueva-funcionalidad.vercel.app
```

---

## 💰 Costos

**Vercel Free (Hobby):**
- ✅ **Despliegues ilimitados**
- ✅ **Dominios personalizados gratis**
- ✅ **SSL automático**
- ✅ **100 GB bandwidth/mes**
- ✅ **Builds ilimitados**
- ⚠️ Solo para proyectos personales/no comerciales

**Vercel Pro ($20/mes):**
- Todo lo anterior +
- Sin límites comerciales
- Analytics avanzados
- Más bandwidth

---

## ⚠️ Solución de Problemas

### Error: "IA offline" en producción

**Posibles causas:**
1. Variable `VITE_AI_API_URL` mal configurada
2. API de Render dormida (free tier)
3. CORS bloqueando peticiones

**Solución:**
```bash
# Verificar variables de entorno en Vercel
vercel env ls

# Ver logs en Render
# Render Dashboard → Logs

# Probar API manualmente
curl https://tu-api.onrender.com/health
```

### Build falla con error de memoria

**Solución:**
```bash
# En Vercel, aumentar Node.js memory:
# Settings → General → Node.js Version → Latest
```

### Firebase error en producción

**Solución:**
1. Verifica que todas las variables `VITE_FIREBASE_*` estén configuradas
2. Agrega tu dominio de Vercel a Firebase Console:
   - Firebase → Authentication → Settings → Authorized domains
   - Agrega: `tamagotchi-app-xxx.vercel.app`

---

## 🔒 Seguridad

### Variables de Entorno

- ✅ Usa variables de entorno para claves sensibles
- ❌ NUNCA hagas commit de archivos `.env` con claves reales
- ✅ El archivo `.env.example` está bien (sin valores reales)

### Firebase

1. Configura dominios autorizados en Firebase Console
2. Solo permite tu dominio de Vercel + localhost
3. Activa restricciones de API key

---

## 📈 Monitoreo

### Analytics (Opcional)

1. Vercel → **"Analytics"** (requiere plan Pro)
2. O usa Google Analytics gratuito

### Logs en Tiempo Real

```bash
# Instalar Vercel CLI
npm i -g vercel

# Ver logs en tiempo real
vercel logs tamagotchi-app --follow
```

---

## 🎯 Checklist Final

Antes de compartir tu app, verifica:

- [ ] ✅ App desplegada en Vercel
- [ ] ✅ API desplegada en Render.com
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ CORS actualizado con URL de Vercel
- [ ] ✅ Juego de IA funciona ("IA conectada")
- [ ] ✅ Firebase auth funciona
- [ ] ✅ Todos los minijuegos funcionan
- [ ] ✅ PWA funciona (instalar en móvil)
- [ ] ✅ Responsive en móvil

---

## 📞 Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Community:** https://github.com/vercel/vercel/discussions
- **Status:** https://vercel-status.com

---

## 🎉 ¡Listo!

Tu app Tamagotchi con IA está ahora disponible globalmente en:

🌐 **`https://tamagotchi-app-xxx.vercel.app`**

Comparte el link con amigos y que disfruten jugando contra tu modelo de IA entrenado! 🎮🤖
