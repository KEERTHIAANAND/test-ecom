"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { products, categories } from '../data/products';
import Head from 'next/head';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);
  useEffect(() => {
    const timer1 = setTimeout(() => setDoorOpen(true), 1200); // start door opening
    const timer2 = setTimeout(() => setShowSplash(false), 2600); // remove splash
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Banner carousel logic
  const bannerImages = [
    '/Banner/b4.png',
    '/Banner/b1.png',
    '/Banner/b2.png',
    '/Banner/b3.png',
  ];
  const [currentBanner, setCurrentBanner] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [currentBanner, bannerImages.length]);

  const goToBanner = (idx) => setCurrentBanner(idx);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % bannerImages.length);

  // Flash message state
  const [flashMsg, setFlashMsg] = useState(null);

  // Handler for add to cart from featured products
  const handleAddToCart = (product) => {
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
    // Show flash message
    setFlashMsg('Successfully added to cart!');
    setTimeout(() => setFlashMsg(null), 3000);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
        {/* Left Door */}
        <div className={`fixed top-0 left-0 h-full w-1/2 bg-gray-900 transition-transform duration-[1400ms] ease-in-out ${doorOpen ? '-translate-x-full' : 'translate-x-0'}`}></div>
        {/* Right Door */}
        <div className={`fixed top-0 right-0 h-full w-1/2 bg-gray-900 transition-transform duration-[1400ms] ease-in-out ${doorOpen ? 'translate-x-full' : 'translate-x-0'}`}></div>
        {/* Brand Name */}
        <span
          className={`text-6xl sm:text-8xl font-black tracking-widest splash-door-text transition-opacity duration-500 ${doorOpen ? 'opacity-0' : 'opacity-100'}`}
          style={{ fontFamily: 'Orbitron, Arial, sans-serif', color: '#fff', zIndex: 60, position: 'absolute' }}
        >
          NXTLook
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Raleway:wght@700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <Header />
      {/* Banner Carousel */}
      <section className="relative w-full mx-auto overflow-hidden" style={{maxWidth: '100vw', height: '100vh'}}>
        <div className="relative w-screen h-screen">
          <div
            className="absolute inset-0 flex transition-transform duration-400 ease-in-out"
            style={{
              width: `calc(${bannerImages.length} * 100vw)`,
              height: '100vh',
              transform: `translateX(-${currentBanner * 100}vw)`,
            }}
          >
            {bannerImages.map((img, idx) => (
              <div key={idx} className="flex-shrink-0 flex items-center justify-center" style={{width: '100vw', height: '100vh'}}>
                <img
                  src={img}
                  alt={`Offer banner ${idx + 1}`}
                  style={{display: 'block', width: '100vw', height: '100vh', objectFit: 'contain'}}
                />
              </div>
            ))}
          </div>
          {/* Manual Controls */}
          <button onClick={prevBanner} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextBanner} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Progress Bar Overlayed at Bottom Center */}
          <div className="absolute left-1/2 bottom-8 -translate-x-1/2 z-50 w-40 flex justify-center items-center">
            <div className="relative w-full h-1 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-1 bg-gray-800 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentBanner + 1) / bannerImages.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div> {/* end of banner carousel container */}
      </section>

      {/* Trusted Brands Marquee Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
            Our Trusted Brands
          </h2>
          <div className="overflow-hidden whitespace-nowrap relative">
            <div
              className="inline-block animate-marquee"
              style={{ animation: 'marquee 22s linear infinite' }}
            >
              {[
                { src: '/brands/nike.svg', alt: 'Nike' },
                { src: '/brands/adidas.svg', alt: 'Adidas' },
                { src: '/brands/puma.svg', alt: 'Puma' },
                { src: '/brands/levi.svg', alt: 'Levi&apos;s' },
                { src: '/brands/calvin-klein.svg', alt: 'Calvin Klein' },
                { src: '/brands/allen-solly.svg', alt: 'Allen Solly' },
                { src: '/brands/zara.svg', alt: 'Zara' },
                { src: '/brands/h&m.svg', alt: 'H&M' },
                { src: '/brands/bata.svg', alt: 'Bata' },
                { src: '/brands/apple.svg', alt: 'Apple' },
                { src: '/brands/Tommy_Hilfiger.svg', alt: 'Tommy Hilfiger' },
                { src: '/brands/fossil.svg', alt: 'Fossil' },
                { src: '/brands/fastrack.svg', alt: 'Fastrack' },
                { src: '/brands/under-armour.svg', alt: 'Under Armour' },
                { src: '/brands/skybags.svg', alt: 'Skybag' },
              ].concat([
                { src: '/brands/nike.svg', alt: 'Nike' },
                { src: '/brands/adidas.svg', alt: 'Adidas' },
                { src: '/brands/puma.svg', alt: 'Puma' },
                { src: '/brands/levi.svg', alt: 'Levi&apos;s' },
                { src: '/brands/calvin-klein.svg', alt: 'Calvin Klein' },
                { src: '/brands/allen-solly.svg', alt: 'Allen Solly' },
                { src: '/brands/zara.svg', alt: 'Zara' },
                { src: '/brands/h&m.svg', alt: 'H&M' },
                { src: '/brands/bata.svg', alt: 'Bata' },
                { src: '/brands/apple.svg', alt: 'Apple' },
                { src: '/brands/Tommy_Hilfiger.svg', alt: 'Tommy Hilfiger' },
                { src: '/brands/fossil.svg', alt: 'Fossil' },
                { src: '/brands/fastrack.svg', alt: 'Fastrack' },
                { src: '/brands/under-armour.svg', alt: 'Under Armour' },
                { src: '/brands/skybags.svg', alt: 'Skybag' },
              ]).map((brand, idx) => (
                <span
                  key={idx}
                  className="inline-block mx-8 align-middle"
                >
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    style={{
                      height: 40,
                      maxWidth: 100,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'inline-block',
                      filter: 'grayscale(60%)',
                      opacity: 0.85,
                      verticalAlign: 'middle',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-gray-800 hover:text-gray-900 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                    ${product.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black mb-2">{product.name}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">{product.rating}</span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="text-gray-800 hover:text-gray-900 font-medium text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With NXTLook Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
            Why Shop With NXTLook?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 flex items-center justify-center mb-4 rounded-full bg-yellow-100">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v4m8-4a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>Curated Collections</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Open Sans, Arial, sans-serif' }}>Handpicked styles from top brands, updated every season.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 flex items-center justify-center mb-4 rounded-full bg-green-100">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>Authenticity Guaranteed</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Open Sans, Arial, sans-serif' }}>100% genuine products, direct from the brands you love.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 flex items-center justify-center mb-4 rounded-full bg-blue-100">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4 4a4 4 0 01-4-4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3a4 4 0 01-4 4z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>Fast & Free Delivery</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Open Sans, Arial, sans-serif' }}>Lightning-fast shipping, free on all orders over $50.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 flex items-center justify-center mb-4 rounded-full bg-purple-100">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Raleway, Arial, sans-serif' }}>Easy Returns</h3>
              <p className="text-gray-600 text-sm" style={{ fontFamily: 'Open Sans, Arial, sans-serif' }}>No-hassle 30-day returns for a worry-free experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>NXTLook</span>
              </div>
              <p className="text-gray-400">
                Your premium destination for modern men&apos;s fashion and style.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">Orders</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 NXTLook. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Flash Message */}
      {flashMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center px-6 py-3 bg-green-100 border border-green-300 rounded-lg shadow-lg animate-flash-in">
          <svg className="w-7 h-7 text-green-600 mr-3 animate-tick" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-semibold text-lg">{flashMsg}</span>
          <style jsx>{`
            @keyframes flash-in {
              0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
              60% { opacity: 1; transform: translateY(4px) scale(1.05); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
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
