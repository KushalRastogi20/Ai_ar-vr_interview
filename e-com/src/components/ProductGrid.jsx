'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative group">
            <img 
              src="/api/placeholder/300/300" 
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            
            {product.discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {product.discount}% OFF
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-blue-600 hover:text-white transition-colors"
              >
                <ShoppingCart size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-full p-2 mx-2 shadow-md hover:bg-red-500 hover:text-white transition-colors"
              >
                <Heart size={18} />
              </motion.button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
            </div>
            
            <h3 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-baseline mt-1">
              <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-gray-400 text-sm line-through ml-2">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}