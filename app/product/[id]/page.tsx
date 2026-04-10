'use client';

import React, { useState, useEffect, use } from 'react';
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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { ProductGallery } from '@/components/product/ProductGallery';
import { BuyBox } from '@/components/product/BuyBox';
import { cn } from '@/lib/utils';

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
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      const data = await apiClient.getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('The product you are looking for could not be found.');
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
        comment: reviewComment
      });
      setReviewComment('');
      setReviewRating(5);
      // Refresh product data to show the new review and updated average rating
      await fetchProduct();
    } catch (err: any) {
      console.error(err);
      setReviewError(err.errors?.detail || err.errors?.[0] || 'Failed to post review. You may have already reviewed this product.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] border border-gray-100 text-center shadow-xl shadow-gray-200/50">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-4 italic">Product Not Found</h1>
          <p className="text-gray-400 font-bold mb-10 leading-relaxed">{error}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all active:scale-95">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Dynamic Header */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4 opacity-30" />
            <span className="text-gray-900 truncate max-w-[200px]">{product.category_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              aria-label="Share Product"
              className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all hover:scale-110 active:scale-90 shadow-sm"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              aria-label="Add to Wishlist"
              className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all hover:scale-110 active:scale-90 shadow-sm"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          
          {/* LEFT: GALLERY */}
          <div className="lg:col-span-6 xl:col-span-7">
            <ProductGallery images={product.images} />
          </div>

          {/* RIGHT: DETAILS & BUY BOX */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-12">
            
            {/* Essential Info */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {product.category_name}
                </div>
                {product.is_digital && (
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    Digital Download
                  </div>
                )}
              </div>

              <h1 className="text-5xl lg:text-3xl font-black text-gray-900 tracking-tighter leading-[0.9] italic">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-8 py-4 border-y border-gray-50">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={cn(
                          "w-4 h-4", 
                          s <= Math.round(product.average_rating || 0) ? "fill-current" : "opacity-20"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-gray-900">{parseFloat(product.average_rating || 0).toFixed(1)}</span>
                  <span className="text-xs font-bold text-gray-400 underline underline-offset-4 decoration-gray-200">
                     {product.total_reviews || 0} Reviews
                  </span>
                </div>
                <div className="flex items-center gap-2 group cursor-pointer text-indigo-600">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Ask Question</span>
                </div>
              </div>
            </div>

            {/* Price section for mobile (hidden on desktop because BuyBox has it) */}
            <div className="lg:hidden">
              <BuyBox product={product} />
            </div>

            {/* Description & Specs */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] italic">Product Overview</h3>
                <p className="text-lg font-medium text-gray-600 leading-relaxed italic">
                  {product.description}
                </p>
              </div>

              {/* Vendor Info */}
              <div className="p-8 bg-gray-50 rounded-[2.5rem] flex items-center justify-between group">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 group-hover:scale-110 group-hover:rotate-12 transition-all">
                     <Warehouse className="w-8 h-8" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Store / Vendor</p>
                     <p className="text-lg font-black text-gray-900 tracking-tight italic">{product.vendor || 'Authorized Retailer'}</p>
                   </div>
                </div>
                {product.vendor_id && (
                  <Link href={`/vendor-profile/${product.vendor_id}`} className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                    Visit Store
                  </Link>
                )}
              </div>

              {/* Attributes / Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Genuine Product</span>
                </div>
                <div className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Best Price Match</span>
                </div>
              </div>
            </div>

            {/* Buy Box for Desktop */}
            <div className="hidden lg:block">
              <BuyBox product={product} />
            </div>

          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-40 space-y-24">
           <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
                <div className="space-y-4">
                  <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] italic">Voice of Community</h2>
                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter italic">Customer <span className="text-gray-400">Experience</span></h3>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2">
                   <div className="flex items-center gap-3">
                     <span className="text-4xl font-black text-gray-900 tracking-tighter">{parseFloat(product.average_rating || 0).toFixed(1)}</span>
                     <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={cn("w-5 h-5", s <= Math.round(product.average_rating || 0) ? "fill-current" : "opacity-20")} />
                        ))}
                      </div>
                   </div>
                   <p className="text-xs font-bold text-gray-400 italic">Based on {product.total_reviews || 0} global reviews</p>
                </div>
              </div>

              {/* Review Submission Form (Only for logged in users) */}
              {user ? (
                <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
                   <div className="flex items-center justify-between">
                     <h4 className="text-xl font-black text-gray-900 tracking-tight italic">Write a Customer <span className="text-indigo-600">Review</span></h4>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Your Rating</span>
                        <div className="flex text-amber-500 gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                              key={s} 
                              type="button"
                              onClick={() => setReviewRating(s)}
                              aria-label={`Rate ${s} stars`}
                              className="focus:outline-none hover:scale-125 transition-transform"
                            >
                              <Star className={cn("w-6 h-6", s <= reviewRating ? "fill-current text-amber-500" : "text-gray-300")} />
                            </button>
                          ))}
                        </div>
                     </div>
                   </div>

                   <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div className="relative">
                        <textarea 
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          className="w-full h-40 bg-white border border-gray-100 rounded-[2.5rem] p-8 text-sm outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all resize-none shadow-inner"
                        />
                        <button 
                          type="submit"
                          disabled={submittingReview}
                          className="absolute bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center gap-2 group"
                        >
                          {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                        </button>
                      </div>
                      {reviewError && (
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest px-4">{reviewError}</p>
                      )}
                   </form>
                </div>
              ) : (
                <div className="p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100 text-center">
                   <p className="text-sm font-bold text-gray-600 mb-4 italic">Please sign in to share your experience with this product.</p>
                   <Link href="/login" className="inline-flex px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Sign In Now</Link>
                </div>
              )}

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review: any) => (
                    <div key={review.id} className="p-10 bg-white border border-gray-50 rounded-[3.5rem] space-y-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black italic border border-gray-100 group-hover:rotate-6 transition-transform">
                              {review.user?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-black text-gray-900 tracking-tight">{review.user || 'Verified Buyer'}</p>
                                {review.is_verified_purchase && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-emerald-100 flex items-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-500 gap-0.5">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <Star key={s} className={cn("w-3.5 h-3.5", s <= review.rating ? "fill-current" : "opacity-10")} />
                             ))}
                          </div>
                       </div>
                       <div className="relative">
                          <p className="text-gray-600 font-medium italic leading-relaxed">
                            "{review.comment}"
                          </p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-24 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                      <MessageCircle className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
}
