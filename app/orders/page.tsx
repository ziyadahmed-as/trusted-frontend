"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  ShoppingBag,
  Package,
  ChevronRight,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const statusStyles = {
  PENDING: "bg-orange-50 text-orange-600 border-orange-100",
  PROCESSING: "bg-blue-50 text-blue-600 border-blue-100",
  SHIPPED: "bg-purple-50 text-purple-600 border-purple-100",
  DELIVERED: "bg-green-50 text-green-600 border-green-100",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

function OrderHistoryContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const showConfirmed = searchParams.get("confirmed") === "true";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.getOrders();
        setOrders(data.results || data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                My Orders
              </h1>
              {showConfirmed && (
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Order Confirmed!
                </div>
              )}
            </div>

            <div className="w-full max-w-sm relative">
              <input
                type="text"
                placeholder="Search by order ID or item..."
                className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-full text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-white rounded-lg animate-pulse border border-gray-200 shadow-sm"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-16 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Looks like you haven't made any purchases yet.
            </p>
            <Link
              href="/"
              className="px-6 py-2 bg-red-600 text-white rounded-md font-bold text-sm hover:bg-red-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4 text-sm">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-gray-500 mr-2">Order ID:</span>
                      <span className="font-bold text-gray-900">
                        {order.id.toString().padStart(8, "0")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-2">Order Date:</span>
                      <span className="font-bold text-gray-900">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "px-2.5 py-0.5 rounded text-xs font-bold border",
                        statusStyles[
                          order.status as keyof typeof statusStyles
                        ] || statusStyles.PENDING,
                      )}
                    >
                      {order.status?.replace("_", " ")}
                    </div>
                    <div className="font-bold text-gray-900">
                      Total: ${parseFloat(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.items?.slice(0, 3).map((item: any) => (
                        <div
                          key={item.id}
                          className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold"
                        >
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <div className="w-12 h-12 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {order.items?.length || 0} item(s) in this order
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {order.status === "DELIVERED" && (
                      <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors">
                        Leave Review
                      </button>
                    )}
                    <Link
                      href={`/orders/${order.id}`}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Order Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OrderHistoryContent />
    </Suspense>
  );
}
