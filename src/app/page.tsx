"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  // Reference for the certification section
  const certSectionRef = useRef(null);
  // State to control animation
  const [isCertAnimationActive, setIsCertAnimationActive] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        const featured = products.filter((p: any) => p.isFeatured === true);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Intersection Observer for certificate section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsCertAnimationActive(true);
          } else {
            setIsCertAnimationActive(false);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px"
      }
    );

    if (certSectionRef.current) {
      observer.observe(certSectionRef.current);
    }

    return () => {
      if (certSectionRef.current) {
        observer.unobserve(certSectionRef.current);
      }
    };
  }, []);

  const certifications = [
    { name: "ISO 9001:2015", image: "/certificate 1.png" },
    { name: "ISO 14001:2015", image: "/certificate 2.png" },
    { name: "URC Certified", image: "/certificate 3.png" },
    { name: "Halal Certified", image: "/certificate 4.png" },
    { name: "NON-GMO Certified", image: "/certificate 5.png" },
    { name: "FDA Certified", image: "/certificate 6.png" },
    { name: "VEGAN Certified", image: "/certificate 7.png" },
  ];

  

  const [openIndex, setOpenIndex] = useState(null);

  const normalizeImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    if (img.startsWith('http') || img.startsWith('data:') || img.startsWith('/uploads/') || img.startsWith('uploads/')) return img;
    return `/uploads/${img}`;
  };

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "What types of salt does Saltiam export?",
      a: "Saltiam specializes in exporting a wide range of high-quality salts, including Himalayan pink salt (fine, coarse, and gourmet varieties), sea salt, rock salt, industrial salt, and specialty salts like black salt and iodized salt. Our products are sourced from trusted mines and coastal regions in Pakistan, India, and other premium locations."
    },
    {
      q: "Where does Saltiam source its salt from?",
      a: "We source our salt primarily from the renowned Khewra Salt Mine in Pakistan, known as the world's second-largest salt mine, as well as sustainable sea salt operations in the Arabian Sea and Himalayan regions. All our suppliers adhere to international quality standards, ensuring purity and traceability."
    },
    {
      q: "What are the quality standards for Saltiam's products?",
      a: "All Saltiam products meet or exceed international standards such as ISO 22000 for food safety, HACCP for hazard analysis, and FDA/EU regulations for exports. We conduct rigorous lab testing for purity, moisture content, and contaminants to guarantee premium quality. Certificates are provided with each shipment."
    },
    {
      q: "How does the salt exporting process work with Saltiam?",
      a: "Our process is straightforward: 1) Inquiry and quote request; 2) Sample provision and order confirmation; 3) Production and quality checks; 4) Packaging in eco-friendly materials; 5) Shipping via sea, air, or land with full documentation; 6) Delivery tracking. We handle customs and logistics for seamless international export."
    },
    {
      q: "How long does shipping take, and what are the costs?",
      a: "Shipping times: 2-4 weeks for sea freight to Europe/USA, 1-2 weeks for air. Costs depend on volume and destination  contact us for a personalized quote. We partner with Maersk and DHL for competitive pricing."
    },
    {
      q: "How can I place an order or get a quote?",
      a: (
        <>Simply email us at <strong>info@saltiam.com</strong>, call us, or{" "}
          <Link href="/contactus" className="text-pink-600 font-bold hover:underline">click here to contact us</Link>. 
          We respond within 24 hours!</>
      )
    }
  ];

  return (
    <div className="flex flex-col bg-[#ffd3b6] text-gray-800">
      
{/* Hero Section - Fully Responsive */}
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffd3b6]/80 via-[#ff9a9e]/80 to-[#ffd3b6]/80 py-16 sm:py-20 lg:py-28">
      
      {/* Background Image with Blur */}
      <div className="absolute h-[120%] inset-0 z-0">
          <Image
            src="/hero bg.jpg"
            alt="Maras Salt Pans in Peru"
            fill
            quality={75}
            className="object-cover blur-xs"
            priority
          />
       <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto  mb-6 px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Text Content */}
        <div className="text-center w-[100%] lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">

          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-16 font-extrabold text-pink-900 leading-tight tracking-tight drop-shadow-sm">
            The Beauty of Nature
          </p>
          <p className="text-4xl sm:text-5xl md:text-6xl -mt-10 lg:text-7xl font-extrabold text-pink-700 leading-tight tracking-tight drop-shadow-sm">
        In Every Grain
          </p>
           
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-950 font-medium max-w-2xl mx-auto lg:mx-0 drop-shadow-sm">
            Discover pure Himalayan pink salt, delicately crafted by nature and brought to you by Saltiam. A touch of purity and wellness for your table.
          </p>

          <div className="pt-4 flex justify-center lg:justify-start">
            <Link href="/catalog" className="group inline-flex items-center gap-3 bg-gradient-to-r from-rose-600 to-pink-700
             text-white font-bold text-lg sm:text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-rose-500/30 transform hover:-translate-y-1 transition-all duration-300" >
              Explore Products
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        </div>
    </section>

      {/* Industries Section */}
      <section className="bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-300 py-16 px-5 sm:px-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pink-700 mb-10">Industries We Serve</h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg mb-12">
          Saltiam supplies premium Himalayan and Sea Salt to major global industries — ensuring purity, quality, and consistency for every need.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 px-0 sm:px-12">

          <div className="bg-rose-200 px-1 sm:p-6 rounded-2xl shadow-lg">
            <img src="https://i.ibb.co/TBMwYTXc/cutlery.png" alt="Food Processing" className="rounded-xl mb-4 mx-auto w-32 h-32 object-contain"/>
            <h3 className="text-xl font-bold text-pink-700">Food Processing</h3>
            <p className="text-gray-600 mt-2 text-sm">High-grade edible salt for manufacturers, bakeries & seasoning companies.</p>
          </div>

          <div className="bg-rose-200 p-1 sm:p-6 rounded-2xl shadow-lg">
            <img src="https://i.ibb.co/HTMmDs3n/spa.png" alt="Spa & Wellness" className="rounded-xl mb-4 mx-auto w-32 h-32 object-contain"/>
            <h3 className="text-xl font-bold text-pink-700">Spa & Wellness</h3>
            <p className="text-gray-600 mt-2 text-sm">Mineral-rich bath salts and lamps for luxury spas worldwide.</p>
          </div>

          <div className="bg-rose-200 p-1 sm:p-6 rounded-2xl shadow-lg">
            <img src="https://i.ibb.co/JR1NtR8x/shelf.png" alt="Hospitality & Decor" className="rounded-xl mb-4 mx-auto w-32 h-32 object-contain"/>
            <h3 className="text-xl font-bold text-pink-700">Hospitality & Decor</h3>
            <p className="text-gray-600 mt-2 text-sm">Salt lamps, candle holders & décor for hotels and designers.</p>
          </div>

        <div className="bg-rose-200 p-1 sm:p-6 rounded-2xl shadow-lg">
          <img src="https://i.ibb.co/0VFqTVN3/product-development.png" alt="Wholesale & Private Label" className="rounded-xl mb-4 mx-auto w-32 h-32 object-contain"/>
          <h3 className="text-xl font-bold text-pink-700">Wholesale & Private Label</h3>
          <p className="text-gray-600 mt-2 text-sm">Custom packaging solutions for global brands and retailers.</p>
        </div>

        </div>
      </section>

   {/* ABOUT US */}
    <section className="bg-gradient-to-b from-rose-300 via-rose-300 to-rose-300 py-16 px-6 sm:px-8 lg:px-12 ">
     <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16  items-center">

      {/* Text Content - Left on Desktop, Top on Mobile */}
      <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
        <div className="inline-block">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl my-5 font-bold text-pink-700">
            Pure Himalayan Salt
          </h2>
          <p className="text-lg sm:text-xl mt-3 text-pink-800 font-medium">
            From Ancient Mountains to Your Home
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-2xl border border-pink-100">
          <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium">
            At <span className="text-pink-700 font-bold">Saltiam</span>, we bring the purity of the Himalayan mountains directly to your table. 
            Our salts are <span className="text-rose-600 font-semibold">ethically sourced</span>, <span className="text-rose-600 font-semibold">naturally harvested</span>, 
            and beautifully crafted — because you deserve the best that nature has to offer.
          </p>
        </div>

        <div className="flex justify-center lg:justify-start">
          <Link href="/about" 
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-lg sm:text-xl px-8 py-5 rounded-full shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300">
            Discover Our Story
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Image - Right on Desktop, Bottom on Mobile */}
      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
        <div className="relative">
          {/* Main Image */}
          <img src="https://i.imghippo.com/files/IGZQ5172KGs.jpg" alt="Pure Salt" 
          className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-3xl shadow-2xl border-8 border-white/90"/>
          
          {/* Floating Decorative Element */}
          <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl w-32 h-32 sm:w-40 sm:h-40 opacity-20 blur-3xl"></div>
          <div className="absolute -top-6 -right-6 bg-gradient-to-tr from-amber-400 to-pink-400 rounded-3xl w-24 h-24 sm:w-32 sm:h-32 opacity-30 blur-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</section>

   {/* Certification Section*/}
      <section   ref={certSectionRef} className="py-16 bg-rose-300 overflow-hidden"
      >
  <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pink-700">
        Certificates of Excellence
      </h2>
      <p className="mt-4 text-lg sm:text-xl text-gray-600 font-medium">
        Proudly recognized by global standards
      </p>
    </div>

    {/* Infinite Sliding Track */}
    <div className="w-full overflow-hidden inline-flex flex-nowrap">
      <div 
        className={`flex gap-10 sm:gap-16 w-max items-center py-4 ${
          isCertAnimationActive ? 'animate-infinite-scroll' : ''
        }`}
        style={{
          animationPlayState: isCertAnimationActive ? 'running' : 'paused'
        }}
      >
        {/* Combined & Duplicated Set for Perfect Loop */}
        {[...certifications, ...certifications].map((cert: any, index: number) => (
          <div
            key={index}
            className="flex-shrink-0 w-52 sm:w-60 lg:w-72 bg-white rounded-3xl p-6"
          >
            <img
              src={cert.image}
              alt={cert.name}
              className="w-full h-32 sm:h-40 object-contain"
              loading="lazy"
            />
            <p className="text-center mt-6 text-sm sm:text-lg font-bold text-gray-800 tracking-wide">
              {cert.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Featured product */}
      <section className="bg-rose-300 py-16 px-5 sm:px-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl  font-bold text-pink-700 mb-6 md:mb-16">Featured Products</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 px-0 sm:px-12">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product: any) => (
              <Link key={product._id} href={`/productdetail/${product._id}`} className="block group">
                <div className="bg-rose-200 p-1 sm:p-6 w-64 rounded-2xl shadow-lg h-full flex flex-col">
                  <div className="h-48 w-full bg-white rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                    <img 
                      src={normalizeImageUrl(product.images?.[0]) || "/placeholder-product.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-pink-700 line-clamp-1 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600 text-lg">No featured products selected yet.</p>
            </div>
          )}
        </div>
      </section>

     {/* Book a Meeting Section  */}
      <section className="bg-gradient-to-b from-rose-300 via-rose-400 to-rose-300 py-16 px-5 sm:px-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl  font-bold text-pink-700 mb-6">Get a Quote</h2>
        <p className="max-w-3xl mx-auto text-gray-800 text-base sm:text-lg mb-12 px-4">
          Ready to discuss bulk orders, custom packaging, or business partnerships? 
          Schedule a call with our export team or send us an inquiry instantly.
        </p>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8">

          {/* Book a Meeting Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <div className="bg-rose-100 p-5 rounded-full">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-4">Book a Meeting</h3>
            <p className="text-gray-700 mb-8 text-sm sm:text-base leading-relaxed">
              Speak directly with our export specialists. Schedule a 30-minute call at your convenience.
            </p>
            <a 
              href="https://zcal.co/saltiam-official/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto bg-rose-500 text-white px-8 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-rose-600 transition shadow-lg"
            >
              Schedule Now →
            </a>
          </div>

          {/* Send Inquiry / Get Quote Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition duration-300 transform hover:-translate-y-2">
            <div className="flex justify-center mb-6">
              <div className="bg-rose-100 p-5 rounded-full">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-4">Send an Inquiry</h3>
            <p className="text-gray-700 mb-8 text-sm sm:text-base leading-relaxed">
              Need a quick quote? Tell us your requirements and we’ll reply within 24 hours.
            </p>
            <Link 
              href="/sendaninquiry" 
              className="inline-block w-full sm:w-auto bg-rose-500 text-white px-8 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-rose-600 transition shadow-lg"
            >
              Get Quote Now →
            </Link>
          </div>
        </div>

      </section>

        {/* FAQ Section */}
      <section className="bg-gradient-to-b from-rose-300 via-rose-400 to-rose-500 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-pink-700 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-center text-gray-800 text-lg mb-12 max-w-3xl mx-auto">
            Welcome to Saltiam's FAQ page. Here, we address common questions about our premium salt products, exporting services, and more. 
            Ready to discuss your needs?
          </p>

          <div className="space-y-6">
            {faqs.map((faq: any, index: number) => (
              <div key={index} className="bg-rose-300 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <button onClick={() => toggleAnswer(index)}
                  className="w-full text-left p-5 hover:bg-rose-300/50 transition-all duration-300 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900 pr-4">
                    {faq.q}
                  </span>
                  <span className="text-2xl font-bold text-pink-700 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-6 bg-white/90 text-gray-700 leading-relaxed border-t border-rose-100">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>

    </div>
  );
};

export default Home;
