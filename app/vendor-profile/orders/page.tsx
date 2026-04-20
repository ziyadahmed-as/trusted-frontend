'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  Package, 
  Clock, 
  Truck, 
  Loader2,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/admin/StatCard';

const statusStyles = {
  PENDING: "bg-[#f59e0b]/10 text-[#f59e0b]",
  PROCESSING: "bg-[#3c50e0]/10 text-[#3c50e0]",
  SHIPPED: "bg-[#3ba2b8]/10 text-[#3ba2b8]",
  DELIVERED: "bg-[#10b981]/10 text-[#10b981]",
  CANCELLED: "bg-[#d34053]/10 text-[#d34053]",
};

const statusFlow = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await apiClient.getVendorOrders();
      setOrders(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;
    
    const nextStatus = statusFlow[currentIndex + 1];
    setUpdatingId(orderId);
    try {
      await apiClient.updateOrderStatus(orderId, nextStatus);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black md:text-3xl">Order Fulfillment</h2>
          <p className="text-sm font-medium text-[#64748b]">Track and manage your customer orders.</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 2xl:gap-7.5">
        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <Clock className="w-6 h-6 text-[#f59e0b]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'PENDING').length}</h4>
              <span className="text-sm font-medium text-[#64748b]">Pending</span>
            </div>
          </div>
        </div>
        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <Loader2 className="w-6 h-6 text-[#3c50e0]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'PROCESSING').length}</h4>
              <span className="text-sm font-medium text-[#64748b]">In Processing</span>
            </div>
          </div>
        </div>
        <div className="rounded-sm border border-[#e2e8f0] bg-white py-6 px-7.5 shadow-sm">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc]">
            <Truck className="w-6 h-6 text-[#10b981]" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-bold text-black">{orders.filter(o => o.status === 'SHIPPED').length}</h4>
              <span className="text-sm font-medium text-[#64748b]">Dispatched</span>
            </div>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE PORTION */}
      <div className="rounded-sm border border-[#e2e8f0] bg-white px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left bg-[#f7f9fc]">
                <th className="py-4 px-4 font-medium text-black xl:pl-11">
                  Order ID
                </th>
                <th className="py-4 px-4 font-medium text-black">
                  Products
                </th>
                <th className="py-4 px-4 font-medium text-black">
                  Revenue
                </th>
                <th className="py-4 px-4 font-medium text-black">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black text-right xl:pr-11">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-10 text-center">
                     <p className="text-[#64748b] font-medium">No orders found.</p>
                   </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#f9fafb] transition">
                    <td className="py-5 px-4 pl-9 xl:pl-11">
                      <p className="font-medium text-black text-sm">#TR-{order.id.toString().padStart(6, '0')}</p>
                      <p className="text-sm text-[#64748b]">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="py-5 px-4 text-sm text-black">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                           {order.items?.slice(0, 2).map((item: any) => (
                             <span key={item.id} className="truncate">• {item.product_name} x{item.quantity}</span>
                           ))}
                           {order.items?.length > 2 && <span className="text-xs text-[#3c50e0] font-medium">+{order.items.length - 2} more items</span>}
                        </div>
                    </td>
                    <td className="py-5 px-4 font-medium text-black">
                       ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-5 px-4">
                       <span className={cn("inline-flex rounded-full px-3 py-1 text-sm font-medium", statusStyles[order.status as keyof typeof statusStyles] || statusStyles.PENDING)}>
                         {order.status}
                       </span>
                    </td>
                    <td className="py-5 px-4 pr-9 xl:pr-11 text-right">
                       <div className="flex items-center justify-end gap-3">
                         {statusFlow.indexOf(order.status) < statusFlow.length - 1 && (
                            <button 
                              onClick={() => handleStatusUpdate(order.id, order.status)}
                              disabled={updatingId === order.id}
                              className="inline-flex rounded bg-[#10b981] py-1 px-3 text-sm font-medium text-white hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Advance'}
                            </button>
                          )}
                          <button aria-label="More options" className="text-[#64748b] hover:text-black">
                             <MoreVertical className="w-5 h-5" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
