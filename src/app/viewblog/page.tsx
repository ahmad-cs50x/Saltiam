"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Logo from "../../../components/Logo"; 
import { api } from '../../lib/apiClient';

const ViewBlog = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Blog ID is missing.');
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs/${id}`);
        setBlog(res.data);
        console.log('Fetched blog data:', res.data);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error || 'Failed to load blog post.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#ffd3b6] to-rose-300">
        <p className="text-2xl font-bold text-pink-800">Loading...</p>
      </div>
    );

  if (error || !blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#ffd3b6] to-rose-300 px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-lg">
          <p className="text-2xl font-bold text-pink-800 mb-3">Blog could not be loaded</p>
          <p className="text-gray-600 mb-6">{error || 'This blog post is unavailable right now.'}</p>
          <Link href="/secretpanel" className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition">
            Back to dashboard
          </Link>
        </div>
      </div>
    );

  return (
    <section className="min-h-screen bg-rose-300 py-8 px-1 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <article className="bg-white rounded-2xl overflow-hidden">
          {/* Title */}
          <header className="px-5 sm:px-8 mt-0 sm:mt-4 lg:px-12 mb-3 lg:pt-12 lg:pb-8">
            <h3
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
              dangerouslySetInnerHTML={{ __html: blog.title }}
            />
          </header>

          {/* Author + Date */}
          <div className="px-5 sm:px-8 lg:px-12 pb-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  <Logo w={55} h={55} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Saltiam Team</p>
                  <p className="text-xs sm:text-sm">Himalayan Salt Experts</p>
                </div>
              </div>
              <div className="sm:ml-auto text-xs sm:text-sm text-gray-500">
                Published on {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          { ((blog.images?.length > 0 && blog.images[0]) || blog.image) ? (
            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-120 xl:h-140 overflow-hidden bg-gray-100">
              <img
                src={`/uploads/${ (blog.images?.length > 0 && blog.images[0]) || blog.image}`}
                alt={blog.title.replace(/<[^>]*>/g, '')}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : null }

          {/* Intro Paragraph */}
          <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-medium leading-relaxed italic border-l-4 border-rose-500 pl-4 sm:pl-6">
              {(blog.contentText || blog.content || '')
                .replace(/<[^>]+>/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 280)}...
            </p>
          </div>

          {/* Main Content */}
          <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 prose prose-lg max-w-none text-gray-800 leading-relaxed \n                           prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-rose-600 hover:prose-a:text-rose-700">
            <div dangerouslySetInnerHTML={{ __html: blog.contentText || blog.content || '' }} />
          </div>

          {/* Gallery */}
          {blog.images && blog.images.length > 1 && (
            <div className="px-5 pb-10 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {blog.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={`/uploads/${img}`}
                    alt={`Blog Image ${index + 2}`}
                    className="w-full h-56 sm:h-64 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="px-5 pb-10 sm:px-8 lg:px-12 flex justify-center sm:justify-end">
            <Link
              href="/secretpanel"
              className="inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-rose-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:bg-rose-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to dashboard
            </Link>
          </div>
        </article>
        {/* Mobile bottom spacing */}
        <div className="h-20 sm:hidden" />
      </div>
    </section>
  );
};

export default ViewBlog;