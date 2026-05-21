"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Archive,
  Package,
  Edit,
  Trash2,
  Eye,
  XCircle,
  Tag,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

export default function VendorProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [prodsData, catsData, meData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
        apiClient.getMe(),
      ]);
      const rawProducts = prodsData.results || prodsData;
      const vendorProducts = rawProducts.filter(
        (p: any) => p.vendor === meData.email,
      );
      setProducts(vendorProducts);
      setCategories(catsData.results || catsData);
      setUser(meData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const payload = {
        name: formData.name,
        slug: slug || `prod-${Date.now()}`,
        category: formData.category ? parseInt(formData.category, 10) : null,
        price: parseFloat(formData.price) || 0.0,
        stock: parseInt(formData.stock, 10) || 0,
        description: formData.description,
        is_active: true,
        is_digital: false,
      };

      await apiClient.createProduct(payload);
      setShowModal(false);
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
      });
      fetchData(); // reload products
    } catch (err: any) {
      console.error(err);
      let errorMessage =
        "Failed to add product. Make sure all fields are correct.";
      if (err.errors && err.errors.detail) {
        errorMessage = err.errors.detail;
      } else if (err.errors && typeof err.errors === "object") {
        const firstErrorKey = Object.keys(err.errors)[0];
        if (Array.isArray(err.errors[firstErrorKey])) {
          errorMessage = err.errors[firstErrorKey][0];
        }
      }
      alert(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.deleteProduct(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete product.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto px-4 mt-6 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Products Dashboard
          </h2>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            Manage your store inventory, pricing, and visibility.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md bg-red-600 py-2.5 px-4 font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* PRODUCTS TABLE PORTION */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-200">
                <th className="min-w-[220px] py-4 px-6 font-bold text-gray-900">
                  Product Info
                </th>
                <th className="min-w-[150px] py-4 px-6 font-bold text-gray-900">
                  Category
                </th>
                <th className="min-w-[120px] py-4 px-6 font-bold text-gray-900">
                  Price
                </th>
                <th className="min-w-[120px] py-4 px-6 font-bold text-gray-900">
                  Stock
                </th>
                <th className="py-4 px-6 font-bold text-gray-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center bg-white">
                    <p className="text-gray-500 font-medium">
                      No products found. Add your first product to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-md bg-gray-100 border border-gray-200">
                          <Archive className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                          <h5 className="font-bold text-gray-900">
                            {prod.name}
                          </h5>
                          <p className="text-xs text-gray-500 mt-0.5">{prod.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700 font-semibold">
                        {prod.category
                          ? categories.find((c) => c.id === prod.category)
                              ?.name || `ID: ${prod.category}`
                          : "Uncategorized"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900">
                        ${parseFloat(prod.price).toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2.5 py-1 text-xs font-bold",
                          prod.stock > 10
                            ? "bg-green-100 text-green-700"
                            : prod.stock > 0
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700",
                        )}
                      >
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/product/${prod.id}`}
                          title="View Store"
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        {prod.vendor === user?.email && (
                          <>
                            <button
                              title="Edit"
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              title="Delete"
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl">
            <div className="border-b border-gray-100 py-4 px-6 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="font-bold text-gray-900 text-lg">Add New Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
                title="Close"
                aria-label="Close Modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form
              id="product-form"
              onSubmit={handleAddProduct}
              className="p-6 space-y-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Wireless Headphones"
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all"
                />
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="category"
                    title="Select Category"
                    aria-label="Select Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all"
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Initial Stock <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all"
                />
              </div>
              <div className="mb-2">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detailed product description..."
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-900 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={modalLoading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-red-600 py-2.5 font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {modalLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
