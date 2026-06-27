'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Category {
  id: number;
  nombre: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // null means "All"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p: any) => p.CategoryId === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="max-w-[1024px] mx-auto px-6 py-24 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-16 transition-colors duration-300">
      
      {/* Premium Apple-Style Generic Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
          <span className="text-gray-500 dark:text-gray-400 font-normal">TechStore.</span> Lo mejor de la tecnología, seleccionado para ti.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-3 font-normal">
          Rendimiento avanzado. Conectividad sin límites.
        </p>
      </header>

      {/* Category Pills (Support Light/Dark Mode) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]'
              : 'bg-white text-[#1d1d1f] dark:bg-[#1c1c1e] dark:text-[#f5f5f7] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          Todos los productos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-[#1d1d1f] text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]'
                : 'bg-white text-[#1d1d1f] dark:bg-[#1c1c1e] dark:text-[#f5f5f7] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {category.nombre}
          </button>
        ))}
      </div>

      {/* Products Grid (Support Light/Dark Mode) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1c1c1e] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No hay productos disponibles en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white dark:bg-[#1c1c1e] border border-gray-200/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="w-full bg-[#f5f5f7] dark:bg-[#2c2c2e] aspect-square relative flex items-center justify-center overflow-hidden p-6 border-b border-gray-100 dark:border-white/5 transition-colors duration-300">
                {product.ImageUrl ? (
                  <img
                    src={product.ImageUrl}
                    alt={product.nombre}
                    className="object-contain max-h-[85%] max-w-[85%] transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-3xl">
                    📦
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1">
                {product.categoria && (
                  <span className="text-[10px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1.5">
                    {product.categoria.nombre}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                  {product.nombre}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal line-clamp-2 mb-4 leading-relaxed flex-1">
                  {product.descripcion || 'Sin descripción adicional.'}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/5">
                  <span className="text-xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7]">
                    S/ {parseFloat(product.precio).toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1">
                    Comprar &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
