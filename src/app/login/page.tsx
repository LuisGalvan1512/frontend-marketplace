'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Store in auth context
      login(data.data.token, data.data.user);

      // Redirect depending on role
      if (data.data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 transition-colors duration-300">
      <div className="w-full max-w-[400px] bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-8 transition-all hover:shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">TechStore</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Inicia sesión para continuar comprando</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg mb-6 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Contraseña
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? 'Iniciando sesión...' : 'Continuar'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-white/5 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-[#0071e3] dark:text-blue-400 hover:underline font-medium">
              Crea la tuya ahora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
