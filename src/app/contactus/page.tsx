"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

const ContactUs = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#ffd3b6] via-rose-200 to-pink-100 py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-600/80">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            We’re here to help you with any inquiry — big or small
          </p>
        </div>

        {/* Main Contact Card */}
        <div className="relative">
          {/* Floating Decorative Blobs */}
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute top-0 -left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
            <div className="absolute bottom-0 -right-10 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-30"></div>
          </div>

          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
            <div className="p-6 sm:p-10 lg:p-14 xl:p-20">

              {/* Responsive Grid: Stacked on Mobile -> Side-by-side on Laptop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* Left: Contact Info + Quick Actions */}
                <div className="space-y-8 lg:space-y-10">

                  {/* Contact Items - Fully Responsive & Beautiful */}
                  {[
                    {
                      svg: (
                        <svg className="w-full h-full text-rose-800 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      title: "Our Office",
                      content: (
                        <>
                          Saltiam Headquarters<br />
                          <span className="font-bold tracking-tight text-rose-800 text-lg">
                            123 Business Avenue<br />
                            Lahore, Pakistan
                          </span>
                        </>
                      ),
                    },
                    {
                      // Phone Icon SVG (commented down below)
                      svg: (
                        <svg className="w-full h-full text-rose-800 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: "Phone",
                      content: (
                        <a
                          href="tel:+923001234567"
                          className="font-bold tracking-tight text-rose-800 text-xl hover:underline hover:text-rose-700 transition"
                        >
                          +92 300 1234567
                        </a>
                      ),
                    },
                    {
                      // Email Icon SVG (commented down below)
                      svg: (
                        <svg className="w-full h-full text-rose-800 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: "Email",
                      content: (
                        <a
                          href="mailto:support@saltiam.com"
                          className="font-bold tracking-tight text-rose-800 text-xl hover:underline hover:text-rose-700 transition break-all"
                        >
                          support@saltiam.com
                        </a>
                      ),
                    },
                  ].map((item, index) => (
                    <div key={index} className="group flex flex-row items-start gap-5 p-6 rounded-2xl bg-gradient-to-r from-rose-50 to-rose-50 hover:from-rose-100 hover:to-rose-100 transition-all duration-300 border border-rose-200 hover:border-rose-400 hover:shadow-xl cursor-pointer">
                      {/* Icon - Left Side */}
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
                          {item.svg}
                        </div>
                      </div>

                      {/* Text Content - Right Side */}
                      <div className="flex-1 text-left">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Quick Action Buttons - Responsive Grid */}
                  <div className="mt-10 pt-8 border-t-2 border-pink-200 border-dashed">
                    <h3 className="text-2xl font-bold text-rose-800 mb-6 text-center lg:text-left">
                      Connect Instantly
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <a
                        href="https://zcal.co/saltiam-official/30min"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-rose-600 to-rose-800 text-white py-4 px-3 rounded-xl font-bold hover:shadow-xl cursor-pointer text-sm sm:text-base"
                      >
                        Book Meeting
                      </a>
                      <a
                        href="https://wa.me/923001234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-700 text-white py-4 px-6 rounded-xl font-bold hover:bg-green-600  cursor-pointer text-sm sm:text-base"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-inner border border-pink-200">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-800 mb-4 text-center lg:text-left">
                    Send Us a Message
                  </h3>
                  <p className="text-gray-600 mb-8 text-center lg:text-left text-sm sm:text-base">
                    We typically reply within <strong className="text-rose-800">24 hours</strong>
                  </p>

                  <form action="https://formspree.io/f/manljoop" method="POST" className="space-y-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name *"
                      required
                      className="w-full px-6 py-4 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email Address *"
                      required
                      className="w-full px-6 py-4 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base outline-none"
                    />
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="How can we help you today? *"
                      required
                      className="w-full px-6 py-4 bg-white/90 border-2 border-rose-200 rounded-2xl focus:border-pink-500 focus:ring-0 focus:ring-offset-0 transition-all text-gray-800 placeholder-gray-500 text-base resize-none outline-none"
                    ></textarea>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-rose-700 to-rose-800 text-white font-bold text-lg py-5 rounded-2xl shadow-2xl hover:shadow-rose-700/50 cursor-pointer flex items-center justify-center gap-3 outline-none focus:outline-none"
                    >
                      Send Message
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                    <p className="text-center text-gray-600 text-xs sm:text-sm mt-4 italic">
                      Your information is 100% secure and will never be shared.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra spacing for mobile */}
      <div className="h-20 lg:hidden"></div>
    </section>
  );
};

export default ContactUs;