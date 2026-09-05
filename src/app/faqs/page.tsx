"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

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
      q: "What are the minimum order quantities (MOQ) for exports?",
      a: "Our MOQ varies by product: 20 metric tons for bulk industrial salt, 1 metric ton for gourmet or edible salts, and smaller quantities (500 kg) for samples or trial orders. We offer flexible options for first-time buyers."
    },
    {
      q: "Which countries does Saltiam export to?",
      a: "We export to over 50 countries worldwide, including the USA, UK, EU nations (Germany, France), Middle East (UAE, Saudi Arabia), Australia, Canada, and Asia (Japan, India). We comply with all local import regulations."
    },
    {
      q: "What packaging options are available?",
      a: "We offer customizable packaging: bulk jumbo bags (1-2 tons), retail pouches (500g-5kg), eco-friendly boxes, and private labeling. All packaging is moisture-proof, food-grade, and branded as per your requirements."
    },
    {
      q: "How long does shipping take, and what are the costs?",
      a: "Shipping times: 2-4 weeks for sea freight to Europe/USA, 1-2 weeks for air. Costs depend on volume and destination  contact us for a personalized quote. We partner with Maersk and DHL for competitive pricing."
    },
    {
      q: "Is Saltiam's salt organic or certified?",
      a: "Yes, select varieties like our Himalayan pink salt are certified organic (USDA Organic or equivalent) and free from additives. We provide third-party certifications upon request. Our salts are naturally mined without chemicals."
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
    <>
      {/* Main FAQ Section */}
      <section className="bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-300 min-h-screen py-16 px-6">
        <div className="max-w-4xl mx-auto">

                  {/* Header */}
                  <div className="mb-10 text-center sm:mb-12">
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-600/80">
                   OUR ANSWERS
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
                     Frequently Asked Questions
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
                      Welcome to Saltiam's FAQ page. Here, we address common questions about our premium salt products, exporting services, and more. 
                      Ready to discuss your needs?                  
                    </p>
                  </div>

          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className=" ">
                <button onClick={() => toggleAnswer(index)}
                  className="w-full text-left bg-[#ffd3b6]/80 backdrop-blur-sm p-5 cursor-pointer rounded-t-xl hover:bg-rose-200 transition-all duration-300 shadow-md hover:shadow-xl">
                  <span className="font-bold text-lg text-gray-900 flex justify-between items-center">
                    {faq.q}
                    <span className="text-2xl text-rose-700 rounded-full bg-rose-300/50 px-2  ml-4">
                      {openIndex === index ? "-" : "+"} 
                    </span>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="p-6 bg-white/90 rounded-b-xl text-gray-700 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            {/* <p className="text-xl text-gray-800 mb-6">Still have questions?</p> */}
             <p className="mb-6 text-bold text-md font-large uppercase tracking-[0.2em] text-rose-600/80">
                   Still have questions?
                    </p>
            <a
              href="https://zcal.co/saltiam-official/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-rose-500 hover:bg-rose-700 text-white font-bold text-xl px-10 py-5 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQs;