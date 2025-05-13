'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { featuredProducts, categories } from '@/app/data/product';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar />
            <Hero />
            
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="container mx-auto px-4 py-12"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
              <CategorySection categories={categories} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="container mx-auto px-4 py-12 bg-white"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Featured Products</h2>
                <a href="#" className="text-blue-600 hover:underline">View All</a>
              </div>
              <ProductGrid products={featuredProducts} />
            </motion.section>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

