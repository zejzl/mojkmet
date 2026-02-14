'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Farm {
  id: string;
  name: string;
  description: string;
  city: string;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  available: boolean;
}

export default function FarmDetailPage() {
  const params = useParams();
  const farmId = params?.id as string;
  
  const [farm, setFarm] = useState<Farm | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFarmDetails() {
      try {
        const response = await fetch(`/api/farms/${farmId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Kmetija ni najdena');
          }
          throw new Error('Napaka pri nalaganju podatkov');
        }
        const data = await response.json();
        setFarm(data.farm);
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Neznana napaka');
      } finally {
        setLoading(false);
      }
    }
    
    if (farmId) {
      fetchFarmDetails();
    }
  }, [farmId]);

  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Nalaganje...</p>
        </div>
      </main>
    );
  }

  if (error || !farm) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Kmetija ni najdena'}
          </h1>
          <Link
            href="/farms"
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            ← Nazaj na vse kmetije
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      {/* Farm Header */}
      <section className="bg-gradient-to-br from-green-50 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/farms"
            className="text-green-600 hover:text-green-700 font-semibold mb-4 inline-block"
          >
            ← Nazaj na vse kmetije
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {farm.name}
                </h1>
                {farm.is_verified && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    ✓ Verificirano
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-amber-500">
                  <span className="mr-1">⭐</span>
                  <span className="font-semibold text-lg">{Number(farm.rating).toFixed(1)}</span>
                  <span className="text-gray-600 ml-2">
                    ({farm.total_reviews} {farm.total_reviews === 1 ? 'ocena' : 'ocen'})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700 mb-6">
                <span className="mr-2">📍</span>
                <span className="text-lg">{farm.city}</span>
              </div>
              
              {farm.description && (
                <p className="text-gray-700 text-lg leading-relaxed">
                  {farm.description}
                </p>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-green-200 to-amber-200 rounded-2xl h-64 md:h-96 flex items-center justify-center text-8xl">
              🏡
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Proizvodi ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">
                Ta kmetija trenutno nima dodanih proizvodov.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border ${
                    product.available ? 'border-gray-200' : 'border-gray-300 opacity-75'
                  }`}
                >
                  <div className="bg-gradient-to-br from-green-100 to-amber-100 h-40 flex items-center justify-center text-6xl relative">
                    {product.category === 'mleko' && '🥛'}
                    {product.category === 'jajca' && '🥚'}
                    {product.category === 'zelenjava' && '🥬'}
                    {product.category === 'meso' && '🥩'}
                    {product.category === 'med' && '🍯'}
                    {!['mleko', 'jajca', 'zelenjava', 'meso', 'med'].includes(product.category) && '🌾'}
                    
                    {!product.available && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white px-4 py-2 rounded-full text-sm font-semibold text-gray-700">
                          Ni na voljo
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {product.name}
                      </h3>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                    
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          €{product.price.toFixed(2)}
                        </span>
                        <span className="text-gray-600 text-sm ml-1">
                          / {product.unit}
                        </span>
                      </div>
                      
                      {product.available && (
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                          Dodaj
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Želite naročiti?
          </h2>
          <p className="text-gray-600 mb-6">
            Stopite v stik s kmetijo in naročite sveže pridelke
          </p>
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-semibold">
            Kontaktiraj kmetijo
          </button>
        </div>
      </section>
    </main>
  );
}
