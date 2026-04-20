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
        <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">
            Products Dashboard
          </h2>
          <p className="text-sm font-medium text-[#64748b]">
            Manage your store inventory, pricing, and visibility.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded bg-[#10b981] py-2 px-4 font-medium text-white hover:bg-opacity-90 transition"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* PRODUCTS TABLE PORTION */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left bg-[#f7f9fc]">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black xl:pl-11">
                  Product Info
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black">
                  Category
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Price
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black">
                  Stock
                </th>
                <th className="py-4 px-4 font-medium text-black text-right xl:pr-11">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <p className="text-[#64748b] font-medium">
                      No products found. Add your first product to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f9fafb] transition"
                  >
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#f7f9fc]">
                          <Archive className="w-5 h-5 text-[#10b981]" />
                        </div>
                        <div>
                          <h5 className="font-medium text-black">
                            {prod.name}
                          </h5>
                          <p className="text-sm text-[#64748b]">{prod.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black">
                        {prod.category
                          ? categories.find((c) => c.id === prod.category)
                              ?.name || `ID: ${prod.category}`
                          : "Uncategorized"}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-black">
                        ${parseFloat(prod.price).toFixed(2)}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <p
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                          prod.stock > 10
                            ? "bg-[#10b981]/10 text-[#10b981]"
                            : prod.stock > 0
                              ? "bg-[#f59e0b]/10 text-[#f59e0b]"
                              : "bg-[#d34053]/10 text-[#d34053]",
                        )}
                      >
                        {prod.stock} in stock
                      </p>
                    </td>
                    <td className="py-5 px-4 pr-9 xl:pr-11 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          title="View Store"
                          className="text-[#64748b] hover:text-[#10b981] transition"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {prod.vendor === user?.email && (
                          <>
                            <button
                              title="Edit"
                              className="text-[#64748b] hover:text-[#3c50e0] transition"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id)}
                              title="Delete"
                              className="text-[#64748b] hover:text-[#d34053] transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-sm border border-[#e2e8f0] bg-white shadow-default">
            <div className="border-b border-[#e2e8f0] py-4 px-6.5 flex justify-between items-center">
              <h3 className="font-semibold text-black">Add New Product</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#64748b] hover:text-black"
                title="Close"
                aria-label="Close Modal"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form
              id="product-form"
              onSubmit={handleAddProduct}
              className="p-6.5"
            >
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black">
                  Product Name <span className="text-[#d34053]">*</span>
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Wireless Headphones"
                  className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#10b981] active:border-[#10b981]"
                />
              </div>
              <div className="mb-4.5 flex flex-col gap-4.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label className="mb-2.5 block text-black">
                    Category <span className="text-[#d34053]">*</span>
                  </label>
                  <select
                    required
                    name="category"
                    title="Select Category"
                    aria-label="Select Category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#10b981] active:border-[#10b981]"
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
                  <label className="mb-2.5 block text-black">
                    Price ($) <span className="text-[#d34053]">*</span>
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
                    className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#10b981] active:border-[#10b981]"
                  />
                </div>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black">
                  Initial Stock <span className="text-[#d34053]">*</span>
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#10b981] active:border-[#10b981]"
                />
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block text-black">
                  Description <span className="text-[#d34053]">*</span>
                </label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detailed product description..."
                  className="w-full rounded border border-[#e2e8f0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#10b981] active:border-[#10b981] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={modalLoading}
                className="flex w-full justify-center rounded bg-[#10b981] p-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 transition"
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
