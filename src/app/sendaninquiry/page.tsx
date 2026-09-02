"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/apiClient';
import { toast } from 'react-toastify';

const SendInquiry = () => {
  const router = useRouter(); // Replace useNavigate with useRouter
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [inquiryName, setInquiryName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState({ country: '', postalCode: '', address: '' });
  const isAuthenticated = isLoggedIn || status === 'authenticated';
  const displayName = session?.user?.name || userName;

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    if (token) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  useEffect(() => {
    setInquiryName(displayName || '');
  }, [displayName]);

  useEffect(() => {
    if (status !== 'authenticated') {
      setDeliveryLocation({ country: '', postalCode: '', address: '' });
      return;
    }

    api.get('/api/delivery-location')
      .then(({ data }) => setDeliveryLocation({
        country: data.deliveryLocation?.country || '',
        postalCode: data.deliveryLocation?.postalCode || '',
        address: data.deliveryLocation?.address || '',
      }))
      .catch(() => toast.error('Could not load sent your inquiry.'));
  }, [status]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login or register to send an inquiry.');
      router.push('/'); // Replace navigate with router.push
      return;
    }
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const { data } = await api.put('/api/delivery-location', { country: formData.get('country'), postalCode: formData.get('postalCode'), address: formData.get('address') });
      window.dispatchEvent(new CustomEvent('delivery-location-updated', { detail: data.deliveryLocation }));
      toast.success('Inquiry sent successfully!');
      form.submit();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not save delivery location.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-300 text-gray-800 flex flex-col">

      {/* Hero Banner - Fully Responsive */}

      <section className="relative overflow-hidden text-white mt-12 mb-6 px-4">

        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-700/80">
            Get in touch
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            Send an inquiry
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Ready to discuss your salt export needs? Our team is here to help you find the perfect solution.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/catalog"
            className="group w-full sm:w-auto bg-white text-rose-700/80 px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all cursor-pointer duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center gap-2"
          >
            View Catalog
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="https://zcal.co/saltiam-official/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <button className="w-full border-2 border-white/80 text-white px-10 py-4 rounded-full font-semibold cursor-pointer transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1">
              Book Meeting
            </button>
          </a>
        </div>

      </section>

      {/* Main Content - Responsive Grid */}
      <section className="py-12 sm:py-16 px-4 flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left Column: Contact Info */}
          <div className="space-y-8">

            {/* Introduction - Redesigned */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/50 hover:shadow-3xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-rose-600/80 to-pink-800 p-3 rounded-2xl flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-rose-800 mb-3">Welcome to Saltiam</h2>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    As a leading exporter of premium Himalayan pink salt and specialty salts, we're dedicated to providing exceptional quality and service to our global partners.
                    Whether you're inquiring about bulk orders, custom packaging, or business partnerships, our team is ready to assist you every step of the way.
                  </p>
                </div>
              </div>
            </div>
            {/* Contact Details Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                  <div className="bg-rose-200 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Headquarters</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Saltiam Exports Pvt. Ltd.<br />Khewra Salt Mines<br />Jhelum, Pakistan</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                  <div className="bg-rose-200 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">inquiries@saltiam.com</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                  <div className="bg-rose-200 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">+92 300 123 4567</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-4 mb-4">
                  <div className="bg-rose-200 p-3 rounded-xl">
                    <svg className="w-6 h-6 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Working Hours</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Mon - Fri: 9AM - 6PM<br />Sat: 10AM - 4PM</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-700/80 mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link href="/catalog" className="text-rose-700/80 hover:text-rose-700 cursor-pointer flex items-center space-x-3 transition text-base sm:text-lg">
                  <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                  <span>Product Catalog</span>
                </Link></li>
                <li><Link href="/faqs" className="text-rose-700/80 hover:text-rose-700 cursor-pointer flex items-center space-x-3 transition text-base sm:text-lg">
                  <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                  <span>FAQs</span>
                </Link></li>
                <li><Link href="/about" className="text-rose-700/80 hover:text-rose-700 cursor-pointer flex items-center space-x-3 transition text-base sm:text-lg">
                  <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                  <span>About Us</span>
                </Link></li>
                <li><Link href="/privacypolicy" className="text-rose-700/80 hover:text-rose-700 cursor-pointer flex items-center space-x-3 transition text-base sm:text-lg">
                  <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
                  <span>Privacy Policy</span>
                </Link></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Form and Map */}
          <div className="space-y-8">
            {/* Inquiry Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-br from-rose-600/80 to-pink-800 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-rose-800">Send Your Inquiry</h2>
              </div>

              {!isAuthenticated && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-4 rounded-lg mb-6 text-center sm:text-left">
                  <p className="font-bold text-base sm:text-lg">Login Required</p>
                  <p className="text-sm sm:text-base">Please <Link href="/signin" className="underline font-semibold">login or register</Link> to send an inquiry.</p>
                </div>
              )}

              <form action="https://formspree.io/f/manljoop" method="POST" className="space-y-5" onSubmit={handleFormSubmit}>
                {/* All form fields remain exactly the same – only spacing improved */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="name" required disabled={!isAuthenticated} value={isAuthenticated ? inquiryName : ''} onChange={(event) => setInquiryName(event.target.value)} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input type="email" name="email" required disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" required disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="e.g., +92 300 1234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <input type="text" name="country" required disabled={!isAuthenticated} value={deliveryLocation.country} onChange={(event) => setDeliveryLocation({ ...deliveryLocation, country: event.target.value })} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100"  placeholder="Enter country name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                  <input type="text" name="postalCode" disabled={!isAuthenticated} value={deliveryLocation.postalCode} onChange={(event) => setDeliveryLocation({ ...deliveryLocation, postalCode: event.target.value })} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Enter postal code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                  <input type="text" name="address" required disabled={!isAuthenticated} value={deliveryLocation.address} onChange={(event) => setDeliveryLocation({ ...deliveryLocation, address: event.target.value })} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Enter delivery address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
                  <input type="text" name="company" disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Enter your company name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input type="text" name="subject" required disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100" placeholder="Inquiry subject" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Interest</label>
                  <select name="product" disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-gray-100">
                    <option>Select a product</option>
                    <option>Himalayan Pink Salt</option>
                    <option>Sea Salt</option>
                    <option>Rock Salt</option>
                    <option>Salt Lamps</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea name="message" rows="6" required disabled={!isAuthenticated} className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none disabled:bg-gray-100" placeholder="Tell us about your inquiry..."></textarea>
                </div>
                <button type="submit" disabled={!isAuthenticated} className="w-full bg-rose-600 text-white py-4 rounded-lg font-semibold hover:bg-rose-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-base sm:text-lg">
                  Send Inquiry
                </button>
              </form>
              <p className="text-sm text-gray-500 text-center mt-4">We'll respond within 24-48 hours.</p>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <h3 className="text-xl sm:text-2xl font-bold text-rose-700/80 p-6 border-b border-gray-200">Our Location</h3>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.652748048048!2d73.024!3d32.648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDM4JzU0LjciTiA3M8KwMDEnNTIuMCJF!5e0!3m2!1sen!2sus!4v1630000000000"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Saltiam Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SendInquiry;
