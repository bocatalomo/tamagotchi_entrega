import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { createTamagotchi } from '../services/tamagotchiService';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [nameInputStep, setNameInputStep] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        if (!name.trim()) {
          setError('Ingresa un nombre para tu tamagotchi');
          return;
        }
        await registerWithEmail(email, password, name);
        await createTamagotchi({ name: name.trim() });
      } else {
        await loginWithEmail(email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Error con Google');
    }
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setNameInputStep(false);
    setName('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          <span style={{ fontSize: '4rem' }}>🥚</span>
          <h1 style={{
            fontFamily: 'Press Start 2P, cursive',
            fontSize: '1.5rem',
            color: '#00d9ff',
            marginTop: '20px',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
          }}>
            Mi Tamagotchi
          </h1>
          <p style={{ color: '#888', marginTop: '10px', fontSize: '0.9rem' }}>
            {isRegistering ? 'Crea tu cuenta y adopta un tamagotchi' : 'Inicia sesión para ver a tu tamagotchi'}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid #ff4757',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              color: '#ff4757',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {isRegistering && !nameInputStep && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.85rem' }}>
                Nombre de tu tamagotchi
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Pochi"
                style={{
                  width: '100%',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '2px solid rgba(0, 217, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </motion.div>
          )}

          <div>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.85rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.85rem' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%)',
              color: '#1a1a2e',
              fontSize: '1rem',
              fontWeight: 'bold',
              fontFamily: 'Press Start 2P, cursive',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 10px 30px rgba(0, 217, 255, 0.3)',
            }}
          >
            {loading ? 'Cargando...' : isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </motion.button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '25px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ padding: '0 15px', color: '#666', fontSize: '0.85rem' }}>O</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <motion.button
          onClick={handleGoogleLogin}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.9rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </motion.button>

        <motion.button
          onClick={switchMode}
          disabled={loading}
          style={{
            marginTop: '25px',
            background: 'none',
            border: 'none',
            color: '#00d9ff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            width: '100%',
            textAlign: 'center',
          }}
          whileHover={{ scale: 1.02 }}
        >
          {isRegistering
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </motion.button>
      </motion.div>

      <p style={{
        marginTop: '30px',
        color: '#555',
        fontSize: '0.75rem',
        textAlign: 'center',
      }}>
        Tu tamagotchi se guarda automáticamente en la nube
        <br />
        Accede desde cualquier dispositivo
      </p>
    </div>
  );
};

export default LoginScreen;
