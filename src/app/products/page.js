'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import ProductGrid from '../../components/ProductGrid';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [flashMsg, setFlashMsg] = useState(null);

  // Get cart count from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  }, []);

  const handleAddToCart = async (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Check if product already exists in cart with same size and color
    const existingItemIndex = existingCart.findIndex(item =>
      item.id === product.id &&
      item.selectedSize === product.selectedSize &&
      item.selectedColor === product.selectedColor
    );
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      existingCart[existingItemIndex].quantity += product.quantity;
    } else {
      // Add new item to cart
      existingCart.push(product);
    }
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));

    // Sync cart with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items: existingCart })
        });
      } catch (err) {
        // Optionally handle error (e.g., show a message)
      }
    }

    // Show flash message
    setFlashMsg('Successfully added to cart!');
    setTimeout(() => setFlashMsg(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={cartItemCount} />
      <div className="pt-16">
        <ProductGrid onAddToCart={handleAddToCart} />
      </div>
      {/* Flash Message */}
      {flashMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center w-56 h-56 bg-green-100 border border-green-300 rounded-2xl shadow-2xl animate-flash-in">
            <svg className="w-16 h-16 text-green-600 mb-4 animate-tick" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-semibold text-xl text-center">{flashMsg}</span>
          </div>
          <style jsx>{`
            @keyframes flash-in {
              0% { opacity: 0; transform: scale(0.8); }
              60% { opacity: 1; transform: scale(1.08); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-flash-in {
              animation: flash-in 0.5s cubic-bezier(0.4,0,0.2,1) both;
            }
            @keyframes tick {
              0% { stroke-dasharray: 0 24; }
              60% { stroke-dasharray: 24 0; }
              100% { stroke-dasharray: 24 0; }
            }
            .animate-tick path {
              stroke-dasharray: 24 0;
              stroke-dashoffset: 0;
              animation: tick 0.7s cubic-bezier(0.4,0,0.2,1) both;
            }
          `}</style>
        </div>
      )}
    </div>
  );
} 