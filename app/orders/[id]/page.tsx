"use client";

import React, { useState, useEffect, use } from "react";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusSteps = [
  { id: "PENDING", label: "Order Confirmed", icon: CheckCircle2 },
  { id: "PROCESSING", label: "Processing", icon: Clock },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: Package },
];

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiClient.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Could not retrieve order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            {error}
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.id === order.status,
  );
  const finalIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link
              href="/orders"
              className="hover:text-red-600 transition-colors"
            >
              My Orders
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">
              Order #TR-{order.id.toString().padStart(8, "0")}
            </span>
          </div>
          <button className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-bold hover:bg-gray-50 transition-colors">
            Support
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tracking Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Status
                  </h2>
                  <p className="text-sm text-gray-500">
                    Track the progress of your package
                  </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">
                      Estimated Arrival
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {order.estimated_delivery_date
                        ? new Date(order.estimated_delivery_date).toLocaleDateString()
                        : "TBD"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Visual */}
              <div className="relative pt-6 pb-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0">
                  <div
                    className={cn(
                      "h-full bg-red-500 transition-all duration-1000",
                      finalIndex === 0 && "w-0",
                      finalIndex === 1 && "w-1/3",
                      finalIndex === 2 && "w-2/3",
                      finalIndex === 3 && "w-full",
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= finalIndex;
                    const isCurrent = idx === finalIndex;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center text-center space-y-3 bg-white px-2 py-1"
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-white",
                            isCompleted
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-400",
                          )}
                        >
                          <step.icon
                            className={cn(
                              "w-5 h-5",
                              isCurrent && "animate-pulse",
                            )}
                          />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-xs font-bold",
                              isCompleted ? "text-gray-900" : "text-gray-400",
                            )}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-[10px] font-bold text-red-500 uppercase mt-0.5">
                              Current
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Package Contents
                </h3>
              </div>
              <div className="divide-y divide-gray-100 p-6">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex gap-4"
                  >
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-400 font-bold">
                      {item.product_name?.[0] || "P"}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 pr-4">
                          {item.product_name}
                        </h4>
                        <p className="text-base font-bold text-gray-900">
                          ${parseFloat(item.price_at_purchase).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="font-semibold text-gray-700">
                          Qty: {item.quantity}
                        </div>
                        <p>
                          SKU: TR-PROD-{item.product}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Purchase Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Order Summary
              </h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Total Items</span>
                  <span className="font-semibold text-gray-900">
                    {order.items?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-semibold text-gray-900">
                    {order.payment_gateway}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-900">
                  Total Paid
                </span>
                <span className="text-2xl font-black text-red-600">
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    User Address Point (Saved Address)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Payment Security
                  </h3>
                  <p className="text-sm text-gray-600">
                    Encrypted transaction verified via {order.payment_gateway}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-md text-sm font-bold text-gray-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
