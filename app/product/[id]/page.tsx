"use client";

import React, { useState, useEffect, use } from "react";
import {
  Star,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  ShieldCheck,
  Tag,
  Warehouse,
  Send,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { ProductGallery } from "@/components/product/ProductGallery";
import { BuyBox } from "@/components/product/BuyBox";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("The product you are looking for could not be found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    setReviewError(null);

    try {
      await apiClient.postProductReview({
        product: product.id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment("");
      setReviewRating(5);
      await fetchProduct();
    } catch (err: any) {
      console.error(err);
      setReviewError(
        err.errors?.detail ||
          err.errors?.[0] ||
          "Failed to post review. You may have already reviewed this product.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-500 font-medium mb-8">
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-md font-bold hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">
              {product.category_name}
            </span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              aria-label="Share Product"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              aria-label="Add to Wishlist"
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* LEFT: GALLERY */}
            <div className="lg:col-span-5 xl:col-span-4 p-6">
              <ProductGallery images={product.images} />
            </div>

            {/* MIDDLE: DETAILS */}
            <div className="lg:col-span-4 xl:col-span-5 p-6 flex flex-col gap-6">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-snug mb-3">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-orange-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-gray-900">
                      {parseFloat(product.average_rating || 0).toFixed(1)}
                    </span>
                    <span className="text-gray-500 underline ml-1 cursor-pointer hover:text-orange-600">
                      {product.total_reviews || 0} Reviews
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <span className="text-green-600 font-bold">100+ sold</span>
                </div>
              </div>

              {/* Price section for mobile (hidden on desktop because BuyBox has it) */}
              <div className="lg:hidden border-t border-gray-100 pt-4">
                <BuyBox product={product} />
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {/* Vendor Info */}
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sold by</p>
                      <p className="text-sm font-bold text-gray-900">
                        {product.vendor || "Authorized Retailer"}
                      </p>
                    </div>
                  </div>
                  {product.vendor_id && (
                    <Link
                      href={`/vendor-profile/${product.vendor_id}`}
                      className="text-sm font-bold text-red-600 hover:underline"
                    >
                      Visit Store
                    </Link>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    Buyer Protection
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
                    <Tag className="w-4 h-4 text-red-500" />
                    Best Price Guarantee
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: BUY BOX */}
            <div className="hidden lg:block lg:col-span-3 p-6 bg-gray-50/50">
              <BuyBox product={product} />
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
            Customer Reviews ({product.total_reviews || 0})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 border-r border-gray-100 pr-8">
               <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-black text-gray-900">
                     {parseFloat(product.average_rating || 0).toFixed(1)}
                  </span>
                  <div className="flex flex-col">
                     <div className="flex text-orange-500 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                           <Star key={s} className={cn("w-4 h-4", s <= Math.round(product.average_rating || 0) ? "fill-current" : "opacity-30")} />
                        ))}
                     </div>
                     <span className="text-xs text-gray-500">
                        Based on {product.total_reviews || 0} reviews
                     </span>
                  </div>
               </div>

               {user ? (
                 <div className="mt-8 border-t border-gray-100 pt-6">
                   <h4 className="text-sm font-bold text-gray-900 mb-4">
                     Write a review
                   </h4>
                   <form onSubmit={handleReviewSubmit} className="space-y-4">
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">Your Rating</label>
                       <div className="flex text-orange-400 gap-1">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <button
                             key={s}
                             type="button"
                             onClick={() => setReviewRating(s)}
                             className="focus:outline-none hover:scale-110 transition-transform"
                           >
                             <Star
                               className={cn(
                                 "w-6 h-6",
                                 s <= reviewRating
                                   ? "fill-current text-orange-500"
                                   : "text-gray-300",
                               )}
                             />
                           </button>
                         ))}
                       </div>
                     </div>
                     <div>
                       <textarea
                         required
                         value={reviewComment}
                         onChange={(e) => setReviewComment(e.target.value)}
                         placeholder="What did you like or dislike?"
                         className="w-full bg-white border border-gray-300 rounded-md p-3 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none h-24"
                       />
                     </div>
                     {reviewError && (
                       <p className="text-xs font-semibold text-red-500">
                         {reviewError}
                       </p>
                     )}
                     <button
                       type="submit"
                       disabled={submittingReview}
                       className="w-full py-2 bg-red-600 text-white rounded-md font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       {submittingReview ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         "Submit Review"
                       )}
                     </button>
                   </form>
                 </div>
               ) : (
                 <div className="mt-8 border-t border-gray-100 pt-6">
                   <p className="text-sm text-gray-600 mb-4">
                     Please sign in to write a review.
                   </p>
                   <Link
                     href="/login"
                     className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-bold hover:bg-gray-800 transition-colors"
                   >
                     Sign In
                   </Link>
                 </div>
               )}
            </div>

            <div className="lg:col-span-2 space-y-6">
               {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any) => (
                     <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="flex text-orange-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                 <Star
                                    key={s}
                                    className={cn(
                                       "w-3 h-3",
                                       s <= review.rating ? "fill-current" : "opacity-20",
                                    )}
                                 />
                              ))}
                           </div>
                           <span className="text-xs font-bold text-gray-900">
                              {review.user || "Verified Buyer"}
                           </span>
                           {review.is_verified_purchase && (
                              <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                                 Verified Purchase
                              </span>
                           )}
                           <span className="text-xs text-gray-400 ml-auto">
                              {new Date(review.created_at).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                           {review.comment}
                        </p>
                     </div>
                  ))
               ) : (
                  <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                     <MessageCircle className="w-10 h-10 text-gray-300 mb-3" />
                     <p className="text-sm font-semibold">No reviews yet.</p>
                     <p className="text-xs">Be the first to review this product!</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
