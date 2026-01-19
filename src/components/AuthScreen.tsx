import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthScreen.css';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">
          {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
        </h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">NOMBRE</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="auth-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">CONTRASEÑA</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="auth-button primary"
          >
            {loading ? 'CARGANDO...' : (isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE')}
          </button>
        </form>

        <div className="divider">
          <span>O</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="auth-button google"
        >
          <span className="google-icon">G</span>
          CONTINUAR CON GOOGLE
        </button>

        <div className="auth-switch">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="switch-button"
          >
            {isLogin 
              ? '¿No tienes cuenta? REGÍSTRATE' 
              : '¿Ya tienes cuenta? INICIA SESIÓN'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;