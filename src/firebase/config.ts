import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Extender el tipo ImportMeta para las variables de entorno
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'API_KEY_MISSING',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'tamagotchi-entrega.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'tamagotchi-entrega',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'tamagotchi-entrega.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '642802937477',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:642802937477:web:e7ba1e69807044d4a1c3ec',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XCTWP1YLZR'
};

// Validar que la API key no sea el placeholder de seguridad
const validateConfig = () => {
  const issues: string[] = [];

  if (firebaseConfig.apiKey === 'API_KEY_MISSING' || firebaseConfig.apiKey.includes('Tu_api_key_aqui')) {
    issues.push('apiKey: API key no configurada en variables de entorno');
  }

  if (firebaseConfig.apiKey.length < 20) {
    issues.push('apiKey: Formato de API key inválido');
  }

  if (issues.length > 0) {
    console.error('🔒 ERROR DE SEGURIDAD: Firebase config incompleta');
    issues.forEach(issue => console.error(`  - ${issue}`));
    console.error('\n📖 Para configurar:');
    console.error('1. Crea un archivo .env.local en la raíz del proyecto');
    console.error('2. Agrega las siguientes variables:');
    console.error('   VITE_FIREBASE_API_KEY=tu_api_key_de_firebase');
    console.error('3. Reinicia el servidor de desarrollo');
    return false;
  }

  return true;
};

// Inicializar Firebase solo si la configuración es válida
let app;
if (validateConfig()) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado correctamente');
} else {
  console.error('🔒 No se pudo inicializar Firebase - modo offline');
  // Crear una app mock para evitar errores de compilación
  app = { name: 'mock-app' } as any;
}

// Inicializar servicios
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
