"use client";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/evaluar');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = login(username, password);
    
    if (success) {
      router.push('/evaluar');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
      {/* Fondo con patrón PUCP */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: '#1e40af', opacity: 0.05 }}></div>
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full" style={{ backgroundColor: '#3b82f6', opacity: 0.1 }}></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full" style={{ backgroundColor: '#1e40af', opacity: 0.08 }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8 px-6">
        {/* Header con logo PUCP */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#1e40af' }}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#1e40af' }}>
            Sistema de Evaluación
          </h1>
          <h2 className="text-xl font-semibold mt-2" style={{ color: '#1f2937' }}>
            PUCP
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#64748b' }}>
            Pontificia Universidad Católica del Perú
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-xl shadow-xl p-8 border" style={{ borderColor: '#e2e8f0' }}>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold" style={{ color: '#1f2937' }}>
              Iniciar Sesión
            </h3>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>
              Accede al sistema de retroalimentación académica
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md" style={{ backgroundColor: '#fee2e2', borderColor: '#fecaca', border: '1px solid' }}>
                <p className="text-sm" style={{ color: '#dc2626' }}>
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#d1d5db', 
                  color: '#1f2937'
                }}
                placeholder="Ingresa tu usuario"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-colors"
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#d1d5db', 
                  color: '#1f2937' 
                }}
                placeholder="Ingresa tu contraseña"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-lg text-base font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800"
              style={{ 
                backgroundColor: loading ? '#9ca3af' : '#1e40af'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 text-center">
            <p className="text-xs" style={{ color: '#9ca3af' }}>
              Sistema de Retroalimentación Académica PUCP
            </p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              © 2025 Pontificia Universidad Católica del Perú
            </p>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-xs font-semibold text-blue-800 mb-2">Credenciales de Prueba:</p>
          <p className="text-xs text-blue-700">
            <strong>Usuario:</strong> admin<br />
            <strong>Contraseña:</strong> pucp2024
          </p>
        </div>
      </div>
    </div>
  );
}
