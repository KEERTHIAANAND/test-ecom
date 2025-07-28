'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { products, categories } from '../data/products';

export default function ProductGrid({ onAddToCart }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const defaultSubCategory = 't-shirts';
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    let filtered = products;

    // Filter by subcategory
    const filterCategory = selectedSubCategory || defaultSubCategory;
    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [selectedSubCategory, searchQuery, sortBy]);

  // Helper to close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.category-dropdown')) {
        setSelectedMainCategory(null);
      }
    };
    if (selectedMainCategory) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [selectedMainCategory]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    if (showSortDropdown) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSortDropdown]);

  // Use the passed onAddToCart handler if provided
  const handleAddToCart = onAddToCart || (() => {});

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
      {/* Filters and Search */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row w-full items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="max-w-xs w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-[400px] px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Category Dropdowns Centered */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              {categories.map((cat) => {
                return (
                  <div key={cat.id} className="relative category-dropdown">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${selectedMainCategory === cat.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-200 text-gray-700 border-gray-200 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white'}`}
                      onClick={() => setSelectedMainCategory(selectedMainCategory === cat.id ? null : cat.id)}
                      type="button"
                    >
                      {cat.name}
                    </button>
                    {/* Dropdown */}
                    {selectedMainCategory === cat.id && (
                      <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-20">
                        {cat.subcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setSelectedSubCategory(sub.id);
                              setSelectedMainCategory(null);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                              selectedSubCategory === sub.id
                                ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Sort By */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 focus:bg-gray-200 transition-colors"
              onClick={() => setShowSortDropdown((v) => !v)}
              aria-label="Sort"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 12h12M9 17h6" />
              </svg>
            </button>
            {showSortDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg border border-gray-100 z-30">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => { setSortBy('name'); setShowSortDropdown(false); }}
                >
                  Name
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${sortBy === 'price-low' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => { setSortBy('price-low'); setShowSortDropdown(false); }}
                >
                  Price: Low to High
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${sortBy === 'price-high' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => { setSortBy('price-high'); setShowSortDropdown(false); }}
                >
                  Price: High to Low
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${sortBy === 'rating' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}
                >
                  Rating
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch justify-items-center">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex flex-col h-full w-full items-center justify-center">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
} 