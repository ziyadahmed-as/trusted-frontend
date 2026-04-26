"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, Star, X, Filter, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/home/Hero";
import { FeatureSection } from "@/components/home/FeatureSection";
import { CategoryHighlights } from "@/components/home/CategoryHighlights";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Redirect Logic
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else if (
        (user.role === "VENDOR" || user.role === "DRIVER") &&
        !user.is_verified
      ) {
        router.push("/kyc");
      }
    }
  }, [user, authLoading, router]);

  const fetchInitialData = async () => {
    try {
      const cats = await apiClient.getCategories();
      setCategories(Array.isArray(cats) ? cats : cats.results || []);
      
      // Fetch specifically featured products for the landing section
      const featured = await apiClient.getPublicProducts({ is_featured: "true" });
      setFeaturedProducts((featured.results || featured).slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch initial home data", err);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategoryId) params.category = selectedCategoryId;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      // Handle Sorting
      if (sortBy === "price-low") params.ordering = "price";
      else if (sortBy === "price-high") params.ordering = "-price";
      else if (sortBy === "rating") params.ordering = "-average_rating";
      else if (sortBy === "newest") params.ordering = "-created_at";
      else if (sortBy === "featured") params.is_featured = "true";

      const data = await apiClient.getPublicProducts(params);
      setProducts(data.results || data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Features Section */}
      <FeatureSection />

      {/* 3. Category Highlights */}
      <CategoryHighlights />

      {/* 4. Featured Products Spotlight */}
      <section className="py-32 bg-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] italic">The Spotlight</h2>
              <h3 className="text-6xl font-black text-gray-900 tracking-tighter italic">
                Editor's <span className="text-gray-300">Picks.</span>
              </h3>
            </div>
            <Link href="#catalog" className="px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
               Discover All Products
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="featured" />
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[3rem] animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. Main Catalog Section */}
      <section id="catalog" className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          {/* Sidebar: Advanced Filters */}
          <aside className="w-full lg:w-72 space-y-12 shrink-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">Filters</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refine your search</p>
              </div>
              {(selectedCategoryId || minPrice || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categories</h3>
              <ul className="space-y-1">
                <li
                  onClick={() => setSelectedCategoryId(null)}
                  className={cn(
                    "text-sm font-bold cursor-pointer transition-all px-4 py-3 rounded-2xl border-2",
                    !selectedCategoryId
                      ? "bg-white border-indigo-600 text-indigo-600 shadow-xl shadow-indigo-100"
                      : "bg-transparent border-transparent text-gray-500 hover:bg-white/50 hover:text-gray-900",
                  )}
                >
                  All Departments
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id.toString())}
                    className={cn(
                      "text-sm font-bold cursor-pointer transition-all px-4 py-3 rounded-2xl border-2",
                      selectedCategoryId === cat.id.toString()
                        ? "bg-white border-indigo-600 text-indigo-600 shadow-xl shadow-indigo-100"
                        : "bg-transparent border-transparent text-gray-500 hover:bg-white/50 hover:text-gray-900",
                    )}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price Range</h3>
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-10 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-indigo-600 transition-all font-bold shadow-sm"
                  />
                </div>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-10 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-indigo-600 transition-all font-bold shadow-sm"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Catalog Main Content */}
          <div className="flex-1 space-y-12">
            {/* Sort & Stats Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-8 py-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="text-sm font-black text-gray-900 italic tracking-tight mb-4 sm:mb-0">
                {loading ? (
                  <span className="text-gray-300 animate-pulse uppercase text-[10px] tracking-widest font-black">
                    Refreshing Catalog...
                  </span>
                ) : (
                  <>
                    Catalog / <span className="text-indigo-600">{products.length} Items Found</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-100 px-8 py-3 rounded-2xl text-sm font-black text-gray-900 outline-none focus:border-indigo-600 cursor-pointer pr-12 italic"
                  >
                    <option value="featured">Featured First</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Avg. Customer Review</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>

            {/* Grid Display */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white rounded-[3rem] border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-40 flex flex-col items-center justify-center text-center bg-white rounded-[4rem] border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-8">
                  <X className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 italic tracking-tight mb-4">No results found</h3>
                <p className="text-gray-400 text-sm font-bold max-w-xs mb-10 italic">We couldn't find any products matching your specific filters. Try a different approach.</p>
                <button
                  onClick={clearFilters}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Newsletter / CTA */}
      <section className="py-40 bg-indigo-600 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[40%] h-full bg-white/5 skew-x-[-20deg] translate-x-20" />
         <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tighter italic leading-none">
               Join the <br />
               <span className="text-indigo-200">Inner Circle.</span>
            </h2>
            <p className="text-xl font-medium text-indigo-100 italic">
               Get exclusive access to early drops, verified vendor stories, and premium discounts.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
               <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-8 py-5 rounded-[2rem] bg-white text-gray-900 font-bold outline-none focus:ring-4 focus:ring-indigo-400 transition-all shadow-2xl"
               />
               <button className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white hover:text-indigo-600 transition-all active:scale-95 shadow-2xl">
                  Subscribe
               </button>
            </form>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">No spam. Just excellence. Unsubscribe anytime.</p>
         </div>
      </section>
    </main>
  );
}
  );
}
