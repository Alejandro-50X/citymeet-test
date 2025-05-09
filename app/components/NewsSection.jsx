"use client"

import React, { useState, useEffect } from 'react';

const NewsSection = () => {
  const [activeCategory, setActiveCategory] = useState('local');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Categories for the sub-navbar
  const categories = [
    { id: 'local', label: 'Local News' },
    { id: 'state', label: 'State News' },
    { id: 'national', label: 'National News' },
    { id: 'international', label: 'International News' }
  ];
  
  // Function to fetch news based on the selected category
  const fetchNews = async (category) => {
    setLoading(true);
    setError(null);
    
    // Map category to appropriate search query
    const queryMap = {
      local: 'Los Angeles news',
      state: 'California news',
      national: 'US news',
      international: 'world news'
    };
    
    try {
      // Using environment variable for API key
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      
      if (!apiKey) {
        console.error('NEWS_API_KEY is not defined in environment variables');
        throw new Error('API configuration error');
      }
      
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${queryMap[category]}&apiKey=${apiKey}&pageSize=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNews(data.articles || []);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch news when the category changes
  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);
  
  // Format publication date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="w-full">
      {/* Main header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">News</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search news..." 
            className="px-4 py-2 pl-10 bg-gray-100 rounded-md"
          />
          {/* Simple SVG search icon */}
          <svg 
            className="absolute left-3 top-2.5 text-gray-500" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      
      {/* News categories tabs - we're keeping these */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex space-x-6">
          {categories.map(category => (
            <li 
              key={category.id}
              className={`pb-2 px-1 cursor-pointer ${
                activeCategory === category.id 
                  ? 'border-b-2 border-green-700 text-green-700 font-medium' 
                  : 'text-gray-600 hover:text-green-700'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </li>
          ))}
        </ul>
      </div>
      
      {/* News content */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No news articles found</div>
        ) : (
          news.map((article, index) => (
            <div key={index} className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex mb-3">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                  {article.urlToImage ? (
                    <img 
                      src={article.urlToImage} 
                      alt="News thumbnail" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium mb-1 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{article.source?.name || 'Unknown source'}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{article.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-700 text-sm font-medium hover:underline"
                >
                  Read full article
                </a>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-500 text-sm">Share</button>
                  <button className="text-gray-500 text-sm">Save</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsSection;