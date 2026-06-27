'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-[#161617]/90 dark:bg-black/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 text-white select-none">
      <div className="max-w-[1024px] mx-auto px-4">
        <div className="flex justify-between h-12 items-center text-xs font-normal tracking-tight text-[#f5f5f7]/80">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-white">
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block mr-1 shadow-sm"></span>
              TechStore
            </Link>
            
            <Link href="/" className="hover:text-white transition-colors">
              Tienda
            </Link>
            
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="hover:text-white transition-colors text-blue-400 font-medium">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-[#f5f5f7]/70 hover:text-white transition-all text-sm p-1.5 rounded-full hover:bg-white/5 active:scale-95 focus:outline-none"
              title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[#86868b]">Hola, <span className="text-white font-medium">{user.nombre}</span></span>
                <button
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 text-[#f5f5f7] px-3 py-1 rounded-full text-[11px] transition-colors border border-white/5"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-3 py-1 rounded-full text-[11px] font-medium transition-colors"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
}
