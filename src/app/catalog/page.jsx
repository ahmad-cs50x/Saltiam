"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
   
const Catalog = () => {
  const catalogItems = [
    { title: "Food Salt", img: "/1.png", link: "/categorypage?category=food-salt" },
    { title: "Sea Salt", img: "/2.png", link: "/categorypage?category=sea-salt" },
    { title: "Animal Salt", img: "/3.png", link: "/categorypage?category=animal-salt" },
    { title: "Home & Decor", img: "/4.png", link: "/categorypage?category=home-decor" },
    { title: "Rock Salt", img: "/5.png", link: "/categorypage?category=rock-salt" },
    { title: "Salt Brick", img: "/6.png", link: "/categorypage?category=salt-brick" },
    { title: "Salt Lamps", img: "/7.png", link: "/categorypage?category=salt-lamps" },
    { title: "Salt & Beauty", img: "/8.png", link: "/categorypage?category=salt-beauty" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden -mt-10 bg-gradient-to-b from-[#ffd3b6] via-rose-200 to-rose-300 pt-24 pb-20">


      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <div ClassName="flex flex-row" >
            {/* <Link
              href="/"
              className="flex flex-row mr-26 items-center text-xl font-semibold text-rose-700 hover:text-rose-800"
            >
              ← Back to Home
            </Link> */}
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-600/80">
              Our Collection
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            Explore Our Products
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Discover pure, natural salt products crafted for every need.
          </p>
        </div>

        {/* Grid — tighter gaps + smaller cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {catalogItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-100"
            >
              <div className="relative overflow-hidden rounded-xl bg-rose-300 border-3 border-bg-white/80 p-2.5 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg sm:p-3">
                {/* Image container — smaller */}
                <div className="relative mb-2.5 aspect-square overflow-hidden rounded-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                {/* Title */}
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-rose-900 transition-colors duration-300 group-hover:text-rose-700 sm:text-2xl">
                    {item.title}
                  </h3>
                  <span className="mt-0.5 inline-block text-[10px] font-medium text-rose-500 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:text-xs">
                    View products →
                  </span>
                </div>

                {/* Subtle bottom accent on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-rose-400 to-orange-400 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;