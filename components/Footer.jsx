'use client';
import Link from 'next/link';
import React from 'react';
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-rose-800 text-gray-300 pt-12 pb-6 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10 text-center sm:text-left">

        {/* Company Info */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Company Info</h3>
          <p className="text-sm max-w-xs sm:max-w-none">
            At Saltiam, we bring the purity of the Himalayan mountains directly to your table. Our salts are ethically sourced, naturally harvested, and beautifully crafted.
          </p>
          <Link href="/" className="mt-4"><Logo w={150} h={150} /></Link>
          <p className="text-sm mt-3">Email: info.saltiam@gmail.com</p>
          <p className="text-sm">Phone: +92 (800) 123-4567</p>
        </div>

        {/* Follow Us (Add your actual social media links in href) */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-white text-lg font-semibold mb-2 sm:mb-4">Follow Us</h3>
          <p className="text-sm text-center sm:text-left mb-4">
            Stay connected with us for offers, updates, and new products!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center items-center">
            <Link href="/fb.png" target="_blank" rel="noopener noreferrer">
              <img src="/fb.png" alt="Facebook" className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 p-0.5 rounded-full hover:scale-110 transition transform duration-200 hover:bg-cyan-600" />
            </Link>
            <Link href="/linkedin.png" target="_blank" rel="noopener noreferrer">
              <img src="https://i.imghippo.com/files/tYvm7221I.png" alt="Twitter" className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 p-0.5 rounded-full hover:scale-110 transition transform duration-200 hover:bg-sky-400" />
            </Link>
            <Link href="/instagram.png" target="_blank" rel="noopener noreferrer">
              <img src="https://i.imghippo.com/files/ZwRj8958Ds.png" alt="Instagram" className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 p-0.5 rounded-full hover:scale-110 transition transform duration-200 hover:bg-red-500" />
            </Link>
            <Link href="/whatsapp.png" target="_blank" rel="noopener noreferrer">
              <img src="/whatsapp.png" alt="LinkedIn" className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 p-0.5 rounded-full hover:scale-110 transition transform duration-200 hover:bg-lime-500" />
            </Link>
          </div>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bloglist" className="hover:text-pink-300 hover:underline">Blogs</Link></li>
            <li><Link href="/sitemap" className="hover:text-pink-300 hover:underline">Site Map</Link></li>
            <li><Link href="/about" className="hover:text-pink-300 hover:underline">About Us</Link></li>
            <li><Link href="/contactus" className="hover:text-pink-300 hover:underline">Contact Us</Link></li>
            <li><Link href="/privacypolicy" className="hover:text-pink-300 hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms&condition" className="hover:text-pink-300 hover:underline">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="flex flex-col items-center sm:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faqs" className="hover:text-pink-300 hover:underline">FAQ's</Link></li>
            <li><Link href="/catalog" className="hover:text-pink-300 hover:underline">Catalog</Link></li>
            <li><Link href="/sendaninquiry" className="hover:text-pink-300 hover:underline">Send an Inquiry</Link></li>
            <li><Link href="https://zcal.co/saltiam-official/30min" target="_blank" rel="noopener noreferrer" className="hover:text-pink-300 hover:underline">Book a Meeting</Link></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="mt-10 mb-4 text-center text-sm text-white">
        <p>© 2025 Saltiam. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
