"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

type Product = { _id: string; name: string };
type Blog = { _id: string; title: string };

const siteSections = [
  {
    title: "Shop",
    links: [
      ["Product catalog", "/catalog"],
      ["Food Salt", "/categorypage?category=food-salt"],
      ["Sea Salt", "/categorypage?category=sea-salt"],
      ["Animal Salt", "/categorypage?category=animal-salt"],
      ["Home & Decor", "/categorypage?category=home-decor"],
      ["Rock Salt", "/categorypage?category=rock-salt"],
      ["Salt Brick", "/categorypage?category=salt-brick"],
      ["Salt Lamps", "/categorypage?category=salt-lamps"],
      ["Salt & Beauty", "/categorypage?category=salt-beauty"],
    ],
  },
  {
    title: "Company",
    links: [["Home", "/"], ["About us", "/about"], ["Contact us", "/contactus"], ["Send an inquiry", "/sendaninquiry"], ["FAQs", "/faqs"]],
  },
  {
    title: "Account & policies",
    links: [["Sign in", "/signin"], ["Create an account", "/signup"], ["Forgot password", "/forgetpassword"], ["Privacy policy", "/privacypolicy"], ["Terms & conditions", "/terms&condition"]],
  },
];

const textOnly = (value: string) => value.replace(/<[^>]*>/g, "");

export default function SitemapPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    api.get("/api/products").then((response) => setProducts(response.data || [])).catch(() => undefined);
    api.get("/api/blogs").then((response) => setBlogs(response.data || [])).catch(() => undefined);
  }, []);

  return <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8">
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">Saltiam</p>
      <h1 className="mt-2 text-4xl font-bold text-rose-900">Site map</h1>
      <p className="mt-3 max-w-2xl text-gray-700">Find every public page, product, and article available on Saltiam.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {siteSections.map((section) => <section key={section.title} className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-rose-800">{section.title}</h2>
          <ul className="mt-4 space-y-3">{section.links.map(([label, href]) => <li key={href}><Link href={href} className="text-gray-700 hover:text-rose-700 hover:underline">{label}</Link></li>)}</ul>
        </section>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-rose-800">Products</h2>
          {products.length === 0 ? <p className="mt-4 text-sm text-gray-600">Products will appear here when available.</p> : <ul className="mt-4 grid gap-3 sm:grid-cols-2">{products.map((product) => <li key={product._id}><Link href={`/productdetail/${product._id}`} className="text-gray-700 hover:text-rose-700 hover:underline">{product.name}</Link></li>)}</ul>}
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold text-rose-800">Blog articles</h2>
          {blogs.length === 0 ? <p className="mt-4 text-sm text-gray-600">Articles will appear here when available.</p> : <ul className="mt-4 space-y-3">{blogs.map((blog) => <li key={blog._id}><Link href={`/blogdetail/${blog._id}`} className="text-gray-700 hover:text-rose-700 hover:underline">{textOnly(blog.title)}</Link></li>)}</ul>}
        </section>
      </div>
    </div>
  </main>;
}
