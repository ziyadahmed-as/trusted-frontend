"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api-client";
import { ProductCard } from "@/components/ProductCard";
import { ChevronDown, Star, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect Admins and high-privilege roles if they land here
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
      // Verified Vendors/Drivers might want to see the shop, so we let them stay
      // or we could redirect them too if the user prefers.
      // For now, let's just make sure Admin goes to his dashboard.
    }
  }, [user, authLoading, router]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const fetchInitialData = async () => {
    try {
      const cats = await apiClient.getCategories();
      setCategories(Array.isArray(cats) ? cats : cats.results || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
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
    }, 300); // Debounce to prevent too many requests
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar: Advanced Filters */}
      <aside className="w-full md:w-72 bg-white md:border-r border-gray-200 p-6 flex-shrink-0 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Filter className="w-5 h-5" /> Filters
          </h2>
          {(selectedCategoryId || minPrice || maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Categories Section */}
        <section>
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">
            Categories
          </h3>
          <ul className="space-y-2">
            <li
              onClick={() => setSelectedCategoryId(null)}
              className={cn(
                "text-sm font-medium cursor-pointer transition-all px-3 py-2 rounded-lg",
                !selectedCategoryId
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              All Departments
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id.toString())}
                className={cn(
                  "text-sm font-medium cursor-pointer transition-all px-3 py-2 rounded-lg",
                  selectedCategoryId === cat.id.toString()
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Price Range Section */}
        <section>
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mb-4">
            Price Range
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                $
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
            <span className="text-gray-300">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                $
              </span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
          </div>
        </section>
      </aside>

      {/* Main Catalog Area */}
      <main className="flex-1 p-4 md:p-8">
        {/* Sort & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 mb-8 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-4 sm:mb-0">
            {loading ? (
              <span className="text-gray-400 animate-pulse">
                Running search...
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="text-indigo-600 italic">
                  1-{products.length}
                </span>{" "}
                of {products.length} products
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label
              htmlFor="sort-select"
              className="text-[10px] font-black uppercase tracking-widest text-gray-400"
            >
              Sort by
            </label>
            <div className="relative group">
              <select
                id="sort-select"
                title="Sort premium products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-100 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-700 outline-none focus:border-indigo-500 cursor-pointer pr-10 shadow-sm"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Customer Review</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white border text-card-foreground shadow-sm rounded-3xl animate-pulse aspect-square overflow-hidden"
              >
                <div className="w-full h-2/3 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 mb-6">
              <X className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 italic tracking-tight mb-2">
              No matches found
            </h3>
            <p className="text-gray-400 text-sm font-medium max-w-xs">
              We couldn't find any products matching your current filters. Try
              relaxing your constraints.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="compact"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
