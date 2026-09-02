'use client';
import Logo from "./Logo.jsx";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { toast } from 'react-toastify';
import DeliverModal from "./DeliverModal.jsx";
import { api } from '../src/lib/apiClient';

const Header = () => {
  const router = useRouter();
  const [isDeliverOpen, setIsDeliverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const { data: session, status } = useSession();
  const [hasShownSignInToast, setHasShownSignInToast] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const SUPER_USER_EMAIL = 'ranaahmadranaahmad741@gmail.com';
  const pathname = usePathname();

  // Combine local‑storage login with NextAuth session
  const isUserAuthenticated = isLoggedIn || status === 'authenticated';
  const displayUserName = userName || session?.user?.name || 'User';

  useEffect(() => {
    // Local‑storage check (email/password flow)
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'User');
    }
    // Auto‑redirect super user to the secret panel.
    if (status === 'authenticated' && session?.user?.email === SUPER_USER_EMAIL && !hasRedirected && pathname !== '/secretpanel') {
      router.push('/secretpanel');
      setHasRedirected(true);
    }
  }, [status, session, pathname, hasRedirected]);

  // Show toast once when NextAuth reports an authenticated session
  useEffect(() => {
    if (status === 'authenticated' && !hasShownSignInToast) {
      toast.success('Signed in successfully!');
      setHasShownSignInToast(true);
    }
  }, [status, hasShownSignInToast]);

  useEffect(() => {
    if (status !== 'authenticated') {
      setDeliveryLocation(null);
      return;
    }

    const loadDeliveryLocation = async () => {
      try {
        const { data } = await api.get('/api/delivery-location');
        setDeliveryLocation(data.deliveryLocation || null);
      } catch {
        setDeliveryLocation(null);
      }
    };

    const handleLocationUpdated = (event) => setDeliveryLocation(event.detail || null);
    loadDeliveryLocation();
    window.addEventListener('delivery-location-updated', handleLocationUpdated);
    return () => window.removeEventListener('delivery-location-updated', handleLocationUpdated);
  }, [status]);

  const deliverySummary = deliveryLocation?.address
    ? `${deliveryLocation.address}${deliveryLocation.postalCode ? `, ${deliveryLocation.postalCode}` : ''}`
    : deliveryLocation?.country || deliveryLocation?.postalCode || 'Choose location';

  const closeAll = () => {
    setIsDeliverOpen(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserName('');
    toast.success('Logged out successfully!');
    
    if (status === 'authenticated') {
      await signOut({ redirect: false });
    }
    
    // Redirect to home after short delay to allow toast to appear
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  // FIXED: Changed React Router `navigate` to Next.js App Router `router.push`
  const goToPrivacy = () => {
    router.push('/privacy-policy');
  };

  const goToTerms = () => {
    router.push('/terms-conditions');
  };

  return (
    <header className="bg-rose-400 text-white top-0 z-50 shadow-lg w-full transition-all duration-300">
      <div className="flex items-center px-3 md:px-6 py-2 flex-wrap">

        {/* Logo - Desktop */}
        <div className="hidden md:block hover:cursor-pointer mr-36">
          <a href="/">
            <Logo w={60} h={60} />
          </a>
        </div>

        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full md:hidden">
          <a href="/" className="hover:outline-rose-700 hover:rounded-sm p-1 transition">
            <Logo w={50} h={50} />
          </a>

          <div className="flex-1 flex ml-5 justify-center px-3">
            <form action="/searchproduct" method="GET" className="w-full max-w-xs">
              <div className="flex items-center bg-rose-700 rounded-full px-3 py-1.5 shadow-sm">
                <input
                  name="q"
                  type="text"
                  placeholder="Search products..."
                  required
                  className="flex-1 bg-transparent w-full text-white placeholder-gray-200 px-2 py-1 text-sm focus:outline-none"
                />
                <button type="submit" className="ml-2 hover:scale-110 transition-transform">
                  <IoSearchOutline className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            <HiOutlineMenu className="w-7 h-7" />
          </button>
        </div>

        {/* Desktop Search + Catalog Button */}
        <div className="hidden md:block items-center w-[50%] mx-auto">
          <div className="flex items-center overflow-hidden">

            {/* Desktop Catalog Button */}
            <Link href="/catalog">
              <div className="flex items-center space-x-1 bg-rose-300 text-white px-1.5 py-3.5 h-full rounded-l-full hover:bg-rose-500 transition whitespace-nowrap">
                <span className="text-sm font-semibold">Catalog</span>
              </div>
            </Link>

            {/* Search Form */}
            <form action="/searchproduct" method="GET" className="flex bg-rose-700 rounded-r-full flex-1">
              <div className="flex flex-1">
                <input
                  name="q"
                  type="text"
                  placeholder="Search products..."
                  required
                  className="w-full px-5 py-2.5 text-white bg-transparent placeholder-gray-200 focus:outline-none text-sm"
                />
                <button type="submit" className="bg-rose-700 hover:bg-rose-800 px-3 transition rounded-r-full">
                  <IoSearchOutline className="w-6 h-6 text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Icons (Desktop) */}
        <div className="hidden md:flex items-center justify-end space-x-4 ml-auto">

          <Link href="/bloglist" className="flex items-center cursor-pointer hover:outline-3 hover:outline-rose-700 px-2 py-1 rounded-sm ">
            <img src="/blog.png" alt="blog" className="mr-1 w-8 h-8" />
            <span className="text-white font-semibold text-base">Blogs</span>
          </Link>

          <div onClick={() => setIsDeliverOpen(true)} className="flex items-center cursor-pointer hover:outline-3 hover:outline-rose-700 py-1 rounded-sm ">
            <img src="https://i.imghippo.com/files/FuW4002bEk.png" className="w-6 h-6 object-contain" alt="Location" />
            <div className="text-left leading-tight ml-2">
              <p className="text-white text-xs">Deliver to:</p>
              <p className="text-white font-bold text-sm max-w-28 truncate" title={deliveryLocation?.address || deliverySummary}>{deliverySummary}</p>
            </div>
          </div>

          {/* Conditional: Show Logout or Login */}
           {isUserAuthenticated ? (
             <div className="flex items-center space-x-3">
               <div className="text-white mr-3">
                 {/* Welcome, <span className="font-semibold text-pink-200">{displayUserName}</span> */}
               </div>
               <button onClick={handleLogout} className="flex items-center cursor-pointer hover:outline hover:outline-rose-700 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700">
                 <span className="text-white font-semibold text-base">Logout</span>
               </button>
             </div>
          ) : (
            <Link href='/signin' className="flex items-center gap-2 cursor-pointer hover:outline-3  hover:outline-rose-700 px-2 py-1 rounded-sm ">
              <img src="/login.png" alt="login" className="w-8 h-8 sm:w-12 sm:h-12 md:w-9 md:h-9" />
              <p className="text-white text-base font-bold">Login</p> 
             </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-rose-300 text-gray-900 px-6 py-4 space-y-4 text-lg font-medium">

          <div onClick={() => { setIsDeliverOpen(true); setIsMobileMenuOpen(false); }} className="hover:text-rose-700">
            Deliver to: {deliverySummary}
          </div>
          <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-rose-700">Catalog</Link>

          {/* Conditional: Show Logout or Login for Mobile */}
          {isUserAuthenticated ? (
            <>
              <div onClick={handleLogout} className="hover:text-rose-700 cursor-pointer">Logout</div>
            </>
          ) : (
            <Link href="signin" className="hover:text-rose-700">
              Login
            </Link>
          )}

          <Link href="/bloglist" className="hover:text-rose-700">
            Blogs
          </Link>

        </div>
      )}

      {/* Modals */}
      <DeliverModal
        isOpen={isDeliverOpen}
        onClose={closeAll}
        onLocationSaved={setDeliveryLocation}
        savedLocation={deliveryLocation}
      />
    </header>
  );
};

export default Header;
