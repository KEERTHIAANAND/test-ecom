'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Header({ cartItemCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-2" style={{marginLeft: '-25px'}}>
                <img src="/logo.png" alt="Logo" className="w-[65px] h-[65px] object-contain -mt-1" style={{marginLeft: '30px'}} />
                {/* Move container 10px more to the right */}
                <div className="flex flex-col ml-0.5">
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-black via-gray-600 to-gray-400 bg-clip-text text-transparent tracking-wider" style={{ fontFamily: 'var(--font-orbitron)' }}>
                    NXTLook
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 -mt-1 tracking-widest uppercase">Premium Style</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
              <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm lg:text-base" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Home
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm lg:text-base" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Shop
              </Link>
              <Link href="/offers" className="text-[#b8860b] font-bold drop-shadow-[0_0_8px_#b8860b] transition-colors font-medium text-sm lg:text-base" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Offers
              </Link>
              <Link href="/orders" className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm lg:text-base" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
                Orders
              </Link>
            </nav>

            {/* Right Side Actions with Search Box on the right */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative p-1 sm:p-2 text-gray-700 hover:text-purple-600 transition-colors">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <div className="relative group">
                  <button className="p-1 sm:p-2 text-gray-700 hover:text-purple-600 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs sm:text-sm">
                    <div className="py-2">
                      <div className="px-4 py-2 text-gray-700 border-b border-gray-200">
                        <p className="font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-1 sm:p-2 text-gray-700 hover:text-purple-600 transition-colors"
                  title="Sign In"
                >
                  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white absolute left-0 right-0 w-full z-50 shadow-lg">
              <nav className="flex flex-col space-y-3 text-base px-4">
                <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Shop
                </Link>
                <Link href="/offers" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Offers
                </Link>
                <Link href="/orders" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Orders
                </Link>
                {!user && (
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-left text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                )}
                {user && (
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Search Products</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white text-gray-900 placeholder-gray-500"
                  autoFocus
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Popular searches: T-shirts, Jeans, Jackets, Hoodies</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
} 