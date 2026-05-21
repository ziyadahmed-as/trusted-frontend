"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import { ChevronRight, Flame, Clock, Zap, LayoutGrid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if ((user.role === "VENDOR" || user.role === "DRIVER") && !user.is_verified) {
        router.push("/kyc");
      }
    }
  }, [user, authLoading, router]);

  const fetchInitialData = async () => {
    try {
      const cats = await apiClient.getCategories();
      setCategories(Array.isArray(cats) ? cats : cats.results || []);

      const featured = await apiClient.getPublicProducts({ is_featured: "true" });
      setFeaturedProducts((featured.results || featured).slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch initial home data", err);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { ordering: "-created_at" };
      if (activeCategory) params.category = activeCategory;

      const data = await apiClient.getPublicProducts(params);
      setProducts(data.results || data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="min-h-screen bg-[#f2f2f2] pb-20">
      {/* Top Categories Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-6 whitespace-nowrap h-12">
          <button 
            onClick={() => setActiveCategory(null)}
            className={cn("text-sm font-semibold transition-colors border-b-2 h-full flex items-center px-1", 
              !activeCategory ? "border-red-500 text-red-500" : "border-transparent text-gray-700 hover:text-red-500"
            )}
          >
            Recommended
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id.toString())}
              className={cn("text-sm font-semibold transition-colors border-b-2 h-full flex items-center px-1", 
                activeCategory === cat.id.toString() ? "border-red-500 text-red-500" : "border-transparent text-gray-700 hover:text-red-500"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 mt-4 space-y-4">
        
        {/* Banner Section (AliExpress Style) */}
        {!activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[360px]">
            <div className="hidden md:flex flex-col bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                <LayoutGrid className="w-5 h-5 text-red-500" />
                Categories
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id.toString())} className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors flex items-center justify-between group">
                    {cat.name}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-3 rounded-xl overflow-hidden relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-green-200 to-green-300"></div>
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
              <div className="relative h-full flex flex-col justify-center px-10 md:px-16 text-white w-full md:w-2/3">
                <span className="inline-block px-3 py-1 bg-yellow-400 text-red-900 font-bold text-xs uppercase rounded-full w-max mb-4 shadow-sm tracking-wider">
                  Super Deals
                </span>
                <h1 className="text-4xl md:text-6xl font-black mb-2 leading-tight uppercase tracking-tight">Mega <br/>Sale</h1>
                <div className="flex items-center gap-2 mb-8">
                  <span className="bg-black/20 px-3 py-1.5 rounded-lg font-bold text-sm backdrop-blur-sm">Up to 70% Off</span>
                  <span className="bg-black/20 px-3 py-1.5 rounded-lg font-bold text-sm backdrop-blur-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Ends in 02:45:10
                  </span>
                </div>
                <button className="bg-white text-red-600 px-8 py-3.5 rounded-full font-bold w-max shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2">
                  Shop Now <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        )}

        {/* Flash Deals / Featured */}
        {!activeCategory && featuredProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white p-2 rounded-lg">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    SuperDeals
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-bold">Top Products</span>
                  </h2>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredProducts.map(p => (
                <Link href={`/product/${p.id}`} key={p.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> HOT
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-300 bg-gray-100">
                       <LayoutGrid className="w-12 h-12 opacity-20" />
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="text-red-600 font-bold text-lg leading-none mb-1">
                      ${parseFloat(p.price).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 line-through mb-1">
                      ${(parseFloat(p.price) * 1.5).toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More to Love / All Products */}
        <div className="pt-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gray-300 flex-1 max-w-[100px]"></div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">More to love</h2>
            <div className="h-px bg-gray-300 flex-1 max-w-[100px]"></div>
          </div>

          {loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="aspect-square bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse" />
               ))}
             </div>
          ) : products.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {products.map(product => (
                <Link href={`/product/${product.id}`} key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col group hover:border-red-500">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 bg-gray-100">
                      <LayoutGrid className="w-12 h-12 text-gray-300 opacity-50" />
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-[13px] text-gray-700 line-clamp-2 leading-tight mb-2 group-hover:text-red-500 transition-colors h-9">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-gray-900">$</span>
                        <span className="text-lg font-black text-gray-900">{parseFloat(product.price).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-400">
                          {product.stock > 0 ? `${product.stock} sold` : 'Out of stock'}
                        </span>
                        <span className="text-[10px] bg-red-50 text-red-500 font-bold px-1.5 py-0.5 rounded">Free Shipping</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
