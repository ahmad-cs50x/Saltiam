"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUs = () => {
  return (
    <section className="bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-400 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Main Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-700/80">
            Company foundation
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            About Saltiam
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Purity from the Heart of the Himalayas
          </p>
        </div>
        {/* Hero Section - Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-28">
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Pure Salt, <span className="text-rose-700">Global Reach</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              <strong>At Saltiam </strong>, we’re passionate about bringing nature’s finest salts to the world.
              From the pristine Himalayan mines of <strong>Khewra Pakistan</strong>, to sustainable sea salt farms, we export premium
              Himalayan pink salt, sea salt, and specialty salts to <strong>over 50 countries</strong>.
            </p>
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link href="/catalog" 
              className="px-12 bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-5 rounded-2xl shadow-2xl hover:shadow-rose-700/50 cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none"
             >
                Explore Products
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image with Floating Effect */}
          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative">
              <img
                src="https://i.imghippo.com/files/IGZQ5172KGs.jpg"
                alt="Pure Himalayan Pink Salt Crystals"
                className="w-full max-w-md lg:max-w-lg xl:max-w-xl rounded-3xl shadow-2xl border-8 border-white/95"
              />
              {/* Floating decorative elements */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-amber-400 to-pink-400 rounded-full blur-3xl opacity-25"></div>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20 lg:mb-28">
          {[
            {
              title: "Uncompromising Quality",
              desc: "Our salts undergo rigorous testing to meet ISO 22000, HACCP, and FDA standards, ensuring purity, safety, and consistency for culinary, wellness, and industrial applications.",
              icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )
            },
            {
              title: "Sustainable Practices",
              desc: "We partner with eco-conscious suppliers to source salts responsibly, preserving the environment and supporting communities in Pakistan and beyond.",
              icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              )
            },
            {
              title: "Global Partnerships",
              desc: "From bulk exports to custom packaging, we empower businesses worldwide with reliable logistics and tailored solutions, building trust with every shipment.",
              icon: (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              )
            }
          ].map((value, index) => (
            <div
              key={index}
              className="group bg-gradient-to-r from-pink-100/80 to-rose-100/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-pink-100 hover:border-pink-300 transform hover:-translate-y-3"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-600/80 to-pink-800 rounded-2xl mb-6 flex items-center justify-center">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold text-pink-800 mb-4 group-hover:text-pink-900 transition">
                {value.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {value.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Our Story Section */}
        <div className="bg-gradient-to-r from-pink-100/80 to-rose-100/80 backdrop-blur-sm rounded-3xl p-10 lg:p-16 shadow-2xl border border-pink-200 mb-20">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-pink-900 mb-8">
            Our Story
          </h3>
          <p className="text-lg sm:text-xl text-gray-800 text-center max-w-4xl mx-auto leading-relaxed font-medium">
            Founded with a vision to share the natural wonders of Himalayan and sea salts,
            <span className="text-pink-700 font-bold"> Saltiam </span>
            combines tradition with innovation. Our journey began in the heart of Pakistan’s salt mines,
            where we saw an opportunity to bring ethically sourced, high-quality salts to global markets.
            Today, we’re proud to serve businesses and homes worldwide — from gourmet chefs to wellness brands —
            with salts that elevate every experience.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-pink-900 mb-8">
            Ready to partner with us?
          </p>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Let’s discuss how Saltiam can supply your business with the world’s finest natural salts.
          </p>
          <a
            href="https://zcal.co/saltiam-official/30min"
            target="_blank"
            rel="noopener noreferrer"
           className="w-[75%] sm:w-[25%] sm:mx-auto mx-auto bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-5 rounded-2xl hover:shadow-2xl justify-center cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none"
          >
            Book a Free Consultation
            <svg className="w-8 h-8 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;