"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

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

type Review = {
  productId: string | { toString(): string };
  rating: number;
};

const categoryName = (category: string) =>
  category.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");

const imageSrc = (image?: string) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return image.startsWith("/uploads/") ? image : `/uploads/${image.replace(/^\/?uploads\//, "")}`;
};

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PRODUCTS_PER_PAGE);

    Promise.all([api.get("/api/products"), api.get("/api/reviews")])
      .then(([productsResponse, reviewsResponse]) => {
        const reviewSummary = (reviewsResponse.data as Review[]).reduce<Record<string, { total: number; count: number }>>(
          (summary, review) => {
            const productId = review.productId.toString();
            const current = summary[productId] || { total: 0, count: 0 };
            current.total += review.rating;
            current.count += 1;
            summary[productId] = current;
            return summary;
          },
          {}
        );
        const data = (productsResponse.data || []).map((product: Product) => {
          const summary = reviewSummary[product._id];
          return summary
            ? { ...product, rating: summary.total / summary.count, numReviews: summary.count }
            : { ...product, rating: 0, numReviews: 0 };
        }).filter(
          (product: Product) => !category || product.category === category
        );
        setAllProducts(data);
        setVisibleProducts(data.slice(0, PRODUCTS_PER_PAGE));
      })
      .finally(() => setLoading(false));
  }, [category]);

  const loadMoreProducts = () => {
    const newCount = visibleCount + PRODUCTS_PER_PAGE;
    setVisibleCount(newCount);
    setVisibleProducts(allProducts.slice(0, newCount));
  };

  const getStockBadge = (product: Product) => {
    const count = product.stockCount ?? (product.availability?.toLowerCase().includes("low") ? 3 : 15);
    if (count <= 5) {
      return {
        label: `Low Stock (${count} left)`,
        color: "bg-amber-100 text-amber-800 border-amber-300"
      };
    }
    if (count > 20) {
      return {
        label: "High Stock",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300"
      };
    }
    return {
      label: "In Stock",
      color: "bg-sky-100 text-sky-800 border-sky-300"
    };
  };

  const hasMoreProducts = visibleProducts.length < allProducts.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/catalog"
          className="inline-flex items-center text-xl font-semibold text-rose-800 transition-colors hover:text-rose-800"
        >
          ← Back to catalog
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-rose-800 sm:text-4xl">
            {category ? categoryName(category) : "All Products"}
          </h1>
          {!loading && (
            <span className="inline-flex items-center self-start rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-rose-800 backdrop-blur-sm sm:self-auto">
              {allProducts.length} {allProducts.length === 1 ? "product" : "products"} available
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="animate-pulse font-medium text-rose-900 text-lg">Loading products...</div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-white/60 p-12 text-center shadow-sm backdrop-blur-md">
            <p className="font-medium text-rose-900">No products are available in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const stock = getStockBadge(product);
                const rating = product.rating ?? 0;
                const numReviews = product.numReviews ?? 0;

                return (
                  <Link
                    key={product._id}
                    href={`/productdetail/${product._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full"
                  >
                    {/* Fixed height image container with consistent sizing */}
                    <div className="relative w-full h-55 flex-shrink-0 overflow-hidden bg-rose-50">
                      {product.images?.[0] ? (
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={imageSrc(product.images[0]) || ""}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'flex h-full w-full items-center justify-center text-sm text-rose-300';
                                fallback.textContent = 'Image Unavailable';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-rose-300">
                          No Image Available
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${stock.color}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between px-5 py-2">
                      <div>
                        <div className="mb-2 flex items-center gap-1.5">
                          <div className="flex items-center text-amber-500">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({numReviews} reviews)</span>
                        </div>

                        {/* Product name - Single line with ellipsis */}
                        <h2 className="line-clamp-1 text-2xl font-bold text-rose-700 transition-colors group-hover:text-rose-700/95">
                          {product.name}
                        </h2>
                        
                        {/* Product description - Two lines with ellipsis */}
                        <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 group-hover:underline">
                          View details
                        </span>
                        <span className="text-gray-400 transition-transform group-hover:text-rose-700 group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMoreProducts && (
              <div className="mt-10 text-center">
                <button
                  onClick={loadMoreProducts}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:from-rose-600 hover:to-rose-700 hover:shadow-lg"
                >
                  <span>Load More Products</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="mt-2 text-xs text-gray-500">
                  Showing {visibleProducts.length} of {allProducts.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
