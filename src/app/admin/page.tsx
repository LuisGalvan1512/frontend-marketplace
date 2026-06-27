'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Category {
  id: number;
  nombre: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    ImageUrl: '',
    CategoryId: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('user_role');

    // Route guard double check
    if (!token || role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`)
      ]);

      const prodData: ApiResponse<Product[]> = await prodRes.json();
      const catData: ApiResponse<Category[]> = await catRes.json();

      if (prodData.success) setProducts(prodData.data);
      if (catData.success) setCategories(catData.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          descripcion: formData.descripcion || undefined,
          ImageUrl: formData.ImageUrl || undefined,
          CategoryId: formData.CategoryId ? parseInt(formData.CategoryId) : undefined
        }),
      });

      if (res.ok) {
        setFormData({ nombre: '', precio: '', descripcion: '', ImageUrl: '', CategoryId: '' });
        setEditingId(null);
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      ImageUrl: product.ImageUrl || '',
      CategoryId: product.CategoryId ? product.CategoryId.toString() : ''
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    const token = Cookies.get('token');

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Error al eliminar el producto.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', precio: '', descripcion: '', ImageUrl: '', CategoryId: '' });
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="max-w-[1024px] mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-12 transition-colors duration-300">
      
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          Panel de Administración
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gestiona el catálogo de productos de la tienda</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200/70 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laptop Dell XPS"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                    Precio (S/)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="999.00"
                    value={formData.precio}
                    onChange={(e) =>
                      setFormData({ ...formData, precio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={formData.CategoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, CategoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm transition-colors"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={formData.ImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, ImageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe el producto..."
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#2c2c2e] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 text-sm transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0071e3] hover:bg-[#0077ed] text-white py-2 rounded-full text-xs font-medium transition-colors focus:outline-none"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors focus:outline-none"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table Column */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#1c1c1e] border border-gray-200/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f5f5f7] dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] uppercase tracking-wider transition-colors duration-300">
                  <tr>
                    <th className="px-6 py-4">Imagen</th>
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {products.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-[#2c2c2e] rounded-lg border border-gray-100 dark:border-white/5 flex items-center justify-center overflow-hidden transition-colors">
                          {product.ImageUrl ? (
                            <img src={product.ImageUrl} alt={product.nombre} className="object-contain max-w-[90%] max-h-[90%]" />
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">📦</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{product.nombre}</div>
                        {product.categoria && (
                          <div className="text-[10px] font-semibold text-blue-500 dark:text-blue-400 mt-0.5 uppercase tracking-wider">{product.categoria.nombre}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        S/ {parseFloat(product.precio).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 dark:text-blue-400 hover:underline mr-4 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 dark:text-red-400 hover:underline font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
