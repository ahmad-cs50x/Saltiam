"use client";
import { api } from '../../lib/apiClient';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncate = (str, length) => {
    if (!str) return '';
    const clean = str.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    return clean.length > length ? clean.slice(0, length) + '...' : clean;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs from API...');
        const res = await api.get('/api/blogs');
        console.log('Blogs received:', res.data);
        setBlogs(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalPages = Math.ceil((blogs?.length || 0) / pageSize);
  const paginatedBlogs = blogs?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-50 to-pink-50 flex items-center justify-center">
        <p className="text-2xl text-pink-700 font-bold">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-700 font-bold mb-4">Error loading blogs</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#ffd3b6] via-rose-200 to-rose-300 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      
       <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-600/80">
            Our Stories
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            Our Blogs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Discover more knowledge about the pure himaliyan salt.
          </p>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8">
          {paginatedBlogs.map((blog) => (
            // Blog card
            <Link key={blog._id} href={`/blogdetail/${blog._id}`}
              className="group flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300
               hover:shadow-2xl hover:-translate-y-3 h-full">

              {/* Image Section */}
              <div className="relative w-full h-56 sm:h-64 bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden flex-shrink-0">
                {(blog.images?.[0] || blog.image) ? (
                  <img
                    src={`/uploads/${blog.images?.[0] || blog.image}`}
                    alt={blog.title?.replace(/<[^>]*>/g, '') || 'Blog image'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-rose-200">
                    <div className="text-4xl sm:text-5xl font-bold text-pink-600 opacity-30">SALTIAM</div>
                    <p className="text-pink-600 mt-2 font-medium text-sm sm:text-base">Salt Stories</p>
                  </div>
                )}
              </div>

              {/* Text Section */}
              <div className="p-5 sm:p-6 bg-white/30  flex flex-col flex-grow">
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight hover:text-pink-700 transition"
                  dangerouslySetInnerHTML={{ __html: blog.title }}
                />
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                  {truncate(blog.contentText, 150)}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-pink-200">
                  <span className="text-rose-400 font-semibold text-sm flex items-center gap-1 hover:text-rose-600 transition-colors">
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDate(blog.createdAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="col-span-full flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-rose-500 text-white rounded disabled:opacity-50 hover:bg-rose-600 transition"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-rose-500 text-white rounded disabled:opacity-50 hover:bg-rose-600 transition"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-pink-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-pink-800 mb-2">No blogs yet</h3>
            <p className="text-gray-600">Coming soon with Himalayan salt stories!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogList;
