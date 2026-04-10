'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Star,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';
import { ProductCard } from '@/components/ProductCard';
import { cn } from '@/lib/utils';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  
  const exploreRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featured, topRated, all] = await Promise.all([
        apiClient.getPublicProducts({ featured: 'true' }),
        apiClient.getPublicProducts({ ordering: '-average_rating' }),
        apiClient.getPublicProducts()
      ]);
      
      setFeaturedProducts(featured.results || featured);
      setTopRatedProducts((topRated.results || topRated).slice(0, 4));
      setAllProducts(all.results || all);
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const results = await apiClient.getPublicProducts({ search: searchQuery });
      setSearchResults(results.results || results);
      // Scroll to explore section if not already visible
      exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 italic">Trest<span className="text-indigo-600">Biyyo.</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            <a href="#featured" className="hover:text-indigo-600 transition-colors">Featured</a>
            <a href="#top-rated" className="hover:text-indigo-600 transition-colors">Top Sellers</a>
            <a href="#explore" className="hover:text-indigo-600 transition-colors">Explore</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 px-4 py-2 transition-colors">Login</Link>
            <Link href="/register" className="px-8 py-3.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* HERO LAYER */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-50 rounded-full blur-[150px] opacity-40 animate-bounce-slow" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-white/50 border border-gray-100 backdrop-blur-sm rounded-full shadow-xl shadow-black/5"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">The Future of Multi-Vendor Commerce</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl md:text-9xl font-black tracking-tight leading-[0.85] text-gray-900 italic"
            >
              Shop <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-indigo-400">Better.</span><br />
              <span className="not-italic">Sell <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-800">Smarter.</span></span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Join the world's most elegant multi-vendor marketplace. Premium products from verified sellers, delivered with excellence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-2xl mx-auto pt-8"
            >
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-rose-400 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative flex items-center bg-white border border-gray-100 rounded-[2rem] p-2 pr-4 shadow-2xl shadow-indigo-100/20">
                  <div className="pl-6 text-gray-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for premium products..."
                    className="flex-1 px-6 py-5 bg-transparent outline-none text-lg font-bold placeholder:text-gray-300"
                  />
                  <button 
                    type="submit"
                    className="px-10 py-5 bg-gray-900 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 flex items-center gap-3 active:scale-95"
                  >
                    Find Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* LAYER 1: FEATURED SELECTION */}
        <section id="featured" className="py-32 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 italic">Curated Excellence</h2>
                </div>
                <h3 className="text-5xl font-black text-gray-900 tracking-tighter">Featured <span className="text-gray-400">Selection</span></h3>
              </div>
              <p className="max-w-md text-gray-400 font-bold mb-1">
                Hand-picked products that define the TrestBiyyo lifestyle. Quality, aesthetics, and reliability in every detail.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2].map(i => (
                  <div key={i} className="aspect-[4/3] bg-gray-100 rounded-[3.5rem] animate-pulse" />
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {featuredProducts.slice(0, 2).map((product) => (
                  <ProductCard key={product.id} product={product} variant="featured" />
                ))}
              </div>
            ) : (
              <div className="py-20 bg-white rounded-[4rem] border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mb-6">
                  <Sparkles className="w-10 h-10" />
                </div>
                <p className="text-gray-400 font-bold max-w-xs uppercase tracking-widest text-[10px]">No featured items this week. Check back soon for our new collection.</p>
              </div>
            )}
          </div>
        </section>

        {/* LAYER 2: TOP RATED */}
        <section id="top-rated" className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">
                <Star className="w-3 h-3 fill-amber-500" /> Customer Favorites
              </div>
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Top Rated <span className="text-indigo-600">Performance</span></h2>
              <p className="text-gray-400 font-bold italic">Highest rated products by our vibrant community.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-[2.5rem] animate-pulse" />
                ))
              ) : topRatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* LAYER 3: EXPLORE & SEARCH */}
        <section id="explore" ref={exploreRef} className="py-32 bg-gray-900 rounded-t-[5rem] lg:rounded-t-[8rem] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-24">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-indigo-400 mb-4 italic">Full Collection</h2>
                <h3 className="text-6xl font-black tracking-tighter transition-all hover:tracking-normal duration-700">Explore <span className="opacity-30">Everything.</span></h3>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10 text-xs font-black uppercase tracking-widest">
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <div className="hidden sm:block h-12 w-px bg-white/10 mx-2" />
                <p className="text-gray-400 font-bold italic text-sm">Showing {searchResults ? searchResults.length : allProducts.length} unique results</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {searching ? (
                <motion.div 
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-20"
                >
                  {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-white/10 rounded-[2.5rem] animate-pulse" />)}
                </motion.div>
              ) : (
                <motion.div 
                  key={searchResults ? "search" : "all"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {searchResults && (
                    <div className="mb-12 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-bold">Search results for:</span>
                        <span className="px-4 py-1.5 bg-indigo-600 rounded-lg font-black italic">"{searchQuery}"</span>
                        <button 
                          onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {((searchResults || allProducts).length === 0) ? (
                    <div className="py-40 text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-white/10 mx-auto mb-8">
                        <Search className="w-12 h-12" />
                      </div>
                      <h4 className="text-2xl font-black italic mb-2">No items found</h4>
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Try a different search term or browse categories</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {(searchResults || allProducts).map((product) => (
                        <div key={product.id} className="invert">
                           <ProductCard product={product} variant="compact" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-32 pt-20 border-t border-white/5 text-center">
              <Link href="/register" className="group inline-flex items-center gap-6">
                <span className="text-5xl lg:text-7xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors italic">Join TrestBiyyo.</span>
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-2xl shadow-indigo-500/20">
                  <ArrowRight className="w-10 h-10" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-white/5 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-2xl font-black tracking-tighter text-white italic mb-8">Trest<span className="text-indigo-400">Biyyo.</span></div>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mb-12">Building the Multi-Vendor Empire of Tomorrow</p>
          <div className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            &copy; 2026 TrestBiyyo. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

