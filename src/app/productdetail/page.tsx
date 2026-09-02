"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast as notify } from "react-toastify";
import { api } from "@/lib/apiClient";

type Review = {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  availability?: string;
  images?: string[];
  rating?: number;
  numReviews?: number;
  stockCount?: number;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // New review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [reviewError, setReviewError] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  
  // Hover star state
  const [hoveredRating, setHoveredRating] = useState(0);

  // Pagination state for reviews - Changed to 3
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(3);
  const REVIEWS_PER_PAGE = 3;

  // Pagination state for similar products
  const [visibleSimilarCount, setVisibleSimilarCount] = useState(3);
  const SIMILAR_PRODUCTS_PER_PAGE = 3;

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/products/${params.id}`)
      .then((response) => {
        const prod = response.data;
        setProduct(prod);
        api.get(`/api/reviews?productId=${prod._id}`).then((reviewsResponse) => {
          const reviews = reviewsResponse.data || [];
          setUserReviews(reviews);
          setVisibleReviews(reviews.slice(0, REVIEWS_PER_PAGE));
        }).catch(() => {
          setUserReviews([]);
          setVisibleReviews([]);
        });
        // Fetch similar products based on category
        if (prod?.category) {
          api.get("/api/products")
            .then((res) => {
              const all = res.data || [];
              const filtered = all.filter((p: Product) => p.category === prod.category && p._id !== prod._id);
              setSimilarProducts(filtered);
            })
            .catch(() => { });
        }
      })
      .catch((err) => setError(err?.response?.data?.error || "Product could not be loaded."));
  }, [params?.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPosition({ x, y });
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") { setReviewError("Please sign in to add a review."); return; }
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setReviewError("");
    try {
      const response = await api.post("/api/reviews", { productId: product?._id, rating: reviewRating, comment: reviewComment });
      const newReview = response.data;
      const updatedReviews = [newReview, ...userReviews];
      setUserReviews(updatedReviews);
      setVisibleReviews(updatedReviews.slice(0, REVIEWS_PER_PAGE));
      setReviewCount(REVIEWS_PER_PAGE);
      setReviewComment("");
      setReviewRating(5);
      setHoveredRating(0);
      notify.success("Review submitted successfully!");
      
      // Show success toast
      setToast({ message: "✅ Review submitted successfully!", type: 'success' });
      setTimeout(() => setToast(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not save your review.";
      setReviewError(message);
      notify.error(message);
      setToast({ message: `❌ ${message}`, type: 'error' });
      setTimeout(() => setToast(null), 4000);
    }
    finally { setSubmittingReview(false); }
  };

  const loadMoreReviews = () => {
    const newCount = reviewCount + REVIEWS_PER_PAGE;
    setReviewCount(newCount);
    setVisibleReviews(userReviews.slice(0, newCount));
  };

  const loadMoreSimilarProducts = () => {
    setVisibleSimilarCount(prev => prev + SIMILAR_PRODUCTS_PER_PAGE);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-rose-100 p-12 text-center">
        <p className="text-xl text-rose-900">{error}</p>
        <Link href="/catalog" className="mt-5 inline-block text-rose-700 underline">Back to catalog</Link>
      </main>
    );
  }

  if (!product) {
    return <main className="min-h-screen bg-rose-100 p-12 text-center text-rose-900 font-medium">Loading product...</main>;
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const imageSrc = (image?: string) => {
    if (!image) return null;
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    return image.startsWith("/uploads/") ? image : `/uploads/${image.replace(/^\/?uploads\//, "")}`;
  };
  const currentImage = imageSrc(images[selectedImageIndex]);

  const stockStatus = product.availability || "In Stock";
  const stockStatusColor = stockStatus.toLowerCase().includes("low") ? "bg-amber-100 text-amber-800 border-amber-300" : stockStatus.toLowerCase().includes("out") ? "bg-red-100 text-red-800 border-red-300" : "bg-emerald-100 text-emerald-800 border-emerald-300";

  const totalReviews = userReviews.length;
  const avgRating = totalReviews ? userReviews.reduce((total, review) => total + review.rating, 0) / totalReviews : 0;

  const hasMoreReviews = visibleReviews.length < userReviews.length;
  const visibleSimilarProducts = similarProducts.slice(0, visibleSimilarCount);
  const hasMoreSimilarProducts = visibleSimilarProducts.length < similarProducts.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-3">
      <div className="mx-auto max-w-6xl">
        <Link href="/catalog" className="inline-flex items-center text-xl font-semibold text-rose-800 transition-colors hover:text-rose-950">
          ← Back to catalog
        </Link>

        {/* Main Product Container */}
        <article className="mt-6 overflow-visible rounded-3xl bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Vertical Thumbnails + Large Image with Zoom */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
              
              {/* Thumbnails (Top to bottom) */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[450px] scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImageIndex === idx ? "border-rose-600" : "border-rose-300 hover:border-rose-600"
                      }`}
                  >
                    <img src={imageSrc(img) || ""} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Large Image Box with Amazon Zoom Effect - Image now completely fills container */}
              <div className="relative flex-1">
                <div
                  ref={imageContainerRef}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                  className="relative h-[420px] w-full cursor-crosshair overflow-hidden rounded-2xl bg-rose-50 border border-gray-100 shadow-inner"
                >
                  {currentImage ? (
                    <img src={currentImage} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-rose-300">No Image Available</div>
                  )}

                  {/* Zoom Lens Indicator */}
                  {isHovering && currentImage && (
                    <div
                      className="absolute pointer-events-none border-2 border-rose-500 bg-rose-500/20 shadow-sm"
                      style={{
                        width: '120px',
                        height: '120px',
                        top: `calc(${cursorPosition.y}% - 60px)`,
                        left: `calc(${cursorPosition.x}% - 60px)`,
                      }}
                    />
                  )}
                </div>

                {/* Amazon Style Zoomed Hover Panel (Appears to the right on desktop) */}
                {isHovering && currentImage && (
                  <div className="hidden lg:block absolute left-full top-0 ml-6 h-[420px] w-[450px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-50">
                    <div
                      className="h-full w-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                        backgroundSize: '250%',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details, Status, Ratings */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                    {product.category?.replaceAll("-", " ")}
                  </span>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${stockStatusColor}`}>
                    {stockStatus}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-rose-700 tracking-tight">
                  {product.name}
                </h1>

                {/* Rating and Reviews Summary */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({totalReviews} customer reviews)</span>
                </div>

                <div className="my-5 border-t border-gray-100" />

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider">Description</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Status: <strong className="text-rose-800">{stockStatus}</strong></span>
                  <span>Category: <strong className="text-rose-700">{product.category}</strong></span>
                </div>
                <Link
                  href="/sendaninquiry"
                  className="w-full text-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 px-5 py-3.5 font-bold text-white shadow-md transition-all hover:bg-rose-700 hover:shadow-lg"
                >
                  Send an inquiry
                </Link>
              </div>

            </div>

          </div>
        </article>

        {/* Reviews Section & Add Review Form */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Customer Reviews List */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-rose-800 mb-6">Customer Reviews ({totalReviews})</h2>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {visibleReviews.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to add one!</p>
              ) : (
                <>
                  {visibleReviews.map((rev) => (
                    <div key={rev._id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900">{rev.userName}</h4>
                        <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1 my-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{rev.comment}</p>
                    </div>
                  ))}
                  
                  {/* Load More Button for Reviews */}
                  {hasMoreReviews && (
                    <div className="pt-3 text-center">
                      <button
                        onClick={loadMoreReviews}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-lg"
                      >
                        <span>Load More Reviews</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <p className="mt-2 text-xs text-gray-400">
                        Showing {visibleReviews.length} of {userReviews.length} reviews
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Add Review Form - With Hover Star Selection */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-bold text-rose-800 mb-4">Add a Review</h2>
            {status !== "authenticated" && <p className="mb-4 text-sm text-rose-700">Please <Link href="/signin" className="font-semibold underline">sign in</Link> to add a review.</p>}
            {reviewError && <p className="mb-4 text-sm text-red-600">{reviewError}</p>}
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  value={session?.user?.name || ""}
                  readOnly
                  disabled={status !== "authenticated"}
                  placeholder="Your name will appear after sign in"
                  className="w-full rounded-xl text-black border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
                />
              </div>

              {/* Hover Star Rating Selection - Larger, more yellow with yellow shadow */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <svg 
                        className={`h-8 w-8 transition-all ${
                          star <= (hoveredRating || reviewRating) 
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
                            : "fill-gray-300 text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    {reviewRating} {reviewRating === 1 ? "Star" : "Stars"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full text-black rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={status !== "authenticated" || submittingReview}
                className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingReview ? "Saving..." : "Submit Review"}
              </button>
            </form>
          </div>

        </section>

        {/* Similar Products Section with Pagination */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-rose-800 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleSimilarProducts.map((item) => (
                <Link
                  key={item._id}
                  href={`/productdetail/${item._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full"
                >
                  <div className="h-48 w-full bg-rose-50 overflow-hidden flex-shrink-0">
                    {item.images?.[0] && (
                      <img src={imageSrc(item.images[0]) || ""} alt={item.name} className="h-full w-full object-cover " />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-rose-600 line-clamp-1">{item.name}</h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                    <span className="mt-4 text-xs font-semibold uppercase text-rose-600">View details →</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button for Similar Products */}
            {hasMoreSimilarProducts && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMoreSimilarProducts}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-lg"
                >
                  <span>Load More Similar Products</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  Showing {visibleSimilarProducts.length} of {similarProducts.length} similar products
                </p>
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}
