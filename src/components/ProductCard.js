'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductCard({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    let imagePath = product.image;
    if (imagePath) {
      // Remove any leading './' or 'public/'
      imagePath = imagePath.replace(/^\.\/?|^public\//, '');
      // Ensure it starts with '/'
      if (!imagePath.startsWith('/')) imagePath = '/' + imagePath;
    }
    onAddToCart({
      ...product,
      image: imagePath,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:scale-105">
      {/* Product Image */}
      <div className="relative max-w-xs w-[90%] mx-auto mt-5 mb-2 aspect-[4/5] bg-[var(--background)] rounded-lg overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--foreground)' }}>
          ${product.price}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{product.name}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-2 sm:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Size Selection */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Size:</label>
          <div className="flex flex-wrap gap-1 sm:space-x-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md transition-colors ${
                  selectedSize === size
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Color:</label>
          <div className="flex flex-wrap gap-1 sm:space-x-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border rounded-md transition-colors ${
                  selectedColor === color
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity:</label>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
            >
              -
            </button>
            <span className="w-10 sm:w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gray-800 text-white border border-gray-800 py-2 px-4 rounded-md hover:bg-gray-900 focus:bg-gray-900 transition-colors duration-200 font-medium text-xs sm:text-base"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 