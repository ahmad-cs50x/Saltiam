"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/apiClient';
import { toast } from "react-toastify";

import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Link2, Image as ImageIcon, Table, Type, Palette, 
  Minus, Plus, ChevronDown 
} from 'lucide-react';

const UploadBlog = () => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imgInputRef = useRef(null);
  const spacingMenuRef = useRef(null);
  const [fontSize, setFontSize] = useState(18);
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Toolbar Commands
  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const applyLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  const insertImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => exec('insertImage', ev.target.result);
    reader.readAsDataURL(file);
  };

  const insertTable = () => {
    const rows = prompt('Number of rows?', '3');
    const cols = prompt('Number of columns?', '3');
    if (!rows || !cols) return;
    let table = '<table class="w-full border-collapse border border-pink-300 my-6">';
    for (let i = 0; i < rows; i++) {
      table += '<tr>';
      for (let j = 0; j < cols; j++) {
        table += '<td class="border border-pink-300 px-4 py-3 min-h-[40px]">Cell</td>';
      }
      table += '</tr>';
    }
    table += '</table>';
    exec('insertHTML', table);
  };

  const changeFontSize = (delta) => {
    const newSize = Math.max(12, Math.min(72, fontSize + delta));
    setFontSize(newSize);
    exec('fontSize', '7');
    document.querySelectorAll('font[size="7"]').forEach(el => {
      el.removeAttribute('size');
      el.style.fontSize = `${newSize}px`;
    });
  };

  // Line spacing handler
  useEffect(() => {
    const menu = spacingMenuRef.current;
    if (!menu) return;
    const handleChange = (e) => {
      const val = e.target.value;
      if (val === '_space-before') {
        exec('formatBlock', '<p>');
        document.execCommand('outdent');
        document.querySelectorAll('p, div, li').forEach(el => {
          el.style.marginTop = '1.5rem';
        });
      } else if (val === '_space-after') {
        document.querySelectorAll('p, div, li').forEach(el => {
          el.style.marginBottom = '1.5rem';
        });
      } else if (val) {
        document.querySelectorAll('p, div, li, h1, h2, h3').forEach(el => {
          el.style.lineHeight = val;
        });
      }
      e.target.value = '';
    };
    menu.addEventListener('change', handleChange);
    return () => menu.removeEventListener('change', handleChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titleRef.current?.innerText.trim()) {
      alert('Please add a title!');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', titleRef.current.innerHTML);
    formData.append('contentText', contentRef.current.innerHTML);
    if (bannerImage) formData.append('images', bannerImage);

    try {
      await api.post('/api/blogs', formData);
      toast.success('Blog uploaded to the database successfully!');
      router.push('/secretpanel');
    } catch (err) {
      alert('Upload failed — check server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* RESPONSIVE TOOLBAR */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 shadow-2xl border-b border-pink-800">
        <div className="flex flex-wrap items-center gap-3 p-3 overflow-x-auto scrollbar-hide ml-0 sm:ml-16">
          {/* Text Style */}
          <button onClick={() => exec('bold')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><Bold size={20} /></button>
          <button onClick={() => exec('italic')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><Italic size={20} /></button>
          <button onClick={() => exec('underline')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><Underline size={20} /></button>

          {/* Alignment */}
          <div className="w-px h-8 bg-white/30 mx-1" />
          <button onClick={() => exec('justifyLeft')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><AlignLeft size={20} /></button>
          <button onClick={() => exec('justifyCenter')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><AlignCenter size={20} /></button>
          <button onClick={() => exec('justifyRight')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><AlignRight size={20} /></button>

          {/* Lists & Link */}
          <div className="w-px h-8 bg-white/30 mx-1" />
          <button onClick={() => exec('insertUnorderedList')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><List size={20} /></button>
          <button onClick={() => exec('insertOrderedList')} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><ListOrdered size={20} /></button>
          <button onClick={applyLink} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><Link2 size={20} /></button>

          {/* Media */}
          <div className="w-px h-8 bg-white/30 mx-1" />
          <input ref={imgInputRef} type="file" accept="image/*" onChange={insertImage} className="hidden" />
          <button onClick={() => imgInputRef.current?.click()} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><ImageIcon size={20} /></button>
          <button onClick={insertTable} className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-white"><Table size={20} /></button>

          {/* Font Size */}
          <div className="w-px h-8 bg-white/30 mx-1" />
          <div className="flex items-center bg-white/20 rounded-lg px-2 py-1.5 text-sm">
            <button onClick={() => changeFontSize(-2)} className="text-white hover:bg-white/20 p-1 rounded"><Minus size={16} /></button>
            <span className="text-white font-bold mx-2 min-w-[2rem] text-center">{fontSize}</span>
            <button onClick={() => changeFontSize(2)} className="text-white hover:bg-white/20 p-1 rounded"><Plus size={16} /></button>
          </div>

          {/* Line Spacing */}
          <select ref={spacingMenuRef} defaultValue="" className="bg-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-black font-medium border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400">
            <option value="" disabled>Line Ht</option>
            <option value="1">Single</option>
            <option value="1.5">1.5</option>
            <option value="1.75">1.75</option>
            <option value="2">Double</option>
            <option value="_space-before">+ Before</option>
            <option value="_space-after">+ After</option>
          </select>

          {/* Color */}
          <input type="color" onChange={(e) => exec('foreColor', e.target.value)} className="w-10 h-9 rounded-lg cursor-pointer bg-white/20 border border-white/30" title="Text Color" />
          
          {/* Font */}
          <select onChange={(e) => exec('fontName', e.target.value)} className="bg-white/20 text-white rounded-lg px-3 text-black py-2 text-xs sm:text-sm font-medium max-w-[100px]">
            <option value="">Font</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Roboto">Roboto</option>
            <option value="Poppins">Poppins</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
      </div>

      {/* MAIN EDITOR � RESPONSIVE */}
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8 px-4 sm:py-12">
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 sm:p-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Create New Blog</h1>
              <p className="text-pink-100 mt-2 text-sm sm:text-base">Share your Himalayan salt wisdom with the world</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              {/* Title */}
              <div>
                <label className="block text-black text-xl sm:text-2xl font-bold text-pink-800 mb-4">Blog Title</label>
                <div
                  ref={titleRef}
                  contentEditable
                  className="w-full p-4 sm:p-6 text-3xl sm:text-4xl font-bold text-center text-gray-800 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-dashed border-pink-300 focus:outline-none focus:border-pink-500 transition-all min-h-[100px] sm:min-h-[120px]"
                  placeholder="Enter your amazing title..."
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block  text-xl sm:text-2xl font-bold text-pink-800 mb-4">Blog Content</label>
                <div
                  ref={contentRef}
                  contentEditable
                  className="w-full text-black min-h-96 p-6 sm:p-8 bg-white rounded-2xl border-2 border-pink-200 focus-within:border-pink-500 transition-all prose prose-lg max-w-none focus:outline-none"
                  style={{ lineHeight: '1.8' }}
                />
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-lg sm:text-xl font-bold text-pink-800 mb-4">Banner Image (Optional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-4 border-dashed border-pink-300 rounded-2xl cursor-pointer bg-pink-50 hover:bg-pink-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 mb-4" />
                      <p className="mb-2 text-base sm:text-lg text-pink-700 font-semibold">Click to upload banner</p>
                      <p className="text-xs sm:text-sm text-pink-600">PNG, JPG up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => setBannerImage(e.target.files[0])} accept="image/*" />
                  </label>
                </div>
                {bannerImage && (
                  <p className="mt-3 text-green-600 font-medium text-center text-sm sm:text-base">Selected: {bannerImage.name}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6 sm:pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>Uploading...</>
                  ) : (
                    <>Upload Blog</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Hide scrollbar but keep functionality */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default UploadBlog;