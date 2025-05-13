// components/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold"
            >
              <span className="text-blue-600">SHOP</span>
              <span className="text-gray-800">HUB</span>
            </motion.div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Home</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Shop</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Categories</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">New Arrivals</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-blue-600"
            >
              <Search size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-blue-600"
            >
              <User size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-700 hover:text-blue-600"
            >
              <Heart size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                3
              </span>
            </motion.button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="flex flex-col py-4 px-4 space-y-3">
              <a href="#" className="text-gray-800 hover:text-blue-600 py-2 font-medium">Home</a>
              <a href="#" className="text-gray-800 hover:text-blue-600 py-2 font-medium">Shop</a>
              <a href="#" className="text-gray-800 hover:text-blue-600 py-2 font-medium">Categories</a>
              <a href="#" className="text-gray-800 hover:text-blue-600 py-2 font-medium">New Arrivals</a>
              <a href="#" className="text-gray-800 hover:text-blue-600 py-2 font-medium">Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}