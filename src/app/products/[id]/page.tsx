import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product: any = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-16 transition-colors duration-300">
      
      {/* Back to store navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
        >
          &larr; Volver a la tienda
        </Link>
      </div>

      {/* Main product show details grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-white dark:bg-[#1c1c1e] rounded-3xl border border-gray-200/60 dark:border-white/10 p-8 md:p-12 shadow-sm transition-colors duration-300">
        
        {/* Left Column: Image Preview */}
        <div className="md:col-span-7 bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-2xl aspect-square relative flex items-center justify-center p-8 overflow-hidden border border-gray-100/50 dark:border-white/5 transition-colors duration-300">
          {product.ImageUrl ? (
            <img
              src={product.ImageUrl}
              alt={product.nombre}
              className="object-contain max-h-[90%] max-w-[90%] transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-3xl">
              📦
            </div>
          )}
        </div>

        {/* Right Column: Order Panel */}
        <div className="md:col-span-5 flex flex-col justify-center">
          
          {product.categoria && (
            <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-2">
              {product.categoria.nombre}
            </span>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-3 leading-tight">
            {product.nombre}
          </h1>

          <div className="text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
            S/ {parseFloat(product.precio).toFixed(2)}
          </div>

          <div className="border-t border-b border-gray-100 dark:border-white/5 py-6 mb-6">
            <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Descripción del Producto
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-normal text-sm">
              {product.descripcion || 'Este producto no cuenta con una descripción detallada en este momento.'}
            </p>
          </div>

          {/* Call to action buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3.5 rounded-full text-sm transition-colors shadow-sm focus:outline-none">
              Añadir a la bolsa
            </button>
            <button className="w-full bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-medium py-3.5 rounded-full text-sm transition-colors focus:outline-none">
              Pagar con Tarjeta
            </button>
          </div>

          <div className="text-center text-xs text-gray-400 dark:text-gray-500">
            ID de producto: <span className="font-mono">{product.id}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
