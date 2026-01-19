import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  lastLogin: number;
  provider: 'email' | 'google';
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Crear o actualizar perfil de usuario en Firestore
  const createOrUpdateProfile = async (user: User, provider: 'email' | 'google'): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    const profileData: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!,
      photoURL: user.photoURL || '',
      createdAt: userDoc.exists() ? userDoc.data().createdAt : Date.now(),
      lastLogin: Date.now(),
      provider
    };

    await setDoc(userRef, profileData, { merge: true });
    setUserProfile(profileData);
  };

  // Login con email y contraseña
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createOrUpdateProfile(result.user, 'email');
    } catch (error: any) {
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuario no encontrado. Regístrate primero.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Contraseña incorrecta.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido.');
      } else {
        throw new Error(error.message || 'Error al iniciar sesión');
      }
    }
  };

  // Registro con email y contraseña
  const registerWithEmail = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateProfile(result.user, 'email');
    } catch (error: any) {
      // Manejar errores específicos de Firebase
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email ya está registrado. Inicia sesión.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido.');
      } else {
        throw new Error(error.message || 'Error al registrar usuario');
      }
    }
  };

  // Login con Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createOrUpdateProfile(result.user, 'google');
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  // Cerrar sesión
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  };

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setUser(user);
        if (user) {
          try {
            // Cargar perfil del usuario
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              setUserProfile(userDoc.data() as UserProfile);
            } else {
              // Si no existe el perfil, crear uno
              await createOrUpdateProfile(user, 'email');
            }
          } catch (firestoreError) {
            console.error('Error loading user profile:', firestoreError);
            // Continuar con autenticación básica incluso si el perfil falla
          }
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};