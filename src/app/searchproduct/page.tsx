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
  stockCount?: number;
};

const imageSrc = (image?: string) => {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("data:")) return image;
  return image.startsWith("/uploads/") ? image : `/uploads/${image.replace(/^\/?uploads\//, "")}`;
};

const stockBadge = (product: Product) => {
  const status = product.availability || "In Stock";
  if (status.toLowerCase().includes("out")) {
    return { label: status, color: "bg-red-100 text-red-800 border-red-300" };
  }
  if (status.toLowerCase().includes("low") || (product.stockCount ?? Infinity) <= 5) {
    return {
      label: status.toLowerCase().includes("low") ? status : "Low Stock",
      color: "bg-amber-100 text-amber-800 border-amber-300"
    };
  }
  return { label: status, color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
};

export default function SearchProductPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    api.get("/api/products")
      .then((response) => {
        const data = response.data || [];
        setAllProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const matches = allProducts.filter((product) =>
    `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query)
  );

  const loadMoreProducts = () => {
    setVisibleCount(prevCount => prevCount + PRODUCTS_PER_PAGE);
  };

  const visibleProducts = matches.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < matches.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/catalog"
          className="inline-flex items-center text-xl font-semibold text-rose-700 hover:text-rose-800"
        >
          ← Back to catalog
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-rose-800 sm:text-4xl">
            {query ? `Search results for “${query}”` : "Search products"}
          </h1>
          {query && !loading && (
            <span className="inline-flex self-start rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-rose-800 backdrop-blur-sm sm:self-auto">
              {matches.length} results
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-16 text-center text-lg font-medium text-rose-900">
            Searching products...
          </div>
        ) : !query ? (
          <div className="mt-16 rounded-2xl bg-white/60 p-12 text-center text-rose-900">
            Enter a product name in the header search bar.
          </div>
        ) : matches.length === 0 ? (
          <div className="mt-16 rounded-2xl bg-white/60 p-12 text-center text-rose-900">
            No products matched your search.
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const stock = stockBadge(product);
                return (
                  <Link
                    key={product._id}
                    href={`/productdetail/${product._id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full"
                  >
                    {/* Fixed height image container with consistent sizing */}
                    <div className="relative w-full h-55 flex-shrink-0 overflow-hidden bg-rose-50">
                      {imageSrc(product.images?.[0]) ? (
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={imageSrc(product.images?.[0]) || ""}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-rose-300">
                          No Image Available
                        </div>
                      )}
                      <div className="absolute right-3 top-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${stock.color}`}>
                          {stock.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
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
                        <span className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-rose-700">
                          →
                        </span>
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
                  Showing {visibleProducts.length} of {matches.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}