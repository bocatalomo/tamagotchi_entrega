import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para Tamagotchi App
const firebaseConfig = {
  apiKey: "AIzaSyBKZ0BWgFT03gJ1d5yd_R6lxBLs_tKG31U",
  authDomain: "tamagotchi-entrega.firebaseapp.com",
  projectId: "tamagotchi-entrega",
  storageBucket: "tamagotchi-entrega.firebasestorage.app",
  messagingSenderId: "642802937477",
  appId: "1:642802937477:web:e7ba1e69807044d4a1c3ec",
  measurementId: "G-XCTWP1YLZR"
};

// Validar que todos los campos estén configurados
const validateConfig = () => {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => firebaseConfig[key].includes('TU_'));
  
  if (missing.length > 0) {
    console.error('❌ Firebase config incompleta. Faltan:', missing);
    console.error('📖 Instrucciones:');
    console.error('1. Ve a Firebase Console → Project Settings → Web apps');
    console.error('2. Copia el objeto firebaseConfig');
    console.error('3. Reemplaza los valores en src/firebase/config.ts');
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
  console.error('❌ No se pudo inicializar Firebase');
  // Crear una app mock para evitar errores
  app = { name: 'mock-app' } as any;
}

// Inicializar servicios
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;