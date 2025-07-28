'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import React from 'react'; // Added missing import for React

export default function OffersPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinQueue, setSpinQueue] = useState([]); // for animating activeIdx
  const wheelRef = useRef(null);
  const [hasSpun, setHasSpun] = useState(false); // track if user has spun at least once

  const offers = [
    {
      id: 1,
      title: 'Winter Sale',
      description: 'Enjoy up to 50% off on select items this winter. No minimum purchase required. Available for all customers!',
      discount: '50% OFF',
      code: 'WINTER50',
      validUntil: '2025-10-01',
    },
    {
      id: 2,
      title: 'Free Shipping',
      description: 'Get free shipping on all orders above $49. No code needed. Offer valid for everyone!',
      discount: 'Free Shipping',
      code: 'FREESHIP',
      validUntil: '2025-12-31',
    },
    {
      id: 3,
      title: 'Buy 1 Get 1',
      description: 'Buy one, get one free on select products. No restrictions—everyone can enjoy!',
      discount: 'BOGO',
      code: 'BOGO24',
      validUntil: '2025-11-15',
    },
    {
      id: 4,
      title: 'Flat $20 Off',
      description: 'Get $20 off on orders over $100. Open to all customers!',
      discount: '$20 OFF',
      code: 'SAVE20',
      validUntil: '2025-12-01',
    },
    {
      id: 5,
      title: 'Weekend Flash Deal',
      description: 'Extra 15% off on all products this weekend. No restrictions—everyone can use!',
      discount: '15% OFF',
      code: 'FLASH15',
      validUntil: '2025-10-20',
    },
    {
      id: 6,
      title: 'Mega Clearance',
      description: 'Clearance sale: up to 70% off on last season’s styles. Available for all shoppers!',
      discount: 'Up to 70% OFF',
      code: 'CLEAR70',
      validUntil: '2025-12-15',
    },
  ];

  const wheelRadius = 220; // px
  const centerX = 0;
  const centerY = 0;
  const angleStep = 360 / offers.length;

  // Helper to get a random offer index different from current
  const getRandomIdx = () => {
    let idx = Math.floor(Math.random() * offers.length);
    while (idx === activeIdx && offers.length > 1) {
      idx = Math.floor(Math.random() * offers.length);
    }
    return idx;
  };

  // Spin handler (animates activeIdx for a smooth effect)
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const targetIdx = getRandomIdx();
    // Reduce spin time: fewer full spins
    let steps = (targetIdx - activeIdx + offers.length) % offers.length + offers.length * 2; // 2 full spins
    const queue = [];
    for (let i = 1; i <= steps; i++) {
      queue.push((activeIdx + i) % offers.length);
    }
    setSpinQueue(queue);
  };

  // Animate the spin by updating activeIdx from the queue
  React.useEffect(() => {
    if (spinQueue.length === 0) return;
    const timeout = setTimeout(() => {
      setActiveIdx(spinQueue[0]);
      setSpinQueue(spinQueue.slice(1));
      if (spinQueue.length === 1) {
        setIsSpinning(false);
        setHasSpun(true);
      }
    }, Math.max(30, 120 - spinQueue.length * 2)); // faster decelerate
    return () => clearTimeout(timeout);
  }, [spinQueue]);

  // Reset cap when spinning starts
  React.useEffect(() => {
    if (isSpinning) setHasSpun(false);
  }, [isSpinning]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1333] via-[#2d225a] to-[#3a2d6d]">
      <Header />
      {/* Hero Banner */}
      <section className="relative flex flex-col items-center justify-center py-16 sm:py-24 mb-12 bg-gradient-to-r from-[#2d225a] to-[#b8860b] shadow-xl rounded-b-3xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-widest" style={{ fontFamily: 'Orbitron, Arial, sans-serif', letterSpacing: '0.12em' }}>
          Premium Offers
        </h1>
        <p className="text-xl sm:text-2xl text-yellow-100 max-w-2xl text-center mb-6 font-medium">
          Spin the wheel to discover exclusive deals and luxury savings on top brands!
        </p>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-sm opacity-70" />
      </section>

      {/* Interactive Spinning Wheel + Offer Details Side by Side */}
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[500px] relative z-10 gap-8 md:gap-36 w-full max-w-6xl mx-auto px-2 mt-28">
        {/* Wheel Section */}
        <div className="flex flex-col items-center justify-center w-[320px] sm:w-[420px]">
          <div className="relative w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] flex-shrink-0 flex items-center justify-center">
            {/* Fixed Pointer/Arrow at the top center of the wheel (moved further down) */}
            <div className="absolute left-1/2 top-20 -translate-x-1/2 z-40 select-none pointer-events-none">
              <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="24,0 44,28 4,28" fill="#facc15" stroke="#b8860b" strokeWidth="3" />
                <polygon points="24,6 38,26 10,26" fill="#fffbe6" />
              </svg>
            </div>
            {/* Centered 'Offers' text */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-yellow-500 drop-shadow-lg tracking-widest uppercase" style={{ fontFamily: 'Orbitron, Arial, sans-serif', letterSpacing: '0.12em' }}>
                Offers
              </span>
            </div>
            {offers.map((offer, idx) => {
              const angle = (idx - activeIdx) * angleStep;
              const rad = (angle * Math.PI) / 180;
              const x = centerX + wheelRadius * Math.sin(rad);
              const y = centerY - wheelRadius * Math.cos(rad);
              // Calculate which offer is visually at the top (under the pointer)
              const isActive = idx === activeIdx && !isSpinning;
              return (
                <div
                  key={offer.id}
                  className={`absolute left-1/2 top-1/2 transition-all duration-300 ${isSpinning ? 'z-10 scale-90 opacity-70' : isActive ? 'z-20 scale-110' : 'z-10 scale-90 opacity-70'}`}
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    filter: isActive ? 'drop-shadow(0 4px 24px #ffe066)' : 'none',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                >
                  <div className={`rounded-full border-4 ${isSpinning ? 'border-yellow-200 bg-yellow-50' : isActive ? 'border-yellow-400 bg-white' : 'border-yellow-200 bg-yellow-50'} shadow-xl w-28 h-28 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 p-2`}>
                    <span className="block text-4xl sm:text-5xl" role="img" aria-label="mystery gift">
                      🎁
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Spin Button below the wheel */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`mt-12 px-10 py-4 rounded-full text-2xl font-extrabold shadow-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 ${isSpinning ? 'opacity-60 cursor-not-allowed' : ''}`}
            style={{ fontFamily: 'Orbitron, Arial, sans-serif', letterSpacing: '0.12em' }}
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
        {/* Active Offer Details */}
        <div className="mt-10 md:mt-0 bg-white/90 rounded-2xl shadow-2xl p-8 max-w-xl w-full flex flex-col items-center animate-offer-detail relative overflow-hidden">
          {/* Gift Box Cap Cover */}
          <div
            className={`absolute left-0 top-0 w-full h-1/2 flex items-end justify-center transition-transform duration-700 z-20 ${hasSpun && !isSpinning ? '-translate-y-full' : 'translate-y-0'}`}
            style={{ background: 'linear-gradient(90deg, #facc15 60%, #fffbe6 100%)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', boxShadow: '0 8px 24px 0 #b8860b33' }}
          >
            {/* Cap Ribbon */}
            <div className="w-16 h-3 rounded-b-lg bg-[#b8860b] mb-2"></div>
          </div>
          {/* Offer Details (hidden under cap until revealed) */}
          <div className={`transition-opacity duration-500 ${hasSpun && !isSpinning ? 'opacity-100' : 'opacity-0'}`}>
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold px-6 py-2 rounded-full text-xl mb-4 shadow-md animate-pulse">{offers[activeIdx].discount}</span>
            <h2 className="text-3xl font-bold text-yellow-900 mb-2 text-center" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>{offers[activeIdx].title}</h2>
            <p className="text-gray-800 mb-4 text-center">{offers[activeIdx].description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-base text-yellow-900">Code: <span className="font-mono text-yellow-900 font-bold">{offers[activeIdx].code}</span></span>
              <span className="text-sm text-yellow-800">Valid until: {formatDate(offers[activeIdx].validUntil)}</span>
            </div>
            <Link
              href="/products"
              className="mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 text-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-10 text-white text-center shadow-2xl max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>Stay Updated with Latest Offers</h2>
        <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about exclusive deals, 
          new arrivals, and special promotions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          />
          <button className="bg-white text-yellow-700 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-featured-offer-banner {
          animation: featuredOfferGlow 1.6s cubic-bezier(0.4,0,0.2,1) infinite alternate;
        }
        @keyframes featuredOfferGlow {
          0% { box-shadow: 0 0 0px #ffe066, 0 0 0px #b8860b; }
          100% { box-shadow: 0 0 32px #ffe066, 0 0 8px #b8860b; }
        }
        .animate-offer-detail {
          animation: offerDetailFadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes offerDetailFadeIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
} 