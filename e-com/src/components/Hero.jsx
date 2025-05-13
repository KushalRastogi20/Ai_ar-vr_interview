'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-black/50 z-10" />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/api/placeholder/1920/1080')`,
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Summer Collection 2025
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
          >
            Discover the latest trends and styles for your summer wardrobe. 
            Up to 40% off on selected items.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium text-center hover:bg-white/10 transition-colors"
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Floating sale tag */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="absolute top-1/4 right-12 z-30 hidden lg:block"
      >
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="bg-yellow-500 text-black font-bold py-6 px-6 rounded-full transform -rotate-12"
        >
          <div className="text-sm">SUMMER</div>
          <div className="text-3xl">SALE</div>
          <div className="text-lg">UP TO 40% OFF</div>
        </motion.div>
      </motion.div>
    </section>
  );
}
